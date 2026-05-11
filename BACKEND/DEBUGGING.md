# 🔧 Guide de Débogage - Backend E-Commerce

## Étapes pour résoudre les erreurs actuelles

### 1. Générer le Prisma Client

La plupart des erreurs viennent du fait que le Prisma Client n'est pas encore généré.

```bash
cd backend
pnpm prisma generate
```

✅ **Cela va résoudre** :
- Toutes les erreurs "Property 'product' does not exist on type 'PrismaService'"
- Toutes les erreurs "Module '@prisma/client' has no exported member 'Role'"
- Les imports de types Prisma

---

### 2. Créer/Configurer la Base de Données PostgreSQL

Vous avez 2 options :

#### Option A : PostgreSQL Local (Recommandé pour dev)

1. Installer PostgreSQL localement
2. Créer une base de données :
```sql
CREATE DATABASE ecommerce_dev;
```

3. Mettre à jour le `.env` :
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_dev?schema=public"
```

#### Option B : Utiliser Prisma Postgres (Cloud gratuit)

```bash
npx prisma accelerate:start
```

Suivre les instructions pour obtenir un `DATABASE_URL` automatiquement.

---

### 3. Exécuter les Migrations

Une fois la base de données configurée :

```bash
pnpm prisma migrate dev --name init
```

✅ **Cela va** :
- Créer toutes les tables dans la base de données
- Générer automatiquement le Prisma Client
- Appliquer le schéma complet

---

### 4. Seed la Base de Données

```bash
pnpm prisma seed
```

✅ **Cela va créer** :
- 1 admin (admin@ecommerce.local / admin123)
- 3 collections
- 10 produits avec images

---

### 5. Démarrer le Serveur

```bash
pnpm dev
```

Le serveur devrait démarrer sur http://localhost:3000

Swagger disponible sur http://localhost:3000/docs

---

## Erreurs Résiduelles et Solutions

### Erreur : "Cannot find module './xxx.service'"

**Cause** : TypeScript n'a pas encore compilé/reconnu les nouveaux fichiers

**Solution** :
```bash
# Nettoyer le cache TypeScript
rm -rf dist
rm -rf node_modules/.cache

# Redémarrer TypeScript server dans VSCode
Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Ou simplement redémarrer pnpm dev
```

---

### Erreur : Stripe API version

**Cause** : La version de Stripe changé récemment

**Solution** : Les fichiers ont déjà été corrigés pour utiliser `'2025-12-15.clover'`

Si l'erreur persiste, vérifier que vous avez bien la dernière version :
```bash
pnpm add stripe@latest
```

---

###  Erreur : "isolatedModules" TypeScript warning

**Cause** : Configuration TypeScript stricte avec decorators

**Solution** : Déjà configuré dans `tsconfig.json`. Si problème persiste :
```typescript
// Ajouter `type` keyword pour les imports de types
import type { Request } from 'express';
```

---

## Séquence Complète de Débogage

Si vous rencontrez toujours des problèmes, suivez cette séquence complète :

```bash
# 1. Nettoyer tout
cd backend
rm -rf node_modules
rm -rf dist
rm -rf .next

# 2. Réinstaller
pnpm install

# 3. Générer Prisma Client
pnpm prisma generate

# 4. Configurer .env avec votre DATABASE_URL

# 5. Créer et migrer la base de données
pnpm prisma migrate dev --name init

# 6. Seed
pnpm prisma seed

# 7. Démarrer
pnpm dev
```

---

## Vérifier que Tout Fonctionne

### Test 1 : Swagger est accessible
```
http://localhost:3000/docs
```

Vous devriez voir tous les endpoints documentés.

### Test 2 : Login Admin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.local","password":"admin123"}'
```

Devrait retourner un `accessToken`.

### Test 3 : Liste des produits
```bash
curl http://localhost:3000/store/products
```

Devrait retourner les 10 produits du seed.

---

## Variables d'Environnement Minimales

Pour un démarrage rapide, vous n'avez besoin que de :

```env
# REQUIS
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# OPTIONNEL (valeurs par défaut OK pour dev)
PORT=3000
CORS_ORIGIN="http://localhost:3001"
APP_URL="http://localhost:3000"

# Stripe (laisser placeholder pour dev sans paiements)
STRIPE_SECRET_KEY="sk_test_placeholder"
STRIPE_WEBHOOK_SECRET="whsec_placeholder"

# Email (nodemailer mock pour dev)
EMAIL_PROVIDER="nodemailer"
EMAIL_FROM="noreply@ecommerce.local"
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="test"
SMTP_PASS="test"
```

---

## Déploiement Railway (Production)

### Préparation

1. Pusher le code sur GitHub
2. Créer un nouveau projet Railway
3. Ajouter PostgreSQL service (Railway le configurera automatiquement)
4. Connecter votre repo GitHub
5. Configurer :
   - **Root Directory**: `backend`
   - **Build Command**: `pnpm install && pnpm build && pnpm prisma generate`
   - **Start Command**: `pnpm prisma migrate deploy && pnpm start:prod`

### Variables d'Environnement Railway

Railway va automatiquement créer `DATABASE_URL`.

Vous devez ajouter :
```env
JWT_SECRET=production-secret-change-this
JWT_REFRESH_SECRET=production-refresh-change-this
STRIPE_SECRET_KEY=sk_live_your_real_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CORS_ORIGIN=https://your-frontend.vercel.app
EMAIL_PROVIDER=resend
EMAIL_PROVIDER_KEY=re_your_api_key
```

---

## Support

Si vous rencontrez encore des problèmes :

1. **Vérifier les logs** :
```bash
pnpm dev
# Lire attentivement les erreurs
```

2. **Vérifier Prisma Studio** :
```bash
pnpm prisma studio
# Ouvre une interface visuelle pour voir la DB
```

3. **Vérifier que le schema est appliqué** :
```bash
pnpm prisma db pull
# Compare le schema avec la DB réelle
```

---

## Checklist Avant de Continuer

- [ ] `pnpm prisma generate` exécuté sans erreur
- [ ] `pnpm prisma migrate dev` a créé les tables
- [ ] `pnpm prisma seed` a chargé les données
- [ ] `pnpm dev` démarre le serveur
- [ ] http://localhost:3000/docs affiche Swagger
- [ ] Peut login avec admin@ecommerce.local
- [ ] Peut lister les produits sur `/store/products`

Une fois tout ✅, le backend est pleinement fonctionnel !
