# CLAUDE.md — Backend (NestJS)

## Project Overview

NestJS 11 backend สำหรับร้านค้าออนไลน์ขายของใช้
Clean Architecture + CQRS pattern, PostgreSQL via Prisma ORM
Runs on port `3009`

---

## Architecture

```
src/
├── presentation/     # Controllers, DTOs, guards, interceptors
├── application/      # CQRS commands, queries, handlers
├── domain/           # Entities, repository interfaces, domain exceptions
├── infrastructure/   # Prisma repos, JWT strategy, Kafka, HTTP clients
├── shared/           # Global providers
└── utilities/        # Health check, logging interceptor
```

**Layer rule:** dependencies flow inward — presentation → application → domain ← infrastructure

---

## Domain Modules

```
src/
├── auth/             # Login/register — customer & admin (JWT)
├── admin/            # Multi-admin management, roles, permissions
├── product/          # Products, categories, images
├── inventory/        # Stock management
├── customer/         # Customer profiles, shipping addresses
├── cart/             # Shopping cart
├── order/            # Orders, order status lifecycle
├── payment/
│   ├── qr/           # QR slip upload → admin manual approval
│   └── cod/          # Cash on delivery
└── shipping/         # Delivery tracking, shipping status
```

---

## Commands

```bash
# Development
npm run start:dev          # Watch mode (auto-reload)
npm run start              # One-time start

# Database
npm run prisma:generate    # Regenerate Prisma client after schema changes
npm run prisma:migrate     # Run migrations (dev)
npm run prisma:seed        # Seed default admin user
npm run prisma:studio      # Open Prisma GUI (port 5555)

# Testing
npm run test               # Unit tests
npm run test:e2e           # End-to-end tests
npm run test:cov           # Coverage report
npm run test:arch          # Architecture / dependency rules

# Build & Prod
npm run build
npm run start:prod

# Code quality
npm run lint               # ESLint with auto-fix
npm run format             # Prettier format
```

---

## Environment Variables

Required in `.env`:

```env
PORT=3009
DATABASE_URL="postgresql://admin:admin5688@localhost:5433/myecommerce"
JWT_SECRET=your_secret_here
JWT_ADMIN_SECRET=your_admin_secret_here
NODE_ENV=development
```

---

## Database (Prisma + PostgreSQL)

**Current Models:** `User`, `ExTable`, `Transactions`

**Planned Models:**
- `Product`, `Category`, `ProductImage`
- `Inventory`
- `Customer`, `Address`
- `Cart`, `CartItem`
- `Order`, `OrderItem`
- `Payment` (QR slip, COD)
- `Shipping`
- `Admin`

**Enums:**
- `Role`: SUPER_ADMIN | ADMIN | CUSTOMER
- `OrderStatus`: PENDING | CONFIRMED | SHIPPING | DELIVERED | CANCELLED
- `PaymentMethod`: QR | COD
- `PaymentStatus`: PENDING | WAITING_APPROVAL | APPROVED | REJECTED
- `ShippingStatus`: PENDING | PACKED | SHIPPED | DELIVERED

After changing `prisma/schema.prisma`, always run:
```bash
npm run prisma:migrate
npm run prisma:generate
```

Default seeded admin: `username=admin`, `password=Admin@1234`

---

## Authentication

- JWT Bearer tokens, 7-day expiration
- All routes are protected by default via `JwtAuthGuard`
- Use `@Public()` decorator to skip auth
- Use `@Roles(Role.ADMIN)` for role-based access
- Use `@CurrentUser()` to inject the authenticated user

---

## Payment Flow

### QR Payment
```
Customer สร้าง order
→ เลือก QR payment
→ ระบบแสดง QR / บัญชีโอนเงิน
→ Customer โอนเงิน + แนบสลิป
→ Admin รับ notification
→ Admin ตรวจสลิป → Approve / Reject
→ Order status อัปเดต
```

### COD
```
Customer สร้าง order
→ เลือก COD
→ Admin ยืนยัน order
→ จัดส่ง
→ เก็บเงินปลายทาง
→ Admin mark ว่า delivered + paid
```

---

## API Endpoints (Planned)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/auth/login` | Login (customer/admin) |
| POST | `/auth/register` | Register customer |
| GET | `/products` | List products (public) |
| GET | `/products/:id` | Product detail (public) |
| POST | `/admin/products` | Create product (admin) |
| PUT | `/admin/products/:id` | Update product (admin) |
| DELETE | `/admin/products/:id` | Delete product (admin) |
| GET | `/cart` | Get cart |
| POST | `/cart/items` | Add to cart |
| POST | `/orders` | Create order |
| GET | `/orders` | My orders |
| GET | `/admin/orders` | All orders (admin) |
| PUT | `/admin/orders/:id/status` | Update order status (admin) |
| POST | `/payments/qr/:orderId` | Upload QR slip |
| PUT | `/admin/payments/:id/approve` | Approve payment (admin) |
| GET | `/shipping/:orderId` | Track shipping |

**Swagger UI:** `http://localhost:3009/api`

---

## Adding a New Feature (CQRS Pattern)

1. **Domain** — entity + repository interface ใน `src/domain/<feature>/`
2. **Application** — command/query + handler ใน `src/application/<feature>/`
3. **Infrastructure** — implement repository ใน `src/infrastructure/prisma/repositories/`
4. **Presentation** — controller + DTOs ใน `src/presentation/<feature>/`
5. Register module ใน `app.module.ts`

See `CQRS_GUIDE.md` สำหรับตัวอย่าง pattern

---

## Key Libraries

| Library | Purpose |
|---------|---------|
| `@nestjs/cqrs` | CQRS pattern |
| `@nestjs/jwt` + `passport-jwt` | Authentication |
| `prisma` | ORM + migrations |
| `class-validator` | DTO validation |
| `@nestjs/swagger` | API docs |
| `kafkajs` | Kafka messaging |
| `bcrypt` | Password hashing |
| `winston` | Logging |

---

## Docker

```bash
docker-compose up -d       # Start PostgreSQL + backend
docker build -t backend .  # Build image
```

See `DOCKER_SETUP.md` สำหรับรายละเอียด
