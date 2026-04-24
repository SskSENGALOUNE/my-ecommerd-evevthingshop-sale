API Specification — Everything Shop

Base URL: http://localhost:3009

---

1. Auth — การยืนยันตัวตน

┌────────┬─────────────────────────┬────────┬────────────────┐
│ Method │ Endpoint │ Auth │ Description │
├────────┼─────────────────────────┼────────┼────────────────┤
│ POST │ /auth/customer/register │ Public │ ลูกค้าสมัครสมาชิก │
├────────┼─────────────────────────┼────────┼────────────────┤
│ POST │ /auth/customer/login │ Public │ ลูกค้าเข้าสู่ระบบ │
├────────┼─────────────────────────┼────────┼────────────────┤
│ POST │ /auth/admin/login │ Public │ Admin เข้าสู่ระบบ │
├────────┼─────────────────────────┼────────┼────────────────┤
│ GET │ /auth/me │ Bearer │ ดูข้อมูลตัวเอง │
└────────┴─────────────────────────┴────────┴────────────────┘

POST /auth/customer/register
// Request
{ "email": "john@example.com", "password": "Pass@1234", "name": "John" }

// Response 201
{ "id": "uuid", "email": "john@example.com", "name": "John", "accessToken": "jwt..." }

POST /auth/customer/login / POST /auth/admin/login
// Request
{ "email": "admin@shop.com", "password": "Admin@1234" }

// Response 200
{ "accessToken": "jwt...", "user": { "id": "uuid", "email": "...", "name": "...", "role":
"ADMIN" } }

---

2. Product — สินค้า (Public + Admin)

┌────────┬─────────────────────┬────────┬──────────────────────────────┐
│ Method │ Endpoint │ Auth │ Description │
├────────┼─────────────────────┼────────┼──────────────────────────────┤
│ GET │ /products │ Public │ ดูรายการสินค้าทั้งหมด (paginated) │
├────────┼─────────────────────┼────────┼──────────────────────────────┤
│ GET │ /products/:slug │ Public │ ดูรายละเอียดสินค้า + variants │
├────────┼─────────────────────┼────────┼──────────────────────────────┤
│ POST │ /admin/products │ Admin │ สร้างสินค้าใหม่ │
├────────┼─────────────────────┼────────┼──────────────────────────────┤
│ PUT │ /admin/products/:id │ Admin │ แก้ไขสินค้า │
├────────┼─────────────────────┼────────┼──────────────────────────────┤  
 │ DELETE │ /admin/products/:id │ Admin │ ลบสินค้า (soft delete) │
└────────┴─────────────────────┴────────┴──────────────────────────────┘

GET /products?page=1&limit=20&categoryId=uuid&search=เสื้อ  
 // Response 200
{  
 "data": [  
 {  
 "id": "uuid",  
 "name": "เสื้อยืดคอกลม",
"slug": "t-shirt-round-neck",
"basePrice": "199.00",  
 "mainImage": "https://...",
"category": { "id": "uuid", "name": "เสื้อผ้า" },  
 "variants": [  
 { "colorName": "แดง", "hexCode": "#FF0000", "sizes": ["S","M","L"], "inStock": true }
]  
 }  
 ],  
 "meta": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }  
 }

POST /admin/products
// Request (multipart/form-data สำหรับ images)  
 {  
 "name": "เสื้อยืดคอกลม",
"description": "เสื้อยืดคอตตอน 100%",
"basePrice": 199.00,  
 "sku": "SHIRT-001",  
 "categoryId": "uuid",  
 "hasSize": true,  
 "variants": [
{ "colorId": "uuid", "size": "S", "price": null, "quantity": 50 },
{ "colorId": "uuid", "size": "M", "price": null, "quantity": 100 },
{ "colorId": "uuid", "size": "L", "price": 219.00, "quantity": 30 }
]  
 }  
 // Response 201 — product object

---

3. Category — หมวดหมู่

┌────────┬───────────────────────┬────────┬─────────────────────┐
│ Method │ Endpoint │ Auth │ Description │  
 ├────────┼───────────────────────┼────────┼─────────────────────┤
