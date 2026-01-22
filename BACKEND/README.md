# E-Commerce Backend

Professional e-commerce backend built with NestJS, PostgreSQL, Prisma, and Stripe.

## Features

✅ JWT Authentication with refresh tokens  
✅ Role-Based Access Control (ADMIN/STAFF)  
✅ Complete Product CRUD with auto-generated slugs  
✅ Public Storefront API with filtering & sorting  
✅ Shopping Cart with abandoned cart detection  
✅ Stripe Payment Integration  
✅ Automated Email Notifications  
✅ Swagger API Documentation

## Tech Stack

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Passport
- **Payments**: Stripe
- **Jobs**: BullMQ + Redis
- **Email**: Nodemailer (configurable)
- **API Docs**: Swagger/OpenAPI

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis (for BullMQ jobs)
- pnpm (recommended) or npm

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env and configure your database and API keys

# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Seed database with sample data
pnpm prisma:seed
```

## Running the Application

```bash
# Development mode
pnpm dev

# Production mode
pnpm build
pnpm start:prod
```

The API will be available at `http://localhost:3000`  
Swagger documentation at `http://localhost:3000/docs`

## Environment Variables

See `.env.example` for all required variables:

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `STRIPE_SECRET_KEY` - Stripe API secret key

### Optional
- `REDIS_HOST`, `REDIS_PORT` - Redis configuration for jobs
- `EMAIL_PROVIDER` - Email service (nodemailer/resend/brevo)
- `STORAGE_*` - S3-compatible storage config

## API Endpoints

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/refresh` - Refresh access token

### Admin - Products
- `POST /admin/products` - Create product (requires auth)
- `GET /admin/products` - List all products
- `PATCH /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

### Storefront (Public)
- `GET /store/products` - List published products
- `GET /store/products/:slug` - Get product by slug
- `GET /store/collections` - List collections
- `GET /store/collections/:slug/products` - Products in collection

### Cart
- `POST /cart` - Create cart
- `GET /cart/:id` - Get cart
- `POST /cart/:id/items` - Add item to cart
- `PATCH /cart/:id/items/:itemId` - Update quantity
- `DELETE /cart/:id/items/:itemId` - Remove item

## Database Schema

- **Admin** - Admin users with roles
- **Product** - Products with SEO, images, stock
- **Collection** - Product categories/collections
- **Cart** - Shopping carts (guest + user)
- **CartItem** - Cart line items
- **Order** - Orders with status workflow
- **OrderItem** - Order line items
- **PaymentIntent** - Stripe payment tracking

## Default Admin Credentials

After running the seed:
- **Email**: `admin@ecommerce.local`
- **Password**: `admin123`

⚠️ **Change these credentials in production!**

## Deployment (Railway)

1. Create a new Railway project
2. Add PostgreSQL and Redis services
3. Set Root Directory to `backend`
4. Configure environment variables
5. Deploy!

Railway will automatically:
- Install dependencies
- Build the application
- Run migrations

## Scripts

```bash
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start:prod             # Start production server
pnpm prisma:generate        # Generate Prisma client
pnpm prisma:migrate         # Run migrations
pnpm prisma:seed            # Seed database
pnpm prisma:studio          # Open Prisma Studio
```

## License

UNLICENSED
