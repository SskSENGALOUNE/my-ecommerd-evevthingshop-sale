# Backend Feature Roadmap

## Legend
- ✅ Done
- 🚧 In Progress
- ⬜ Todo

---

## Module 1 — Auth
| Feature | Status |
|---------|--------|
| Admin login (JWT) | ✅ |
| Customer login email/password (JWT) | ✅ |
| Customer register email/password | ✅ |
| Customer login via Google (Supabase OAuth) | ✅ |

---

## Module 2 — Banner
| Feature | Status |
|---------|--------|
| GET /banners (public) | ✅ |
| GET /admin/banners | ✅ |
| POST /admin/banners | ✅ |
| PUT /admin/banners/:id | ✅ |
| DELETE /admin/banners/:id | ✅ |

---

## Module 3 — Category
| Feature | Status |
|---------|--------|
| GET /categories (public) | ✅ |
| GET /admin/categories | ✅ |
| POST /admin/categories | ✅ |
| PUT /admin/categories/:id | ✅ |
| DELETE /admin/categories/:id | ✅ |

---

## Module 4 — Color
| Feature | Status |
|---------|--------|
| GET /colors | ✅ |
| POST /admin/colors | ✅ |
| PUT /admin/colors/:id | ✅ |
| DELETE /admin/colors/:id | ✅ |

---

## Module 5 — Product ⬜
> ไม่มี variant — สินค้าราคาเดียว, รูปหลายรูปได้, upload ผ่าน Supabase Storage

| Feature | Status |
|---------|--------|
| Domain: ProductEntity, IProductRepository | ⬜ |
| GET /products (public, filter by category, search, pagination) | ⬜ |
| GET /products/:id (public) | ⬜ |
| POST /admin/products (create + upload images) | ⬜ |
| PUT /admin/products/:id | ⬜ |
| DELETE /admin/products/:id (soft delete) | ⬜ |
| POST /admin/products/:id/images (upload รูป → Supabase Storage) | ⬜ |
| DELETE /admin/products/:id/images/:imageId | ⬜ |
| PATCH /admin/products/:id/toggle-active | ⬜ |

---

## Module 6 — Customer Profile ⬜
| Feature | Status |
|---------|--------|
| GET /customer/me (profile ของตัวเอง) | ⬜ |
| PUT /customer/me (แก้ชื่อ, เบอร์โทร) | ⬜ |
| GET /customer/me/addresses | ⬜ |
| POST /customer/me/addresses | ⬜ |
| PUT /customer/me/addresses/:id | ⬜ |
| DELETE /customer/me/addresses/:id | ⬜ |
| PATCH /customer/me/addresses/:id/set-default | ⬜ |

---

## Module 7 — Cart ⬜
| Feature | Status |
|---------|--------|
| GET /cart (ตะกร้าของตัวเอง) | ⬜ |
| POST /cart/items (เพิ่มสินค้า) | ⬜ |
| PUT /cart/items/:itemId (เปลี่ยน qty) | ⬜ |
| DELETE /cart/items/:itemId | ⬜ |
| DELETE /cart (ล้างตะกร้าทั้งหมด) | ⬜ |

---

## Module 8 — Order ⬜
| Feature | Status |
|---------|--------|
| POST /orders (สร้าง order จาก cart) | ⬜ |
| GET /orders/my (list order ของตัวเอง) | ⬜ |
| GET /orders/my/:id (รายละเอียด order) | ⬜ |
| GET /admin/orders (all orders + filter status) | ⬜ |
| GET /admin/orders/:id | ⬜ |
| PATCH /admin/orders/:id/status (update status) | ⬜ |
| POST /admin/orders/:id/cancel | ⬜ |

---

## Module 9 — Payment ⬜
> Phase 1: QR (slip upload) + COD

| Feature | Status |
|---------|--------|
| POST /payments/qr/:orderId/slip (customer แนบสลิป) | ⬜ |
| GET /admin/payments (list รอ approve) | ⬜ |
| PATCH /admin/payments/:id/approve | ⬜ |
| PATCH /admin/payments/:id/reject | ⬜ |

---

## Module 10 — Shipping ⬜
| Feature | Status |
|---------|--------|
| POST /admin/shipping/:orderId (สร้าง shipment) | ⬜ |
| PATCH /admin/shipping/:id/status (update PACKED → SHIPPED → DELIVERED) | ⬜ |
| GET /shipping/:orderId (customer ดู tracking) | ⬜ |

---

## Module 11 — Admin Dashboard Stats ⬜
| Feature | Status |
|---------|--------|
| GET /admin/dashboard (total orders, revenue, pending payments, new customers) | ⬜ |

---

## Build Order (แนะนำ)
```
Product → Customer Profile → Cart → Order → Payment → Shipping → Dashboard
```
