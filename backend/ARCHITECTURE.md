# ARCHITECTURE.md — Backend (NestJS Clean Architecture + CQRS)

## 🎯 Goal

แยก **business rules** ออกจาก **framework** และ **DB** เพื่อ:
- ทดสอบได้โดยไม่ต้อง boot Nest หรือ Postgres
- เปลี่ยน DB / framework ได้โดยไม่กระทบ business
- ทีมใหม่อ่าน code แล้วรู้ว่าไฟล์ไหนทำอะไร

---

## 📁 Layer Structure

```
src/
├── presentation/     # HTTP — Controllers, DTOs, Guards, Interceptors
├── application/      # Use cases — Commands, Queries, Handlers
├── domain/           # Business core — Entities, Repository INTERFACES, Domain exceptions
├── infrastructure/   # External — Prisma repos, JWT, Kafka, file upload, HTTP clients
├── shared/           # Cross-cutting providers (config, logger token)
└── utilities/        # Health check, logger interceptor
```

---

## 🔁 Dependency Rule (สำคัญที่สุด!)

```
presentation ─→ application ─→ domain ←─ infrastructure
```

**กฎเหล็ก:**
- ✅ `presentation` import จาก `application` + `domain`
- ✅ `application` import จาก `domain` เท่านั้น
- ✅ `infrastructure` implement interface จาก `domain`
- ❌ `domain` **ห้าม** import อะไรจาก layer อื่นเด็ดขาด (รวมถึง `@nestjs/*`, `prisma`, `bcrypt`)
- ❌ `application` **ห้าม** import จาก `infrastructure` หรือ `presentation`

> ถ้าต้องเรียก external service ใน application layer → กำหนด **port (interface) ใน domain** แล้วให้ infrastructure implement

---

## 🧱 What Goes Where (ใช้ `category` module เป็นตัวอย่าง)

### `domain/category/`
- **`category.entity.ts`** — class กับ business rules บริสุทธิ์
  ```ts
  export class Category {
    private constructor(public readonly id, ...) {}
    static create(name: string) { return { name }; }       // สร้างใหม่
    static reconstitute(id, name, ...) { return new Category(...); }  // จาก DB
  }
  ```
- **`category.repository.ts`** — `interface ICategoryRepository` + `Symbol` token
  ```ts
  export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');
  ```

### `application/category/`
- **`commands/<verb>-<noun>.command.ts`** — DTO ล้วน (no logic)
- **`commands/<verb>-<noun>.handler.ts`** — `@CommandHandler` orchestrate domain + repo
- **`queries/<verb>-<noun>.query.ts`** + `.handler.ts` — read operations
- **`commands/index.ts`** + **`queries/index.ts`** — barrel export array สำหรับ register

### `infrastructure/prisma/repositories/category.repository.impl.ts`
- `@Injectable()` class implements `ICategoryRepository`
- Inject `PrismaService` — แปลง Prisma model ↔ domain `CategoryData`
- จัดการ **soft delete** (`deletedAt: null` ใน where) ที่นี่

### `presentation/category/`
- **`category.controller.ts`** — admin endpoints, ป้องกันด้วย `JwtAdminGuard`
- **`public-category.controller.ts`** — public endpoints (ไม่มี guard)
- **`dto/`** — `CreateXxxDto`, `UpdateXxxDto`, `XxxResponseDto` ใช้ `class-validator` + `@ApiProperty`
- **`category.module.ts`** — declare controller + handlers + bind `CATEGORY_REPOSITORY` → impl

---

## 🔄 Request Flow (1 round-trip)

```
HTTP POST /admin/categories
  │
  ▼ Controller (presentation)
    ├─ JwtAdminGuard verify JWT
    ├─ ValidationPipe + DTO
    └─ commandBus.execute(new CreateCategoryCommand(dto.name))
  │
  ▼ Handler (application)
    ├─ repository.findByName(name) → check duplicate
    ├─ Category.create(name) → domain rule
    └─ repository.create(...) → BaseCommandResult
  │
  ▼ Repository Impl (infrastructure)
    └─ prisma.category.create({ data })
  │
  ▼ Interceptors (presentation)
    ├─ BaseResponseInterceptor → wrap { success, data, ... }
    ├─ BaseErrorInterceptor → wrap error เป็น BaseResponse.error
    └─ TimeoutInterceptor → 30s default
  │
  ▼ HTTP 201 { success: true, data: {...} }
```

---

## 📐 Patterns ที่ใช้ในโปรเจกต์นี้

| Pattern | ที่ใช้ | ทำไม |
|---|---|---|
| **Repository via Symbol token** | `@Inject(CATEGORY_REPOSITORY)` | DI swap impl ได้, mock ใน test ง่าย |
| **Domain Data Interface** | `CategoryData`, `CreateCategoryData` | กัน Prisma type leak ไป application |
| **Soft Delete** | `deletedAt: Date \| null` ใน schema | กู้คืนได้, audit trail |
| **Snapshot Pattern** | `OrderItem.productName/Image/Price` | ราคา/ชื่อตอนซื้อไม่เปลี่ยนแม้ admin แก้สินค้า |
| **BaseResponse wrapper** | ทุก response ห่อด้วย `{ success, data }` | Frontend คาดเดา shape ได้ |
| **Global ValidationPipe** | `whitelist + forbidNonWhitelisted` | ตัด field แปลก, ป้องกัน mass assignment |
| **CQRS Bus** | `commandBus` / `queryBus` | แยก write/read, อนาคตขยายเป็น event sourcing ได้ |

---

## 🚫 Anti-Patterns ที่ต้องหลีกเลี่ยง

- ❌ Import `PrismaClient` ใน `application/` หรือ `domain/`
- ❌ ทำ `new SomeRepositoryImpl()` ใน handler (ใช้ DI เท่านั้น)
- ❌ Return `Prisma.Category` ตรง ๆ จาก repo (ต้องแปลงเป็น `CategoryData`)
- ❌ Business logic ใน controller (controller รับ DTO → ส่งเข้า bus เท่านั้น)
- ❌ Hard delete สิ่งที่ user มองเห็น (ใช้ soft delete ผ่าน `deletedAt`)
- ❌ throw `new Error()` ใน handler (ใช้ `NotFoundException`, `ConflictException` ฯลฯ ของ Nest หรือ domain exception)

---

## 📚 อ่านต่อ

- `MODULE_GUIDE.md` — สร้าง module ใหม่แบบ step-by-step
- `CONVENTIONS.md` — Naming, DTO, response/error shape, transactions
- `CQRS_GUIDE.md` — CQRS pattern + advanced (event sourcing, transactions)
- `TESTING.md` — Test strategy
- `SECURITY.md` — Auth, validation, file upload
