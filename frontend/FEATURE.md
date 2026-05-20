# Frontend Feature Roadmap

## Legend
- ✅ Done
- 🚧 In Progress
- ⬜ Todo

---

## Auth Pages
| Feature | Route | Status |
|---------|-------|--------|
| Admin login | /admin/login | ✅ |
| Customer login (Google + Email) | /login | ✅ |
| Customer register (Google + Email/Password) | /register | ✅ |
| Google OAuth callback | /auth/callback | ✅ |

---

## Store — Customer Side

### หน้าแรก
| Feature | Backend | Frontend |
|---------|---------|---------|
| Banner carousel (GET /banners) | ✅ | ✅ |
| หมวดหมู่ shortcut (GET /categories) | ✅ | ✅ |
| สินค้าแนะนำ (GET /products) | ⬜ | ⬜ |

### สินค้า
| Feature | Route | Status |
|---------|-------|--------|
| รายการสินค้า (grid, filter category, search) | /products | ⬜ |
| รายละเอียดสินค้า (รูป, ราคา, ปุ่มเพิ่มตะกร้า) | /products/[id] | ⬜ |

### ตะกร้า & Checkout
| Feature | Route | Status |
|---------|-------|--------|
| ตะกร้าสินค้า (list items, qty, ลบ) | /cart | ⬜ |
| Checkout (เลือกที่อยู่, เลือก QR/COD) | /checkout | ⬜ |
| QR Payment (แสดง QR, อัพโหลดสลิป) | /checkout/qr/[orderId] | ⬜ |

### Orders
| Feature | Route | Status |
|---------|-------|--------|
| รายการ order ของฉัน | /orders | ⬜ |
| รายละเอียด order + tracking | /orders/[id] | ⬜ |

### Profile
| Feature | Route | Status |
|---------|-------|--------|
| หน้า profile (avatar, ชื่อ, email) | /account | ✅ |
| แก้ไขชื่อ / เบอร์โทร | /account/edit | ⬜ |
| จัดการที่อยู่จัดส่ง | /account/addresses | ⬜ |
| เพิ่ม/แก้ไขที่อยู่ | /account/addresses/new | ⬜ |

---

## Admin Dashboard

### Layout & Auth
| Feature | Status |
|---------|--------|
| Admin login + middleware protect | ✅ |
| Sidebar navigation | ✅ |

### Dashboard
| Feature | Route | Status |
|---------|-------|--------|
| Stats cards (orders, revenue, customers, pending) | /admin/dashboard | ⬜ |
| Recent orders table | /admin/dashboard | ⬜ |

### สินค้า
| Feature | Route | Status |
|---------|-------|--------|
| รายการสินค้า + search | /admin/products | ⬜ |
| เพิ่มสินค้า (form + upload รูป Supabase) | /admin/products/new | ⬜ |
| แก้ไขสินค้า | /admin/products/[id]/edit | ⬜ |
| Toggle active/inactive | /admin/products | ⬜ |

### หมวดหมู่ & Banner
| Feature | Status |
|---------|--------|
| Banner CRUD | ✅ |
| Category CRUD | ✅ |

### Orders
| Feature | Route | Status |
|---------|-------|--------|
| รายการ order ทั้งหมด + filter status | /admin/orders | ⬜ |
| รายละเอียด order | /admin/orders/[id] | ⬜ |
| Update order status | /admin/orders/[id] | ⬜ |

### Payments
| Feature | Route | Status |
|---------|-------|--------|
| รายการรอ approve (QR slip) | /admin/payments | ⬜ |
| ดูสลิป + Approve / Reject | /admin/payments | ⬜ |

### Shipping
| Feature | Route | Status |
|---------|-------|--------|
| สร้าง shipment + update status | /admin/shipping | ⬜ |

### Customers
| Feature | Route | Status |
|---------|-------|--------|
| รายการลูกค้า | /admin/admins | ⬜ |

---

## Build Order (แนะนำ)
```
Admin Products → Store Products → Store Product Detail
→ Cart → Checkout → Orders
→ Admin Orders → Admin Payments → Admin Shipping
→ Customer Addresses → Admin Dashboard Stats
```