│ GET │ /categories │ Public │ ดูหมวดหมู่ทั้งหมด (tree) │  
 ├────────┼───────────────────────┼────────┼─────────────────────┤
│ POST │ /admin/categories │ Admin │ สร้างหมวดหมู่ │  
 ├────────┼───────────────────────┼────────┼─────────────────────┤
│ PUT │ /admin/categories/:id │ Admin │ แก้ไขหมวดหมู่ │  
 ├────────┼───────────────────────┼────────┼─────────────────────┤  
 │ DELETE │ /admin/categories/:id │ Admin │ ลบหมวดหมู่ │
└────────┴───────────────────────┴────────┴─────────────────────┘

GET /categories
// Response 200
[  
 {
"id": "uuid", "name": "เสื้อผ้า", "slug": "clothing",
"children": [  
 { "id": "uuid", "name": "เสื้อยืด", "slug": "t-shirts", "children": [] }  
 ]  
 }  
 ]

---

4. Cart — ตะกร้าสินค้า

┌────────┬─────────────────┬──────────┬───────────────────┐  
 │ Method │ Endpoint │ Auth │ Description │
├────────┼─────────────────┼──────────┼───────────────────┤
│ GET │ /cart │ Customer │ ดูตะกร้า │
├────────┼─────────────────┼──────────┼───────────────────┤
│ POST │ /cart/items │ Customer │ เพิ่มสินค้าลงตะกร้า │  
 ├────────┼─────────────────┼──────────┼───────────────────┤  
 │ PATCH │ /cart/items/:id │ Customer │ แก้จำนวน │  
 ├────────┼─────────────────┼──────────┼───────────────────┤  
 │ DELETE │ /cart/items/:id │ Customer │ ลบสินค้าออกจากตะกร้า │
├────────┼─────────────────┼──────────┼───────────────────┤
│ DELETE │ /cart │ Customer │ ล้างตะกร้าทั้งหมด │
└────────┴─────────────────┴──────────┴───────────────────┘

GET /cart  
 // Response 200
{  
 "id": "uuid",
"items": [
{
"id": "uuid",
"product": { "id": "uuid", "name": "เสื้อยืดคอกลม", "mainImage": "..." },
"variant": { "id": "uuid", "sku": "SHIRT-RED-M", "colorName": "แดง", "size": "M",
"price": "199.00" },
"quantity": 2,
"subtotal": "398.00"
}
],  
 "totalAmount": "398.00",
"totalItems": 2
}

POST /cart/items  
 // Request  
 { "productId": "uuid", "variantId": "uuid", "quantity": 1 }
// Response 201 — cart object

PATCH /cart/items/:id
// Request  
 { "quantity": 3 }

---

5. Address — ที่อยู่จัดส่ง

┌────────┬────────────────────────┬──────────┬─────────────┐
│ Method │ Endpoint │ Auth │ Description │
├────────┼────────────────────────┼──────────┼─────────────┤  
 │ GET │ /addresses │ Customer │ ดูที่อยู่ทั้งหมด │
├────────┼────────────────────────┼──────────┼─────────────┤  
 │ POST │ /addresses │ Customer │ เพิ่มที่อยู่ │
├────────┼────────────────────────┼──────────┼─────────────┤  
 │ PUT │ /addresses/:id │ Customer │ แก้ไขที่อยู่ │
├────────┼────────────────────────┼──────────┼─────────────┤  
 │ DELETE │ /addresses/:id │ Customer │ ลบที่อยู่ │
├────────┼────────────────────────┼──────────┼─────────────┤
│ PATCH │ /addresses/:id/default │ Customer │ ตั้งเป็นที่อยู่หลัก │
└────────┴────────────────────────┴──────────┴─────────────┘

POST /addresses  
 // Request  
 {  
 "label": "ບ້ານ",
"fullName": "ສຸກສະໂຄນ",
"phone": "020-1234-5678",  
 "addressLine": "123/45 ถ.สุขุมวิท",  
 "subDistrict": "คลองตัน",  
 "district": "คลองเตย",  
 "province": "กรุงเทพ",  
 "postalCode": "10110"  
 }

