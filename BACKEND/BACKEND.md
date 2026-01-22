# Template E-commerce (Backend) — "Mini-Shopify" simplifié

Objectif : un backend **stable**, **scalable**, et **SEO-friendly** pour une boutique e-commerce moderne (Railway + PostgreSQL), avec :
- Catalogue produits/variantes, catégories, tags, SEO metadata
- Panier, commandes, paiement Stripe
- Stock auto (mouvements + réservations)
- Emails transactionnels + **relance panier abandonné**
- Dashboard admin (CRUD + commandes + clients + paniers abandonnés)
- Webhooks + outbox + jobs (pour la robustesse)
- Tracking + passerelle GA4 (récupération d’events + liens vers dashboards)

---

## 1) Architecture (monorepo recommandé)

### Monorepo (pnpm + turbo)
```
/apps
  /api            # Backend NestJS/Fastify
  /storefront     # Front Next.js (voir FRONTEND.md)
  /admin          # Admin Next.js (option : dans storefront avec /admin)
/packages
  /types          # Types partagés (DTO, enums)
  /validators     # Zod / class-validator
  /config         # env schema + constants
  /ui             # (option) composants UI partagés
```

### Infra (Railway)
- **PostgreSQL** (principal)
- **Redis** (cache + BullMQ)
- (Option) **Meilisearch** (recherche rapide)
- Storage : **S3 compatible** (R2/AWS) pour images produits

---

## 2) Stack backend conseillée

- Runtime : Node.js 20+
- Langage : TypeScript
- Framework : **NestJS** (reco) ou Fastify (light)
- ORM : Prisma (reco) ou Drizzle
- Queue : BullMQ
- Cache/rate limit : Redis
- Paiement : Stripe (PaymentIntents)
- Emails : Resend / Postmark / SendGrid (au choix)
- Observabilité : Sentry + logs JSON
- API doc : OpenAPI/Swagger

---

## 3) Contraintes "stabilité" (non négociables)

### 3.1 Idempotency partout
- Webhooks Stripe : table `webhook_events` + `event_id` unique
- Checkout create payment : `idempotency_key`
- Emails : `email_outbox` + statut

### 3.2 Pattern Outbox (anti perte d’événements)
Toute action critique écrit en DB :
- L’action (ex : order paid)
- Un événement dans `outbox_events`

Un worker (BullMQ) dépile `outbox_events` et exécute :
- Envoi email
- Sync tiers
- Logs analytics

Si le worker crashe → l’événement reste et sera rejoué.

### 3.3 Stock : mouvements + réservations
- Ne jamais faire `stock = stock - 1` brut.
- Toujours utiliser :
  - `inventory_movements` (in/out)
  - `inventory_reservations` (hold sur panier / checkout)

---

## 4) Data model (PostgreSQL)

### 4.1 Principales tables

#### Users / Customers
- `users` : compte admin/staff
- `customers` : comptes clients
- `customer_addresses`

#### Catalog
- `products` (title, slug, description, status)
- `product_variants` (sku, barcode, title, price, compare_at_price)
- `product_images` (url, alt, position)
- `categories` (title, slug, parent_id)
- `product_categories` (pivot)
- `tags` (title, slug)
- `product_tags` (pivot)

#### SEO
- `seo_metadata` (entity_type, entity_id, meta_title, meta_description, canonical_url, og_image, noindex)

#### Cart
- `carts` (customer_id nullable, status: ACTIVE/ABANDONED/CONVERTED)
- `cart_items` (variant_id, qty, snapshot_price)
- `cart_events` (added/removed/checkout_started)

#### Orders
- `orders` (status, totals, customer, shipping, billing)
- `order_items` (variant snapshot)
- `payments` (provider, status, amount)
- `refunds`
- `shipments` (status, tracking)

#### Inventory
- `inventory_items` (variant_id, available_qty, reserved_qty)
- `inventory_movements` (type, qty, reason, order_id nullable)
- `inventory_reservations` (cart_id, variant_id, qty, expires_at)

#### Emails
- `email_templates` (type, subject, html, variables_schema)
- `email_outbox` (to, template_type, payload_json, status, sent_at)

#### Webhooks / Outbox
- `webhook_events` (provider, event_id unique, payload, processed_at)
- `outbox_events` (type, payload, status, attempts, next_retry_at)

#### Analytics bridge
- `analytics_events` (event_name, source, payload, created_at)
- `integration_settings` (ga4_measurement_id, api_secret, etc.)

> Note : la GA “data” (vraies stats) ne vit pas en base. On stocke **les events e-commerce** + liens d’admin pour l’UX.

---

## 5) Modules backend (domain-driven)

### 5.1 CatalogModule
- CRUD produits / variantes / images
- CRUD catégories / tags
- Slug unique + redirect table `url_redirects`
- Gestion SEO metadata par entité

### 5.2 CartModule
- Panier guest + customer
- Persistance
- Réservations stock à chaque modification
- Abandon detection

### 5.3 Checkout/PaymentsModule
- Création PaymentIntent
- Calcul taxes/livraison
- Stripe webhook : payment succeeded → order paid

### 5.4 OrdersModule
- Création order depuis cart snapshot
- Gestion statuts :
  - DRAFT → PENDING_PAYMENT → PAID → FULFILLED → COMPLETED
  - CANCELLED, REFUNDED
