# CONVENTIONS.md — Code Conventions

> ทุกอย่างใน doc นี้บังคับใช้ — ถ้าเจอไฟล์ที่ไม่ตามนี้ ให้ refactor ให้ตรงเมื่อแตะ

---

## 📂 File Naming

| ประเภท | รูปแบบ | ตัวอย่าง |
|---|---|---|
| Entity | `<noun>.entity.ts` | `category.entity.ts` |
| Repository interface | `<noun>.repository.ts` | `category.repository.ts` |
| Repository impl | `<noun>.repository.impl.ts` | `category.repository.impl.ts` |
| Command | `<verb>-<noun>.command.ts` | `create-category.command.ts` |
| Command handler | `<verb>-<noun>.handler.ts` | `create-category.handler.ts` |
| Query | `<verb>-<noun>.query.ts` | `get-all-categories.query.ts` |
| DTO (input) | `<verb>-<noun>.dto.ts` | `create-category.dto.ts` |
| DTO (response) | `<noun>-response.dto.ts` | `category-response.dto.ts` |
| Controller | `<noun>.controller.ts` | `category.controller.ts` |
| Public controller | `public-<noun>.controller.ts` | `public-category.controller.ts` |
| Module (presentation) | `<noun>.module.ts` | `category.module.ts` |
| Module (app/infra) | `<noun>-<layer>.module.ts` | `category-infrastructure.module.ts` |

**Rule:** kebab-case สำหรับชื่อไฟล์, PascalCase สำหรับ class, camelCase สำหรับ property

---

## 🏷️ Class & Symbol Naming

```ts
// Repository token — UPPER_SNAKE_CASE + Symbol
export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

// Interface — I prefix
export interface ICategoryRepository {}

// Impl — Impl suffix
export class CategoryRepositoryImpl implements ICategoryRepository {}

// Command/Query — VerbNoun + suffix
export class CreateCategoryCommand {}
export class GetAllCategoriesQuery {}

// Handler — same name + Handler suffix
@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler {}
```

---

## 📦 DTO Pattern

**Input DTO:**
```ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'ຊື່ໝວດ', example: 'ເສື້ອຜ້າ' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
```

**Rule:**
- ทุก field ต้องมี `@ApiProperty` หรือ `@ApiPropertyOptional`
- ทุก field ต้องมี validation decorator
- Custom message ใช้ภาษาอังกฤษ (frontend แปล)
- Optional → ใช้ `?:` + `@IsOptional()` + `@ApiPropertyOptional`

**Response DTO:**
- ทุก field ใช้ `@ApiProperty` (สำหรับ Swagger)
- อย่าใส่ field sensitive (password, internal flag)

---

## 🗄️ Prisma Schema Conventions

```prisma
model Category {
  id   String @id @default(uuid()) @db.Uuid          // ← UUID เสมอ
  name String

  // Audit fields — มีทุก table
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")             // ← soft delete

  @@map("categories")                                 // ← snake_case plural
}
```

| สิ่ง | กฎ |
|---|---|
| Primary key | `String @id @default(uuid()) @db.Uuid` |
| Field name | camelCase ใน Prisma, snake_case ใน DB ผ่าน `@map` |
| Table name | snake_case + plural ผ่าน `@@map` |
| Audit | ทุก table มี `createdAt`, `updatedAt`; soft-delete ที่ user-facing มี `deletedAt` |
| Relation | onDelete: Cascade เฉพาะ child ที่ "ของลูกค้าจริง ๆ" (cart items, addresses) |
| Index | ใส่ `@@index` สำหรับ field ที่ใช้ filter/sort บ่อย |
| Money | `Decimal @db.Decimal(10, 2)` — **ห้าม** Float |

---

## 🌊 Soft Delete

ทำใน **Repository Impl** — ไม่ใช่ middleware