---

6. Order — คำสั่งซื้อ

┌────────┬──────────────────────────┬──────────┬───────────────────────────────────┐
│ Method │ Endpoint │ Auth │ Description │  
 ├────────┼──────────────────────────┼──────────┼───────────────────────────────────┤
│ POST │ /orders │ Customer │ สร้าง order (checkout) │
├────────┼──────────────────────────┼──────────┼───────────────────────────────────┤
│ GET │ /orders │ Customer │ ดู orders ของตัวเอง │
├────────┼──────────────────────────┼──────────┼───────────────────────────────────┤
│ GET │ /orders/:id │ Customer │ ดูรายละเอียด order │
├────────┼──────────────────────────┼──────────┼───────────────────────────────────┤
│ POST │ /orders/:id/cancel │ Customer │ ยกเลิก order (เฉพาะ PENDING) │
├────────┼──────────────────────────┼──────────┼───────────────────────────────────┤  
 │ GET │ /admin/orders │ Admin │ ดู orders ทั้งหมด (filter, paginate) │
├────────┼──────────────────────────┼──────────┼───────────────────────────────────┤  
 │ GET │ /admin/orders/:id │ Admin │ ดูรายละเอียด order │
├────────┼──────────────────────────┼──────────┼───────────────────────────────────┤  
 │ PATCH │ /admin/orders/:id/status │ Admin │ เปลี่ยนสถานะ order │
└────────┴──────────────────────────┴──────────┴───────────────────────────────────┘

POST /orders (Checkout)  
 // Request  
 {  
 "shippingAddressId": "uuid",
"paymentMethod": "QR", // "QR" | "COD"
"note": "ส่งช่วงเย็น"  
 }  
 // Response 201  
 {  
 "id": "uuid",  
 "orderNumber": "ORD-20260423-0001",
"status": "PENDING",  
 "items": [...],  
 "subtotal": "597.00",
"shippingFee": "50.00",  
 "discount": "0.00",  
 "totalAmount": "647.00",
"paymentMethod": "QR"  
 }

GET /admin/orders?status=PENDING&page=1&limit=20&from=2026-04-01&to=2026-04-23

PATCH /admin/orders/:id/status
// Request  
 { "status": "CONFIRMED" }
// Allowed transitions:  
 // PENDING → CONFIRMED | CANCELLED
// CONFIRMED → PROCESSING | CANCELLED  
 // PROCESSING → SHIPPED  
 // SHIPPED → DELIVERED  
 // \* → REFUNDED (admin only)

---

7. Payment — การชำระเงิน

┌────────┬─────────────────────────────┬──────────┬───────────────────┐
│ Method │ Endpoint │ Auth │ Description │  
 ├────────┼─────────────────────────────┼──────────┼───────────────────┤
│ POST │ /payments/:orderId/slip │ Customer │ แนบสลิปโอนเงิน (QR) │
├────────┼─────────────────────────────┼──────────┼───────────────────┤
│ GET │ /admin/payments │ Admin │ ดูรายการรอ verify │  
 ├────────┼─────────────────────────────┼──────────┼───────────────────┤  
 │ PATCH │ /admin/payments/:id/approve │ Admin │ อนุมัติการชำระเงิน │  
 ├────────┼─────────────────────────────┼──────────┼───────────────────┤  
 │ PATCH │ /admin/payments/:id/reject │ Admin │ ปฏิเสธการชำระเงิน │
└────────┴─────────────────────────────┴──────────┴───────────────────┘

POST /payments/:orderId/slip (multipart/form-data)  
 // Request: file upload (slip image)
// Response 200  
 { "message": "สลิปถูกส่งแล้ว รอ admin ตรวจสอบ", "transactionId": "uuid" }

PATCH /admin/payments/:id/approve  
 // Response 200
{ "message": "อนุมัติเรียบร้อย", "orderStatus": "CONFIRMED" }  
 // Side effect: Order status → CONFIRMED, inventory deducted