- Exports CSV

### 5.5 CustomersModule
- Liste clients
- Historique commandes
- Emails marketing opt-in (option)

### 5.6 EmailModule
Emails transactionnels :
- Confirmation commande
- Paiement reçu
- Expédition
- Facture (option)

Relance panier abandonné :
- J+0.5 (30-60 min), J+1, J+3 (configurable)
- Annule automatiquement si cart converti

### 5.7 AdminModule
- Auth staff
- RBAC (ADMIN, MANAGER, SUPPORT)
- Audit logs

### 5.8 AnalyticsModule
- Event bus interne (order_created, order_paid, product_viewed…)
- Option : envoi server-side vers GA4 via Measurement Protocol
- UI admin :
  - KPIs calculés : CA, commandes, AOV, conversion cart→order
  - Lien direct vers GA4 + filtres

---

## 6) API contract (REST + OpenAPI)

### 6.1 Storefront (public + actions)
- `GET /v1/store/products?category=&tag=&q=&page=`
- `GET /v1/store/products/:slug`
- `GET /v1/store/categories`
- `POST /v1/store/cart` (create)
- `POST /v1/store/cart/:id/items` (add)
- `PATCH /v1/store/cart/:id/items/:itemId` (qty)
- `DELETE /v1/store/cart/:id/items/:itemId`
- `POST /v1/store/checkout` (create intent)
- `POST /v1/store/checkout/confirm` (optional)

### 6.2 Admin
- `POST /v1/admin/auth/login`
- `GET /v1/admin/products`
- `POST /v1/admin/products`
- `PATCH /v1/admin/products/:id`
- `POST /v1/admin/products/:id/images`
- `GET /v1/admin/orders`
- `PATCH /v1/admin/orders/:id/status`
- `GET /v1/admin/customers`
- `GET /v1/admin/carts?status=ABANDONED`
- `POST /v1/admin/carts/:id/send-recovery-email`
- `GET /v1/admin/analytics/kpis?from=&to=`

---

## 7) Panier abandonné — logique robuste

### 7.1 Définition
Un panier passe en ABANDONED si :
- status ACTIVE
- dernière activité > X minutes (ex 60)
- contient au moins 1 item
- pas converti en commande

### 7.2 Worker cron
- Toutes les 10 minutes :
  - Marque ABANDONED
  - Enqueue séquences emails si pas déjà envoyées

### 7.3 Lien de récupération
- Token signé : `cart_recovery_tokens(cart_id, token_hash, expires_at)`
- Front : `/cart/recover?token=...`

---

## 8) Emails — système simple mais clean

### Templates
- Stockés en DB ou en fichiers versionnés (reco : fichiers + build)
- Variables typées (ex : `{{customer.firstName}}`, `{{cart.url}}`)

### Providers
- Resend (simple), Postmark (excellent deliverability)

### Règles
- **Un seul endroit** qui envoie réellement : le worker
- La transaction DB crée une entrée outbox + email_outbox

---

## 9) Admin Dashboard (fonctionnel)

### Pages admin essentielles
- Produits
  - Liste + recherche
  - Edit : titre, description, images, catégories, tags, SKU, variantes
  - SEO : meta title, meta desc, canonical, index/noindex
  - Stock : vue qty, mouvements, réservations
- Commandes
  - Liste + filtres (status, date, montant)
  - Détail commande + remboursement (Stripe)
- Clients
  - Liste + détail + commandes
- Paniers abandonnés
  - Liste + score (montant, récence)
  - Action : renvoyer email de recouvrement
- Analytics
  - KPIs simples + liens GA4

---

## 10) Sécurité
- RBAC
- Rate limit
- Validation inputs
- Sanitization HTML (description)
- Uploads sécurisés (S3 presigned)
- Audit logs (qui a modifié quoi)

---

## 11) Environnements & config

### Variables Railway (ex)
- `DATABASE_URL`
- `REDIS_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `EMAIL_PROVIDER_KEY`
- `PUBLIC_STORE_URL`
- `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`
- `GA4_MEASUREMENT_ID`, `GA4_API_SECRET` (option)

---

## 12) Roadmap d’implémentation (v1 template)

### Phase 0 — Foundations
- Monorepo + Docker compose
- Prisma schema + migrations
- Auth admin + RBAC

### Phase 1 — Catalogue
- Produits/variantes/images
- Catégories/tags
- SEO metadata

### Phase 2 — Cart + Stock
- Panier guest
- Réservations + inventory

### Phase 3 — Checkout
- Stripe PaymentIntent
- Webhooks
- Orders

### Phase 4 — Emails
- Transactionnels
- Abandoned cart (sequence)

### Phase 5 — Admin + Analytics
- CRUD complet
- KPIs

---

## 13) Prompts Antigravity (à coller)

### Prompt Backend (fondations)
**Objectif :** générer `apps/api` (NestJS), Prisma, Redis, BullMQ, Stripe webhooks, OpenAPI.

Contenu attendu :
- Monorepo pnpm/turbo
- API NestJS
- Prisma schema complet (tables listées)
- Modules : catalog, cart, orders, payments, emails, admin, analytics
- Workers BullMQ + cron
- Webhook stripe idempotent + outbox
- Tests basiques (unit)
- Docker compose local

> Ensuite tu feras un second prompt pour l’admin UI et un troisième pour le storefront.
