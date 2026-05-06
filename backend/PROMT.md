<!-- อ่าน backend/MODULE_GUIDE.md + CONVENTIONS.md + prisma schema model
Product

สร้าง module product ตาม pattern category
 admin เท่านั้น (CRUD พื้นฐาน) -->

# PROMT.md — Prompt Cookbook สำหรับ Vibe Coding

> Template พร้อม copy-paste สำหรับงานบน project นี้
> วงเล็บมุม `<...>` = แทนค่าของคุณ

---

## 📑 สารบัญ

1. [Simple CRUD module](#1-simple-crud-module)
2. [Module มี relation](#2-module-ที่มี-relation)
3. [Module ที่ใช้ transaction](#3-module-ที่ใช้-transaction-หลาย-table)
4. [Module แยก admin / customer](#4-module-แยก-admin--customer)
5. [Module ที่มี file upload](#5-module-ที่มี-file-upload)
6. [Module ที่มี state machine](#6-module-ที่มี-state-machine)
7. [Public + Admin endpoint](#7-module-มี-public--admin-endpoint)
8. [Pagination / Search / Filter](#8-เพิ่ม-pagination--search--filter)
9. [Event publishing (Kafka)](#9-event-publishing-kafka)
10. [Bug fix / Refactor / Test](#10-bug-fix--refactor--test)
11. [Plan-first / Review](#11-plan-first--review)

---

## 1. Simple CRUD module

**ใช้กับ:** brand, color, tag, banner type ฯลฯ — ตารางเดี่ยว ไม่มี relation ซับซ้อน

```
/new-module เพิ่ม module <noun>
ฟิลด์:
  - <field1>: <type> (<unique? required?>)
  - <field2>: <type>
  - isActive: boolean default true
admin เท่านั้น (CRUD)
soft delete: ใช่
```

**ตัวอย่างจริง:**

```
/new-module เพิ่ม module brand
ฟิลด์:
  - name: string unique required
  - logoUrl: string optional
  - description: text optional
  - isActive: boolean default true
admin เท่านั้น
soft delete: ใช่
```

---

## 2. Module ที่มี relation

**ใช้กับ:** product (ผูก category), product-image (ผูก product), address (ผูก customer)

```
สร้าง module <child> ที่ผูกกับ <parent> (one-to-many)

ฟิลด์ child:
  - <parentId>: uuid (FK → <parent>.id)
  - <field1>: ...
  - <field2>: ...

Rules:
  - onDelete: <Cascade | Restrict>  ของ <parent>
  - findAll/findById ของ child ต้อง include <parent> ด้วย
  - validate ว่า <parentId> มีจริงก่อน create

ทำตาม pattern category + ARCHITECTURE.md + MODULE_GUIDE.md
```

**ตัวอย่าง (product image):**

```
สร้าง module product-image ผูกกับ product (one-to-many)
ฟิลด์: productId, url, order(int), isMain(boolean)
onDelete: Cascade
findAllByProductId — sort by order ASC
endpoint: POST /admin/products/:productId/images, DELETE /admin/products/:productId/images/:id
```

---

## 3. Module ที่ใช้ transaction หลาย table

**ใช้กับ:** create order (Order + OrderItem + Inventory + Cart cleanup), approve payment

```
สร้าง command <verb><noun> ที่แตะหลาย table

ใน handler ใช้ prisma.$transaction:
  1. <step 1: read/validate>
  2. <step 2: create main entity>
  3. <step 3: create child entities>
  4. <step 4: update related state>
  5. throw exception ถ้า <condition>

ห้าม commit จนกว่าทุก step จะสำเร็จ
อ่าน CONVENTIONS.md ส่วน "Transaction Pattern" ก่อนเริ่ม
```

**ตัวอย่าง (create order):**

```
สร้าง command CreateOrder
flow ใน $transaction:
  1. อ่าน cart ของ customer + lock variant inventory
  2. validate ทุก variant มี stock พอ (ไม่พอ → InsufficientStockException → 409)
  3. คำนวณ subtotal/shippingFee/totalAmount
  4. create Order + OrderItem (snapshot productName, image, price, color, size)
  5. update Inventory: reservedQty += qty
  6. log InventoryLog reason=RESERVATION
  7. clear cart items
  8. return { orderId, orderNumber }

OrderNumber format: ORD-YYYYMMDD-XXXX (รันต่อในวันเดียว)
endpoint: POST /orders (customer only)
```

---

## 4. Module แยก admin / customer

**ใช้กับ:** order (admin เห็นทั้งหมด, customer เห็นของตัวเอง), address, cart

```
สร้าง module <noun> 2 ฝั่ง:

Admin endpoints (/admin/<plural>):
  - <list/create/update/delete ที่ admin ทำได้>
  - guard: JwtAdminGuard

Customer endpoints (/me/<plural>):
  - <action ของตัวเอง>
  - guard: JwtCustomerGuard
  - filter: where customerId = req.user.id (จาก JWT)

แยก 2 controllers: <noun>.controller.ts (admin), my-<noun>.controller.ts (customer)
ใน handler — receive customerId เป็น param แล้ว enforce ใน repository
```

**ตัวอย่าง (order):**

```
module order มี 2 ฝั่ง:

/admin/orders (JwtAdminGuard):
  - GET / — ดู order ทั้งหมด (filter status, date range, customer)
  - GET /:id — รายละเอียด
  - PUT /:id/status — เปลี่ยน status (validate state machine)
  - PUT /:id/cancel — admin cancel

/me/orders (JwtCustomerGuard):
  - GET / — order ของตัวเอง
  - GET /:id — เฉพาะของตัวเอง (404 ถ้าไม่ใช่)
  - POST /:id/cancel — cancel ได้เฉพาะ status=PENDING
```

---

## 5. Module ที่มี file upload

**ใช้กับ:** payment slip, product image, banner image, admin avatar

```
endpoint <method> <path> รับ file upload

Validate:
  - max size: <X>MB
  - MIME whitelist: <list>
  - ตรวจ magic bytes (ไม่ trust extension)
  - rename เป็น UUID
  - เก็บนอก public/ → path: <storage path>

ใช้ FileInterceptor + อ่าน SECURITY.md ส่วน "File Upload"
return: { url } (หรือ signed URL ถ้า private)
```

**ตัวอย่าง (payment slip):**

```
endpoint POST /payments/qr/:orderId/slip (customer)
รับไฟล์ slip:
  - max 5MB
  - MIME: image/jpeg, image/png, image/webp
  - rename: <orderId>-<uuid>.<ext>
  - เก็บที่ uploads/slips/ (private — outside public/)
  - return slipUrl

หลัง upload สำเร็จ:
  - update Transactions.slipUrl, status=PENDING
  - update Order.status = PENDING (รอ admin approve)
  - publish event PaymentSlipUploaded เพื่อแจ้ง admin
```

---

## 6. Module ที่มี state machine

**ใช้กับ:** OrderStatus, PaymentStatus, ShipmentStatus

```
implement state machine สำหรับ <Enum>

Allowed transitions:
  PENDING    → CONFIRMED, CANCELLED
  CONFIRMED  → PROCESSING, CANCELLED
  PROCESSING → SHIPPED
  SHIPPED    → DELIVERED
  DELIVERED  → REFUNDED
  (อื่น ๆ ไม่ valid → throw BadRequestException)

ใส่ method ใน entity: canTransitionTo(next: Status): boolean
ใน UpdateStatusHandler:
  1. โหลด entity ปัจจุบัน
  2. ถ้า canTransitionTo(newStatus) === false → BadRequestException
  3. update + log
  4. publish event <Noun>StatusChanged
```

**ตัวอย่าง:**

```
สร้าง UpdateOrderStatusHandler
รับ orderId + targetStatus
validate transition ตาม table ข้างบน
ถ้า PENDING → CANCELLED: ปล่อย inventory reservation (Inventory.reservedQty -= qty + InventoryLog reason=RESERVATION_RELEASE)
ถ้า CONFIRMED → CANCELLED: ปล่อยเช่นกัน + แจ้ง customer
endpoint: PUT /admin/orders/:id/status
```

---

## 7. Module มี public + admin endpoint

**ใช้กับ:** product, category, banner — admin จัดการ + storefront อ่าน

```
สร้าง module <noun> 2 controllers:

<noun>.controller.ts — admin (JwtAdminGuard)
  /admin/<plural>: CRUD เต็ม

public-<noun>.controller.ts — public (no guard)
  /<plural>: GET list (filter isActive=true, deletedAt=null)
  /<plural>/:slug: GET detail

repo:
  - findAll() — admin ใช้, return ทั้งหมด
  - findAllPublic() — public ใช้, where isActive=true, deletedAt=null
  - findBySlug(slug)
```

**ตัวอย่าง (product):**

```
module product มี admin + public:

/admin/products: CRUD เต็ม + จัดการ images, variants
/products: GET list (filter category, search by name, sort)
/products/:slug: GET รายละเอียด + images + variants

public:
  - filter: isActive=true, deletedAt=null
  - hidden field: createdBy, updatedBy, internal cost
```

---

## 8. เพิ่ม pagination / search / filter

```
เพิ่ม query params ให้ GET /<endpoint>:
  - page (default 1)
  - limit (default 20, max 100)
  - search (optional, search ใน <fields>)
  - sortBy (whitelist: <fields>)
  - sortOrder (asc | desc)
  - filter: <field>=<value> (whitelist เท่านั้น)

DTO รับ query: ใช้ class-validator + @Type(() => Number) สำหรับ page/limit
Response shape:
  {
    items: [...],
    total: <count>,
    page, limit,
    totalPages
  }

อ่าน CONVENTIONS.md ส่วน "Response Shape"
```

**ตัวอย่าง:**

```
GET /admin/orders รองรับ:
  - page, limit
  - status (filter)
  - search (เลข orderNumber หรือ customer email)
  - dateFrom, dateTo (filter createdAt)
  - sortBy: createdAt | totalAmount
```

---

## 9. Event publishing (Kafka)

```
หลัง command สำเร็จ → publish event ผ่าน EventBus

1. สร้าง event class: src/domain/<noun>/events/<verb>-<noun>.event.ts
2. ใน handler: this.eventBus.publish(new <Event>(...))
3. สร้าง event handler ใน application/<noun>/events/
4. infrastructure/messaging/kafka.publisher.ts → relay ไป Kafka topic

อ่าน ARCHITECTURE.md ส่วน "Patterns"
```

**ตัวอย่าง:**

```
หลัง CreateOrder สำเร็จ → publish OrderCreatedEvent
หลัง ApprovePayment → publish PaymentApprovedEvent
event handler:
  - OrderCreatedEvent → ส่ง notification ให้ admin
  - PaymentApprovedEvent → update Order.status, ส่ง email ให้ customer
```

---

## 10. Bug fix / Refactor / Test

### Bug fix

```
ใน <file>:<line> มี bug: <อาการ>
expected: <ที่คาดหวัง>
actual: <ที่เกิด>

อ่าน <relevant doc> ก่อน
แก้แค่ root cause — ห้าม refactor อย่างอื่น
```

### Refactor

```
refactor <file/module> ให้ตรง CONVENTIONS.md
เช็ค:
  - file naming
  - response shape
  - exception type
  - soft delete filter
ห้ามเปลี่ยน behavior — แค่จัดระเบียบ
```

### เขียน test

```
เขียน unit test ให้ <Handler/Entity>
cover:
  - happy path
  - <edge case 1>
  - <edge case 2>
  - exception path

ตาม pattern ใน TESTING.md ส่วน "Unit Test"
```

---

## 11. Plan-first / Review

### ขอ plan ก่อนทำ (งานใหญ่)

```
อย่าเพิ่งเขียน code

อ่าน <relevant docs> ก่อน
แล้วเสนอ plan สำหรับ: <งาน>
ระบุ:
  - ไฟล์ที่จะสร้าง/แก้ (path เต็ม)
  - migration ที่ต้องทำ
  - breaking change (ถ้ามี)
  - test ที่ต้องเขียน
  - คำถาม/จุดที่ยังไม่ชัด

รอฉัน approve ก่อนเริ่ม
```

### Review code ของตัวเอง

```
review code ที่เพิ่งสร้างใน <module>:
  1. ตรง ARCHITECTURE.md? (dependency rule)
  2. ตรง CONVENTIONS.md? (naming, soft delete, response)
  3. มี security risk? (อ่าน SECURITY.md)
  4. ขาด validation อะไร?
  5. test coverage พอ?

ตอบเป็น checklist + ถ้าเจอปัญหา fix เลย
```

### Pre-commit review

```
ก่อน commit เช็คให้:
  - npm run lint ผ่าน
  - npm run test ผ่าน
  - npm run test:arch ผ่าน
  - มี migration file commit ไปด้วย
  - apiSpace.md อัปเดตแล้ว (ถ้ามี endpoint ใหม่)
```

---

## 🎁 Bonus: Combo prompts (vibe coding ขั้นเทพ)

### Combo 1: scaffold + test + register

```
1. /new-module review (ฟิลด์: productId, customerId, rating 1-5, comment)
2. เขียน unit test ให้ทุก handler ตาม TESTING.md
3. update apiSpace.md ใส่ endpoint ใหม่
4. ยังไม่ต้อง migrate — ฉันจะ review schema ก่อน
```

### Combo 2: feature ใหญ่ — แตกย่อย

```
ฉันจะทำ feature "checkout" ทั้ง flow

แตกเป็น steps + ทำทีละขั้น:
1. cart → validate stock
2. create order + reserve inventory
3. payment selection (QR / COD)
4. ถ้า QR → upload slip
5. admin approve → confirm order
6. shipping create

ทำขั้นที่ 1 ก่อน เสร็จแล้วหยุด ให้ฉันเทสก่อน
แล้วค่อยทำขั้นต่อ
```

### Combo 3: รอบ refactor ใหญ่

```
project ฉันมี module เก่า ๆ ที่ไม่ตาม CONVENTIONS.md
ทำ task list:
1. scan module ทั้งหมด
2. list violation ของแต่ละ module
3. รอฉันเลือก ว่าจะแก้อันไหนก่อน
ห้ามเริ่มแก้จนกว่าจะ approve
```

---

## ⚡ Quick Reference

| ต้องการ              | พิมพ์                             |
| -------------------- | --------------------------------- |
| Module ใหม่          | `/new-module`                     |
| ดูว่าทำอะไรอยู่      | `/status`                         |
| Plan งานใหญ่         | "ขอ plan ก่อน"                    |
| Stop & ถาม           | "หยุดก่อน + อธิบายให้ฟัง"         |
| ทำตามแบบ X           | "ตาม pattern <module>"            |
| ตอบสั้น              | "ตอบสั้น ๆ" หรือ "no explanation" |
| Security ก่อน deploy | `/security-review`                |
| Review PR            | `/review`                         |

---

## 🚫 Anti-pattern (อย่าทำ)

❌ พิมพ์สั้นเกิน — Claude เดาผิด

```
"เพิ่ม brand" ← ไม่บอก field, ไม่บอก admin/public
```

❌ ไม่ระบุ scope — Claude ไปแก้ไฟล์ที่ไม่ควรแก้

```
"ปรับ category ให้ดีขึ้น" ← "ดี" คืออะไร?
```

❌ บอกหลายงานในรอบเดียว — Claude ทำผิดลำดับ

```
"สร้าง brand + แก้ category + เขียน test + deploy"
```

✅ แทน:

```
"สร้าง brand module ก่อน — รายละเอียด: <field>
ทำเสร็จแล้วบอกฉัน ค่อยไปขั้นต่อไป"
```