---

8. Shipping — การจัดส่ง

┌────────┬───────────────────────────┬──────────┬─────────────────────────┐
│ Method │ Endpoint │ Auth │ Description │  
 ├────────┼───────────────────────────┼──────────┼─────────────────────────┤
│ GET │ /orders/:orderId/shipping │ Customer │ ดูสถานะจัดส่ง │  
 ├────────┼───────────────────────────┼──────────┼─────────────────────────┤
│ POST │ /admin/shipments │ Admin │ สร้าง shipment │  
 ├────────┼───────────────────────────┼──────────┼─────────────────────────┤
│ PATCH │ /admin/shipments/:id │ Admin │ อัปเดต tracking / status │  
 └────────┴───────────────────────────┴──────────┴─────────────────────────┘

POST /admin/shipments  
 // Request  
 { "orderId": "uuid", "carrier": "Kerry", "trackingNumber": "TH123456789" }
// Side effect: Order status → SHIPPED

PATCH /admin/shipments/:id
// Request  
 { "status": "DELIVERED", "note": "ลูกค้ารับแล้ว" }
// Side effect: Order status → DELIVERED

---

9. Inventory — สต็อก (Admin)

┌────────┬─────────────────────────────┬───────┬───────────────────────────────┐
│ Method │ Endpoint │ Auth │ Description │
├────────┼─────────────────────────────┼───────┼───────────────────────────────┤  
 │ GET │ /admin/inventory │ Admin │ ดูสต็อกทั้งหมด (paginate, filter) │
├────────┼─────────────────────────────┼───────┼───────────────────────────────┤  
 │ GET │ /admin/inventory/:variantId │ Admin │ ดูสต็อก + log ของ variant │
├────────┼─────────────────────────────┼───────┼───────────────────────────────┤
│ PATCH │ /admin/inventory/:variantId │ Admin │ ปรับสต็อก manual │
└────────┴─────────────────────────────┴───────┴───────────────────────────────┘

PATCH /admin/inventory/:variantId  
 // Request
{ "delta": 50, "reason": "PURCHASE", "note": "รับของเข้าล็อตใหม่" }  
 // Response 200  
 { "variantId": "uuid", "quantity": 150, "reservedQty": 5, "available": 145 }

---

Error Format (ทุก endpoint)

{  
 "statusCode": 400,  
 "error": "Bad Request",
"message": "สินค้าหมดสต็อก",
"timestamp": "2026-04-23T10:00:00.000Z",  
 "path": "/cart/items"  
 }

---

HTTP Status Codes ที่ใช้

┌──────┬─────────────────────────────────────────────────────┐
│ Code │ ใช้เมื่อ │
├──────┼─────────────────────────────────────────────────────┤
│ 200 │ สำเร็จ (GET, PATCH, PUT) │
├──────┼─────────────────────────────────────────────────────┤
│ 201 │ สร้างสำเร็จ (POST) │  
 ├──────┼─────────────────────────────────────────────────────┤
│ 400 │ Request ไม่ถูกต้อง / validation error │  
 ├──────┼─────────────────────────────────────────────────────┤  
 │ 401 │ ยังไม่ได้ login │
├──────┼─────────────────────────────────────────────────────┤  
 │ 403 │ ไม่มีสิทธิ์เข้าถึง │
├──────┼─────────────────────────────────────────────────────┤  
 │ 404 │ ไม่พบข้อมูล │
├──────┼─────────────────────────────────────────────────────┤  
 │ 409 │ Conflict (เช่น สต็อกไม่พอ, email ซ้ำ) │
├──────┼─────────────────────────────────────────────────────┤  
 │ 422 │ Unprocessable (เช่น order status transition ไม่ถูกต้อง) │
└──────┴─────────────────────────────────────────────────────┘

---

นี่คือ core features ทั้งหมด 9 modules ต้องการให้เจาะลึก module ไหนเพิ่มเติม หรือจะเริ่ม implement module
ไหนก่อนบอกได้เลย
