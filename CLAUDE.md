# CLAUDE.md — Everything Shop (E-Commerce)

## Business Overview

ร้านค้าออนไลน์ขายของใช้ เจ้าของร้านคนเดียว บริหารโดย Admin
รองรับ Multi-Admin ในอนาคต แต่ปัจจุบันใช้ Role-based access control เตรียมไว้

---

## Project Structure

```
my-ecommerd-evevthing-shop/
├── backend/          # NestJS 11 — REST API
├── frontend/         # Next.js — Customer storefront + Admin dashboard
└── docker-compose.yml
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS 11, TypeScript, Clean Architecture + CQRS |
| Frontend | Next.js (App Router), TypeScript |
| Database | PostgreSQL 15 (via Prisma ORM) |
| Auth | JWT (separate tokens for customer / admin) |
| Messaging | Kafka (async events) |
| Containerization | Docker + Docker Compose |

---

## Domain Modules

| Module | Description |
|--------|-------------|
| `auth` | Login/register สำหรับ customer และ admin |
| `admin` | จัดการ admin หลายคน + permissions |
| `product` | สินค้า, หมวดหมู่, รูปภาพ |
| `inventory` | สต็อกสินค้า |
| `customer` | ข้อมูลลูกค้า, ที่อยู่จัดส่ง |
| `cart` | ตะกร้าสินค้า |
| `order` | คำสั่งซื้อ, สถานะ order |
| `payment` | QR (admin verify manual), COD |
| `shipping` | การจัดส่ง, tracking status |

---

## Payment Phases

### Phase 1 (ปัจจุบัน)
- **QR Payment** — ลูกค้าโอน → แนบสลิป → admin อนุมัติ manual
- **COD** — เก็บเงินปลายทาง

### Phase 2 (อนาคต)
- **Payment Gateway** — Omise / 2C2P (ยังไม่ตัดสินใจ)

---

## User Roles

| Role | สิทธิ์ |
|------|--------|
| `SUPER_ADMIN` | จัดการ admin คนอื่น + ทุก feature |
| `ADMIN` | จัดการสินค้า, order, payment |
| `CUSTOMER` | ซื้อสินค้า, ดู order ตัวเอง |

---

## Port Map (Development)

| Service | Port |
|---------|------|
| Backend API | 3009 |
| Frontend | 3000 |
| PostgreSQL | 5433 |
| Prisma Studio | 5555 |

---

## API Base URL

- Dev: `http://localhost:3009`
- Swagger: `http://localhost:3009/api`

---

## Development Flow

1. เริ่ม services: `docker-compose up -d` (PostgreSQL)
2. Backend: `cd backend && npm run start:dev`
3. Frontend: `cd frontend && npm run dev`
4. ทำ migration: `cd backend && npm run prisma:migrate`
