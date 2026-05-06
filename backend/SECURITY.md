# SECURITY.md — Production Security Checklist

> ห้ามขึ้น production ก่อนเช็ครายการนี้ครบ

---

## 🔐 1. Authentication

### JWT แยก Customer / Admin

**Token แยก secret:**
```env
JWT_SECRET=<customer-secret>
JWT_ADMIN_SECRET=<admin-secret>   # ต่างจาก customer!
```

**Strategy แยก 2 ตัว** ใน `src/infrastructure/auth/strategies/`:
- `jwt-customer.strategy.ts` — verify ด้วย `JWT_SECRET`
- `jwt-admin.strategy.ts` — verify ด้วย `JWT_ADMIN_SECRET`

**Guard แยก:**
- `JwtCustomerGuard` → ใช้กับ `/me/*`, `/cart`, `/orders`
- `JwtAdminGuard` → ใช้กับ `/admin/*`

**Token expiry:**
| Type | Access | Refresh |
|---|---|---|
| Customer | 15m | 30d |
| Admin | 15m | 7d |

> Refresh token เก็บใน DB + revocable

---

## 🛡️ 2. Authorization (RBAC)

```ts
@UseGuards(JwtAdminGuard, RolesGuard)
@Roles(AdminRole.SUPER_ADMIN)
@Delete(':id')
async deleteAdmin() {}
```

**Rule:**
- `SUPER_ADMIN` — จัดการ admin คนอื่น + ทุก feature
- `ADMIN` — จัดการสินค้า/order/payment, **ห้าม** จัดการ admin

**ห้าม** trust `role` จาก client — verify จาก JWT payload เท่านั้น

---

## 🔒 3. Password Hashing

```ts
import * as bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);   // cost 12 ขั้นต่ำ
```

- Cost ≥ 12 (production)
- ห้าม log password (raw or hash)
- ห้าม return password field จาก repository

---

## 🧹 4. Input Validation

**Global pipe** เปิดอยู่แล้วใน `main.ts`:
```ts
new ValidationPipe({
  whitelist: true,              // ตัด field ที่ไม่ได้ใน DTO
  forbidNonWhitelisted: true,   // field แปลก = 400
  transform: true,
})
```

**ทุก DTO ต้องมี validator:**
| Field | Decorator |
|---|---|
| Email | `@IsEmail()` |
| UUID | `@IsUUID('4')` |
| URL | `@IsUrl()` |
| Money | `@IsNumber() @Min(0)` |
| String length | `@MinLength(n) @MaxLength(n)` |
| Phone | `@Matches(/^[0-9+\-\s]+$/)` |

---

## 🌐 5. CORS

```ts
app.enableCors({
  origin: process.env.CORS_ORIGINS.split(','),  // ห้าม "*" ใน prod
  credentials: true,
});
```

`.env.production`:
```env
CORS_ORIGINS=https://shop.example.com,https://admin.example.com
```

---

## 🪖 6. HTTP Security Headers (Helmet)

ติดตั้ง + เปิด:
```bash
npm i helmet
```

`main.ts`:
```ts
import helmet from 'helmet';
app.use(helmet());
```

---

## ⏱️ 7. Rate Limiting

ใช้ `@nestjs/throttler`:

```ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),  // 60 req/min default
  ],
})
```

**Endpoint sensitive ต้อง strict กว่า:**
```ts
@Throttle({ default: { ttl: 60000, limit: 5 } })  // 5/min
@Post('login')
async login() {}
```

| Endpoint | Limit |
|---|---|
| `POST /auth/*/login` | 5/min/IP |
| `POST /auth/*/register` | 3/min/IP |
| `POST /payments/qr/:orderId` | 10/min/customer |
| Default | 60/min |

---

## 📤 8. File Upload (QR Slip)

`src/infrastructure/file-upload/` — **ห้าม trust client:**