```ts
// Read — ต้องกรอง deletedAt: null เสมอ
async findById(id: string) {
  return this.prisma.category.findFirst({ where: { id, deletedAt: null } });
}

// Delete — update timestamp
async delete(id: string) {
  await this.prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
```

> **Hard delete** ใช้กับ data ที่ user ไม่เห็น (cart item ตอน checkout, log) เท่านั้น

---

## 📡 Response Shape

ทุก response ห่อด้วย `BaseResponseInterceptor` อัตโนมัติ:

**Success:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "..." },
  "timestamp": "2026-05-06T10:00:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ConflictException",
    "message": "Category name already exists"
  },
  "timestamp": "2026-05-06T10:00:00.000Z"
}
```

> ใน handler/controller **return data ดิบ** — interceptor จะ wrap ให้

---

## 🚨 Exception Handling

**ใน application/handler — ใช้ Nest built-in exceptions:**
```ts
import { NotFoundException, ConflictException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';

if (!entity) throw new NotFoundException('Category not found');
if (existing) throw new ConflictException('Name already exists');
```

**ห้าม:**
- `throw new Error('...')` — interceptor จะมองเป็น 500
- `return null` แทน throw — handler ต้อง throw เมื่อ business rule ละเมิด

**Domain exception** (เมื่อ business rule ซับซ้อน):
```ts
// src/domain/exceptions/insufficient-stock.exception.ts
export class InsufficientStockException extends Error {
  constructor(public readonly variantId: string, public readonly requested: number, public readonly available: number) {
    super(`Insufficient stock for ${variantId}: ${requested} requested, ${available} available`);
    this.name = 'InsufficientStockException';
  }
}

// แล้ว map เป็น HTTP exception ใน handler
catch (err) {
  if (err instanceof InsufficientStockException) {
    throw new ConflictException(err.message);
  }
  throw err;
}
```

---

## 🔄 Transaction Pattern

ใน **command handler** ที่แตะหลาย repo:

```ts
async execute(cmd: CreateOrderCommand) {
  return this.prisma.$transaction(async (tx) => {
    const order = await tx.order.create({ data: orderData });
    await tx.orderItem.createMany({ data: items });
    await tx.inventory.update({
      where: { variantId },
      data: { reservedQty: { increment: qty } },
    });
    return order;
  });
}
```

> ตอนนี้ inject `PrismaService` ใน handler ได้ตรง — แต่ถ้าต้องการ pure architecture: เพิ่ม `IUnitOfWork` interface ใน domain แล้ว implement ใน infra

---

## 🔢 Naming ของ Endpoint

| Pattern | URL |
|---|---|
| Admin CRUD | `/admin/<resource-plural>` |
| Public read | `/<resource-plural>` |
| Action บน resource | `/admin/<resource>/:id/<action>` (เช่น `/admin/orders/:id/approve`) |
| Customer self | `/me/<resource>` (เช่น `/me/orders`) |

ใช้ kebab-case สำหรับ multi-word: `/admin/product-variants` — ไม่ใช่ `/admin/productVariants`

---

## 📝 Logging

```ts
import { Logger } from '@nestjs/common';

@Injectable()
export class SomeHandler {
  private readonly logger = new Logger(SomeHandler.name);

  async execute(cmd) {
    this.logger.log(`Creating: ${cmd.name}`);
    try {
      // ...
    } catch (err) {
      this.logger.error(`Failed: ${err.message}`, err.stack);
      throw err;
    }
  }
}
```

**ห้าม log:** password, JWT token, payment slip raw URL (log แค่ ID)

---

## 🌐 i18n & Locale

- โปรเจกต์เป็นภาษาลาว — **store text ใน DB เป็น UTF-8** (default)
- API error message → อังกฤษ (frontend แปล)
- API field description (`@ApiProperty`) → ลาว/อังกฤษได้ตามสะดวก
- Money → store เป็น `Decimal`, format ฝั่ง frontend ตาม `Intl.NumberFormat('lo-LA')`
