# Template E-commerce (Frontend) — Storefront Next.js (Vercel)

Objectif : un storefront **rapide**, **SEO-first**, simple à maintenir, connecté au backend (Railway), avec :
- Pages produits + catégories + recherche
- Panier + checkout Stripe
- Récupération panier abandonné
- SEO complet (schema.org, sitemap, canonicals)
- Performance Core Web Vitals
- Tracking GA4 + events e-commerce

---

## 1) Stack

- Next.js (App Router) + TypeScript
- Tailwind + shadcn/ui
- Data fetching : server components + fetch caching
- State panier : cookie + localStorage + sync API
- Images : next/image + placeholders
- SEO : Metadata API + JSON-LD

Déploiement : **Vercel**

---

## 2) Structure du projet

```
/apps/storefront
  /app
    /(site)
      /page.tsx
      /c/[slug]/page.tsx
      /p/[slug]/page.tsx
      /search/page.tsx
      /cart/page.tsx
      /checkout/page.tsx
      /account/*
      /blog/*            # option
      /pages/[slug]/*    # landing pages SEO
    /api
      /cart/*            # routes server pour cookies/session
  /components
  /lib
  /styles
```

---

## 3) Pages indispensables (v1)

### 3.1 Home `/`
- Hero
- Collections
- Best sellers
- Trust blocks

### 3.2 Catégorie `/c/[slug]`
- SEO title/desc propres
- Listing produits
- Pagination SEO-safe
- Filtres (option) :
  - techniquement via query params
  - SEO : `noindex` sur les combinaisons de filtres

### 3.3 Produit `/p/[slug]`
- Galerie images
- Sélecteur variantes
- Ajout panier
- Infos livraison/retour
- JSON-LD Product + Offer

### 3.4 Recherche `/search`
- Toujours **noindex**

### 3.5 Panier `/cart`
- Items
- Qty update
- Cross-sell (option)

### 3.6 Checkout `/checkout`
- Adresse + shipping method
- Stripe PaymentElement
- Confirmation

### 3.7 Récupération panier `/cart/recover?token=`
- Appelle backend : valide token
- Restaure panier
- Redirige `/cart`

---

## 4) SEO blueprint (complet)

### 4.1 Metadata
Pour chaque page indexable :
- title
- description
- canonical
- og/twitter

### 4.2 Canonical + filtres
- Catégories sans filtres : canonical = elle-même
- Catégories avec filtres :
  - `robots: noindex, follow`
  - canonical = URL catégorie clean

### 4.3 JSON-LD
- Organization (sitewide)
- WebSite + SearchAction (sitewide)
- BreadcrumbList (catégorie + produit)
- Product + Offer (produit)

### 4.4 Sitemap
- `/sitemap.xml` dynamique
- Segmentation : products, categories, pages, blog
- Ping automatique possible (option)

### 4.5 Robots
- Allow pages indexables
- Disallow search/filters/checkout

---

## 5) Performance (Core Web Vitals)

- `next/image` partout
- Responsive images + sizes
- Lazy loading au bon endroit
- Préchargement des polices
- Caching Next :
  - ISR sur catégories + produits (revalidate)
  - Cache tags (revalidateTag) quand admin modifie un produit

---

## 6) Tracking & GA4

### 6.1 Events e-commerce standard
Envoyer des events côté front (gtag) + côté backend (option) :
- view_item
- add_to_cart
- begin_checkout
- purchase

### 6.2 Liaison Admin
Dans l’admin, afficher :
- lien GA4 property
- KPIs calculés backend (CA, commandes, panier moyen)

---

## 7) Intégration API (clean)

### 7.1 Client API
- `lib/api.ts` : wrapper fetch
- endpoints publics :
  - products
  - categories
  - cart
  - checkout

### 7.2 Panier persistant
- Cookie `cart_id` httpOnly (route handler Next)
- Si user loggé : associer cart au customer
- Sync à chaque action

---

## 8) UI/UX (simple mais pro)

- Header sticky (search + cart)
- Mega menu catégories
- Product card : image, title, price, badges
- Product page : sticky add-to-cart mobile
- Checkout : étapes claires

---

## 9) Roadmap implémentation (storefront)

### Phase 0
- setup Next + Tailwind + UI kit
- wrappers API

### Phase 1
- Pages catégorie + produit SSR/ISR
- Panier

### Phase 2
- Checkout Stripe
- Purchase tracking

### Phase 3
- SEO pack complet (json-ld, sitemap, canonicals)

### Phase 4
- Récupération panier + email links

---

## 10) Prompt Antigravity (Storefront)

**Objectif :** générer un storefront Next.js App Router SEO-first.

Contenu attendu :
- App Router
- Pages : /, /c/[slug], /p/[slug], /cart, /checkout, /cart/recover
- JSON-LD complet
- sitemap + robots
- wrapper API
- cookie cart_id via route handlers
- Stripe elements intégration