| เช็ค | กฎ |
|---|---|
| Size | ≤ 5MB |
| MIME | whitelist: `image/jpeg`, `image/png`, `image/webp` เท่านั้น |
| Magic bytes | verify จริง (อย่า trust แค่ extension) |
| Filename | rename เป็น UUID เสมอ — ห้ามใช้ original |
| Storage | นอก `public/` (private bucket) — serve ผ่าน signed URL |
| Path traversal | reject ถ้ามี `..` หรือ `/` ใน filename |

```ts
@Post(':orderId/slip')
@UseInterceptors(FileInterceptor('file', {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
}))
```

---

## 🔑 9. Secrets Management

**ห้าม:**
- ❌ Commit `.env` (มีใน `.gitignore` แล้ว)
- ❌ Hardcode secret ใน source code
- ❌ Log secret หรือ JWT token

**ใช้:**
- ✅ `.env` ใน dev
- ✅ Secret manager ใน prod (AWS Secrets Manager / Doppler / Infisical)
- ✅ `.env.example` commit ได้ (ค่า placeholder)

**Required env vars:**
```env
DATABASE_URL=
JWT_SECRET=                  # ≥ 32 chars random
JWT_ADMIN_SECRET=            # ≥ 32 chars random, ต่างจาก JWT_SECRET
CORS_ORIGINS=
NODE_ENV=production
PORT=3009
```

> Generate secret: `openssl rand -base64 48`

---

## 💉 10. SQL Injection / NoSQL Injection

- ✅ Prisma parameterize อัตโนมัติ — ปลอดภัยถ้าใช้ `prisma.x.findMany({ where })` ปกติ
- ❌ **อย่าใช้** `$queryRawUnsafe`, `$executeRawUnsafe` กับ user input
- ✅ ถ้าต้อง raw query ใช้ `Prisma.sql\`...\`` template tag

```ts
// ✅ ปลอดภัย
prisma.$queryRaw`SELECT * FROM products WHERE id = ${id}`;

// ❌ อันตราย
prisma.$queryRawUnsafe(`SELECT * FROM products WHERE id = '${id}'`);
```

---

## 📋 11. Audit Logging

**ต้อง log:**
- Admin login (success/fail)
- Payment approval/rejection (`verifiedBy`, `verifiedAt`)
- Order status change
- Admin role change

**ไฟล์ format:**
```json
{ "ts": "...", "actor": "admin-uuid", "action": "PAYMENT_APPROVED", "target": "order-uuid", "ip": "..." }
```

---

## 🧨 12. Error Disclosure

**Production:**
- ❌ ห้ามส่ง stack trace ไป client
- ❌ ห้ามเปิดเผย DB schema ใน error message
- ✅ Log full error server-side, ส่ง generic message ไป client

`BaseErrorInterceptor` ทำให้แล้ว — แต่เช็คว่า `NODE_ENV=production` เพื่อ:
```ts
const message = process.env.NODE_ENV === 'production'
  ? 'Internal server error'
  : err.message;
```

---

## 🚦 13. Health Check & Readiness

```
GET /health         → liveness (Nest is up)
GET /health/ready   → readiness (DB connected)
```

`/health/ready` ต้อง:
- Ping DB (`SELECT 1`)
- Return 503 ถ้า DB down → load balancer หยุดส่ง traffic

---

## ✅ Pre-Production Checklist

- [ ] `JWT_SECRET` และ `JWT_ADMIN_SECRET` ต่างกัน, ≥ 32 chars
- [ ] `CORS_ORIGINS` ไม่มี `*`
- [ ] Helmet เปิด
- [ ] Throttler เปิดและ strict สำหรับ login/register
- [ ] File upload validate size + MIME + magic bytes
- [ ] `NODE_ENV=production`
- [ ] Default admin password (`Admin@1234`) **เปลี่ยนแล้ว**
- [ ] DB user ของ app ไม่มีสิทธิ์ DROP/CREATE (ใช้ migration user แยก)
- [ ] Backup DB อัตโนมัติเปิด
- [ ] Monitoring/alerting ตั้งแล้ว (Sentry, Grafana)
- [ ] HTTPS เท่านั้น (TLS terminator ที่ load balancer)
- [ ] `npm audit` no high/critical
- [ ] Secrets ไม่ commit (run `gitleaks` ก่อน push)
