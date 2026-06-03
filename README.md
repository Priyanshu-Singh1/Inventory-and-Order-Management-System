# Inventory and Order Management System

A full-stack inventory and order management platform built with Next.js, Neon PostgreSQL, and Prisma. Features three distinct roles: **Admin**, **Seller**, and **Buyer**.

## Project Overview

This project provides a marketplace-style system where Sellers list products and manage their inventory, Buyers browse, filter, and purchase products, and an Admin oversees the entire platform.

### Key Features
- **Three-Role Authentication**: Admin, Seller, and Buyer with distinct dashboards and permissions.
- **Seller Product Management**: Sellers can add products, set pricing (in INR), configure inventory, and view orders placed for their products.
- **Buyer Catalog & Ordering**: Buyers can search/filter products, select quantities in any supported unit, preview dynamic pricing, and place orders.
- **Admin Oversight**: Admins can view all products (with seller info), all orders (with buyer and seller details), and all registered users.
- **Dynamic Unit Conversion**: Consistent conversions between g/kg and mL/L with real-time price calculation.
- **High-Precision Data**: Uses `Decimal(24,8)` for quantities and `Decimal(19,4)` for prices to ensure zero floating-point inaccuracies.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (hosted on [Neon](https://neon.tech/))
- **ORM**: Prisma (Version 6)
- **Authentication**: NextAuth.js (v4, Credentials Provider)
- **Styling**: Tailwind CSS v4
- **Precision Math**: `decimal.js`
- **Icons**: `lucide-react`

## High-Level System Design

```
┌─────────────┐       ┌──────────────────────┐       ┌──────────────┐
│   Browser   │◄─────►│  Next.js App Router  │◄─────►│  Neon        │
│   (React)   │       │  (Server Components  │       │  PostgreSQL  │
│             │       │   + Server Actions)  │       │              │
└─────────────┘       └──────────────────────┘       └──────────────┘
```

- **Frontend**: React Server Components for data fetching, Client Components for interactivity (forms, cart).
- **Backend**: Next.js Server Actions handle mutations (create product, place order). NextAuth handles authentication.
- **Database**: Prisma ORM communicates with Neon PostgreSQL. All schema managed via Prisma migrations.

## Database Schema

### User
| Field    | Type   | Notes                     |
|----------|--------|---------------------------|
| id       | UUID   | Primary key               |
| email    | String | Unique                    |
| password | String | bcrypt hashed             |
| role     | Enum   | ADMIN, SELLER, or BUYER   |

### Product
| Field             | Type          | Notes                                      |
|-------------------|---------------|----------------------------------------------|
| id                | UUID          | Primary key                                  |
| name              | String        | Product name                                 |
| description       | String?       | Optional description                         |
| dimension         | Enum          | WEIGHT, VOLUME, or COUNT                     |
| inventoryQuantity | Decimal(24,8) | Always stored in base unit (g, mL, or item)  |
| price             | Decimal(19,4) | INR rate                                     |
| pricingUnit       | Enum          | g, kg, mL, L, or item                       |
| sellerId          | UUID          | FK to User (the seller who listed it)        |

### Order
| Field       | Type          | Notes                          |
|-------------|---------------|--------------------------------|
| id          | UUID          | Primary key                    |
| userId      | UUID          | FK to User (the buyer)         |
| status      | Enum          | QUOTATION, CONFIRMED, etc.     |
| totalAmount | Decimal(19,4) | Total in INR                   |

### OrderItem
| Field               | Type          | Notes                                    |
|----------------------|---------------|------------------------------------------|
| id                   | UUID          | Primary key                              |
| orderId              | UUID          | FK to Order                              |
| productId            | UUID          | FK to Product                            |
| displayQuantity      | Decimal(24,8) | What the buyer entered (e.g., 500)       |
| displayUnit          | Enum          | What unit they chose (e.g., g)           |
| orderedBaseQuantity  | Decimal(24,8) | Converted to base unit (e.g., 500 g)     |
| priceAtTimeOfOrder   | Decimal(19,4) | Snapshot of calculated price in INR      |

### Why Decimal(24,8) and Decimal(19,4)?
- **Decimal(24,8)**: Supports values up to 10^16 with 8 decimal places. Handles both very large quantities (e.g., millions of grams of industrial chemicals) and very small ones (e.g., 0.001 mL).
- **Decimal(19,4)**: Standard for financial/monetary values. Supports up to ₹10^15 with paisa-level precision.

## Unit Storage and Conversion Strategy

### 1. Internal Storage (Base Units)
All inventory levels are stored in a singular "Base Unit" determined by their dimension:
- **Weight**: stored in `grams` (g)
- **Volume**: stored in `milliliters` (mL)
- **Count**: stored in `items`

### 2. Pricing Configuration
Instead of forcing prices into a tiny base-unit rate (which can cause rounding errors, e.g., 50 INR/kg → 0.05 INR/g), we store the exact rate defined by the seller:
- `price`: e.g., 50.00
- `pricingUnit`: e.g., 'kg'

This preserves the exact business intent: "This item costs ₹50 per kg".

### 3. Conversion Factors
| From | To   | Factor |
|------|------|--------|
| kg   | g    | × 1000 |
| g    | kg   | ÷ 1000 |
| L    | mL   | × 1000 |
| mL   | L    | ÷ 1000 |
| item | item | × 1    |

### 4. Where Conversions Are Applied
- **Before Saving (Order Placement)**: The buyer's entered quantity (e.g., 500g) is converted to the base unit and stored as `orderedBaseQuantity`. Inventory is decremented by this base amount.
- **During Calculation (Price Preview & Order Total)**: The buyer's quantity is converted to the `pricingUnit` to calculate cost. E.g., 500g → 0.5kg → 0.5 × ₹50/kg = ₹25.
- **Before Display**: Inventory can be displayed in user-friendly units (e.g., 5000g shown as 5kg).

All math uses `decimal.js` to avoid JavaScript floating-point issues.

## Local Setup

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech/) PostgreSQL Database

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd inventory-and-order-management-system
npm install
```

### 2. Environment Variables
Create a `.env` file at the root:
```env
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup & Seeding
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

## Test Credentials

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@example.com   | admin123   |
| Seller | seller@example.com  | seller123  |
| Buyer  | buyer@example.com   | buyer123   |

## User Flows

### Seller Flow
1. Log in as `seller@example.com`.
2. Navigate to **My Products** → **Add Product**.
3. Fill in product name, dimension (Weight/Volume/Count), inventory (in base units), price (INR), and pricing unit.
4. View your listed products and received orders.

### Buyer Flow
1. Log in as `buyer@example.com`.
2. Browse the **Product Catalog**. Use search and category filters.
3. For each product, select quantity and unit (e.g., 500 g). See the dynamic price preview.
4. Click **Add** to cart. Review cart and click **Place Order**.
5. View order history under **My Orders**.

### Admin Flow
1. Log in as `admin@example.com`.
2. **Dashboard**: See platform-wide metrics (products, orders, sellers, buyers).
3. **All Products**: View every product with the seller who listed it.
4. **All Orders**: View every order with buyer info, seller info, ordered quantities, base quantities, and calculated pricing.
5. **Users**: View all registered users and their activity.

## Deploying to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Configure Environment Variables in Vercel:
   - `DATABASE_URL`: Your Neon connection string.
   - `NEXTAUTH_SECRET`: A secure random string.
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://my-app.vercel.app`).
4. Deploy. Vercel will automatically run `npm run build`.
