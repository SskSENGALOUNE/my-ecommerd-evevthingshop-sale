# CLAUDE.md — Frontend (Next.js)

## Project Overview

Next.js frontend สำหรับร้านค้าออนไลน์ขายของใช้
มี 2 ส่วนหลัก: **Customer Storefront** และ **Admin Dashboard**
Runs on port `3000`

---

## App Structure

```
src/
├── app/
│   ├── (store)/              # Customer storefront
│   │   ├── page.tsx          # หน้าแรก / สินค้าแนะนำ
│   │   ├── products/         # รายการสินค้า + detail
│   │   ├── cart/             # ตะกร้าสินค้า
│   │   ├── checkout/         # สั่งซื้อ + เลือกวิธีชำระ
│   │   ├── orders/           # ประวัติ order
│   │   └── account/          # ข้อมูลส่วนตัว, ที่อยู่
│   ├── (auth)/               # Login / Register
│   │   ├── login/
│   │   └── register/
│   └── admin/                # Admin dashboard (protected)
│       ├── dashboard/        # ภาพรวม ยอดขาย
│       ├── products/         # จัดการสินค้า
│       ├── orders/           # จัดการ order
│       ├── payments/         # ตรวจสอบสลิป QR + อนุมัติ
│       ├── shipping/         # อัปเดตสถานะจัดส่ง
│       ├── inventory/        # จัดการสต็อก
│       └── admins/           # จัดการ admin (SUPER_ADMIN only)
├── components/
│   ├── ui/                   # shadcn/ui base components
│   ├── store/                # Customer-facing components
│   └── admin/                # Admin-specific components
├── lib/
│   ├── api/                  # API client functions (fetch wrappers)
│   ├── auth/                 # Auth helpers, token management
│   └── utils/                # Utilities
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript types (shared with API)
└── middleware.ts              # Route protection (auth guard)
```

---

## Commands

```bash
npm run dev          # Development server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

---

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3009
NEXT_PUBLIC_APP_NAME=Everything Shop
```

---

## API Integration

Backend base URL: `http://localhost:3009`
Swagger docs: `http://localhost:3009/api`

**Auth headers:**
```ts
Authorization: Bearer <jwt_token>
```

Token เก็บใน `httpOnly cookie` หรือ `localStorage` (ตัดสินใจก่อน implement)

---

## Pages Overview

### Customer (store)

| Path | Page |
|------|------|
| `/` | หน้าแรก, สินค้าแนะนำ |
| `/products` | รายการสินค้าทั้งหมด + filter |
| `/products/:id` | รายละเอียดสินค้า |
| `/cart` | ตะกร้าสินค้า |
| `/checkout` | สั่งซื้อ + เลือกชำระเงิน |
| `/checkout/qr/:orderId` | อัปโหลดสลิป QR |
| `/orders` | ประวัติ order |
| `/orders/:id` | รายละเอียด order + tracking |
| `/account` | ข้อมูลส่วนตัว |

### Admin

| Path | Page |
|------|------|
| `/admin` | Dashboard ยอดขาย |
| `/admin/products` | รายการสินค้า |
| `/admin/products/new` | เพิ่มสินค้า |
| `/admin/products/:id/edit` | แก้ไขสินค้า |
| `/admin/orders` | รายการ order ทั้งหมด |
| `/admin/orders/:id` | รายละเอียด order |
| `/admin/payments` | รายการ QR slip รอตรวจ |
| `/admin/inventory` | สต็อกสินค้า |
| `/admin/admins` | จัดการ admin (SUPER_ADMIN) |

---

## Payment UI Flow

### QR Payment
```
Checkout → เลือก QR
→ หน้าแสดงเลขบัญชี / QR code
→ Customer อัปโหลดสลิป
→ รอ admin อนุมัติ (polling หรือ websocket)
→ แสดงสถานะ approved / rejected
```

### COD
```
Checkout → เลือก COD
→ ยืนยัน order
→ รอ admin confirm + จัดส่ง
```

---

## Key Libraries (Planned)

| Library | Purpose |
|---------|---------|
| `next` 15 | Framework |
| `tailwindcss` | Styling |
| `shadcn/ui` | UI components |
| `react-query` / `swr` | Data fetching + caching |
| `react-hook-form` | Form management |
| `zod` | Schema validation |
| `zustand` | Global state (cart, auth) |
| `next-auth` | Authentication (optional) |

---

## Auth & Route Protection

- `middleware.ts` protect `/admin/*` → redirect ถ้าไม่มี token หรือไม่ใช่ admin
- `middleware.ts` protect `/orders`, `/cart`, `/checkout` → redirect ถ้าไม่ได้ login
- `/` และ `/products/*` เป็น public

---

## Notes

- ใช้ Next.js **App Router** (ไม่ใช่ Pages Router)
- Admin และ Customer ใช้ JWT token แยกกัน
- Image upload สำหรับสินค้าและสลิป QR ส่งผ่าน API (multipart/form-data)
