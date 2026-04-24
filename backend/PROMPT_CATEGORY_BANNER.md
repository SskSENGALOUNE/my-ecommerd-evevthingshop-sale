# Prompt: Implement Category & Banner CRUD — NestJS Clean Architecture + CQRS

## Context

This is a NestJS 11 e-commerce backend using **Clean Architecture + CQRS pattern** with Prisma ORM.
All empty files have been created. You need to fill in the code for each file following the exact patterns below.

---

## Architecture Rules

- **Layer dependencies flow inward:** `presentation → application → domain ← infrastructure`
- Domain layer has ZERO framework imports (no `@nestjs/*`)
- Repository interface is defined in `domain/`, implementation in `infrastructure/prisma/repositories/`
- Use Symbol-based injection tokens (e.g., `Symbol('CATEGORY_REPOSITORY')`)
- Commands for write operations, Queries for read operations
- Controller uses `CommandBus` and `QueryBus` only — never inject repositories directly
- All responses are auto-wrapped by `BaseResponseInterceptor` into `{ success: true, data: ... }`
- Use `class-validator` for DTO validation, `@nestjs/swagger` for API docs

---

## Prisma Schema (already exists in `prisma/schema.prisma`)

### Category (already exists)

```prisma
model Category {
  id       String  @id @default(uuid()) @db.Uuid
  name     String
  slug     String  @unique
  parentId String? @map("parent_id") @db.Uuid

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
  products Product[]

  @@index([slug])
  @@index([parentId])
  @@map("categories")
}
```

### Banner (ADD this to `prisma/schema.prisma`)

```prisma
model Banner {
  id       String  @id @default(uuid()) @db.Uuid
  title    String
  imageUrl String  @map("image_url")
  linkUrl  String? @map("link_url")
  order    Int     @default(0)
  isActive Boolean @default(true) @map("is_active")

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@index([isActive])
  @@index([order])
  @@map("banners")
}
```

After adding Banner model, run:
```bash
npm run prisma:migrate
npm run prisma:generate
```

---

## Reference Pattern (follow ExTable module exactly)

### Pattern: Domain Entity (`domain/ex-module/ex-table.entity.ts`)

```typescript
export class ExTable {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly createdBy: string,
    public readonly updatedAt: Date,
    public readonly updatedBy: string,
  ) {}

  static create(
    name: string,
    createdBy: string,
  ): { name: string; createdBy: string; updatedBy: string } {
    return { name, createdBy, updatedBy: createdBy };
  }

  static reconstitute(
    id: string, name: string, createdAt: Date,
    createdBy: string, updatedAt: Date, updatedBy: string,
  ): ExTable {
    return new ExTable(id, name, createdAt, createdBy, updatedAt, updatedBy);
  }

  update(name: string, updatedBy: string): Partial<ExTable> {
    return { name, updatedBy };
  }
}
```

### Pattern: Domain Repository Interface (`domain/ex-module/ex-table.repository.ts`)

```typescript
export interface IExTableRepository {
  create(data: CreateExTableData): Promise<ExTableData>;
  findById(id: string): Promise<ExTableData | null>;
  findAll(): Promise<ExTableData[]>;
  update(id: string, data: UpdateExTableData): Promise<ExTableData>;
  delete(id: string): Promise<void>;
}

export interface CreateExTableData { name: string; createdBy: string; updatedBy: string; }
export interface UpdateExTableData { name?: string; updatedBy: string; }
export interface ExTableData { id: string; name: string; createdAt: Date; createdBy: string; updatedAt: Date; updatedBy: string; }

export const EX_TABLE_REPOSITORY = Symbol('EX_TABLE_REPOSITORY');
```

### Pattern: Command (`application/ex-module/commands/create-ex-table.command.ts`)

```typescript
export class CreateExTableCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
  ) {}
}
```

### Pattern: Command Handler (`application/ex-module/commands/create-ex-table.handler.ts`)

```typescript
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateExTableCommand } from './create-ex-table.command';
import * as exTableRepository from '../../../domain/ex-module/ex-table.repository';
import { ExTable } from '../../../domain/ex-module/ex-table.entity';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(CreateExTableCommand)
export class CreateExTableHandler implements ICommandHandler<CreateExTableCommand> {
  constructor(
    @Inject(exTableRepository.EX_TABLE_REPOSITORY)
    private readonly repository: exTableRepository.IExTableRepository,
  ) {}

  async execute(command: CreateExTableCommand): Promise<BaseCommandResult> {
    const exTable = ExTable.create(command.name, command.createdBy);
    const createdExTable = await this.repository.create({
      name: exTable.name,
      createdBy: exTable.createdBy,
      updatedBy: exTable.updatedBy,
    });
    return { id: createdExTable.id };
  }
}
```

### Pattern: Query (`application/ex-module/queries/get-all-ex-tables.query.ts`)

```typescript
export class GetAllExTablesQuery {}
```

### Pattern: Query Handler (`application/ex-module/queries/get-all-ex-tables.handler.ts`)

```typescript
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllExTablesQuery } from './get-all-ex-tables.query';
import type { IExTableRepository } from '../../../domain/ex-module/ex-table.repository';
import { EX_TABLE_REPOSITORY } from '../../../domain/ex-module/ex-table.repository';

@QueryHandler(GetAllExTablesQuery)
export class GetAllExTablesHandler implements IQueryHandler<GetAllExTablesQuery> {
  constructor(
    @Inject(EX_TABLE_REPOSITORY)
    private readonly repository: IExTableRepository,
  ) {}

  async execute(): Promise<ExTable[]> {
    return await this.repository.findAll();
  }
}
```

### Pattern: Repository Implementation (`infrastructure/prisma/repositories/ex-table.repository.impl.ts`)

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IExTableRepository, CreateExTableData, UpdateExTableData, ExTableData,
} from '../../../domain/ex-module/ex-table.repository';

@Injectable()
export class ExTableRepositoryImpl implements IExTableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateExTableData): Promise<ExTableData> {
    const result = await this.prisma.exTable.create({ data: { name: data.name, createdBy: data.createdBy, updatedBy: data.updatedBy } });
    return { id: result.id, name: result.name, createdAt: result.createdAt, createdBy: result.createdBy, updatedAt: result.updatedAt, updatedBy: result.updatedBy };
  }
  // ... findById, findAll, update, delete same pattern
}
```

### Pattern: Infrastructure Module (`infrastructure/ex-module/ex-module-infrastructure.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExTableRepositoryImpl } from '../prisma/repositories/ex-table.repository.impl';
import { EX_TABLE_REPOSITORY } from '../../domain/ex-module/ex-table.repository';

@Module({
  imports: [PrismaModule],
  providers: [{ provide: EX_TABLE_REPOSITORY, useClass: ExTableRepositoryImpl }],
  exports: [EX_TABLE_REPOSITORY],
})
export class ExModuleInfrastructureModule {}
```

### Pattern: Controller (`presentation/ex-module/ex-table.controller.ts`)

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
// ... import commands, queries, DTOs

@ApiTags('ex-tables')
@Controller('ex-tables')
export class ExTableController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateExTableDto) {
    const command = new CreateExTableCommand(dto.name, dto.createdBy);
    return await this.commandBus.execute(command);
  }
  // ... findAll, findOne, update, remove
}
```

### Pattern: Presentation Module (`presentation/ex-module/ex-table.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ExTableController } from './ex-table.controller';
import { ApplicationModule } from '../../application/application.module';
import { CreateExTableHandler, UpdateExTableHandler, DeleteExTableHandler } from '../../application/ex-module/commands';
import { GetExTableByIdHandler, GetAllExTablesHandler } from '../../application/ex-module/queries';

const CommandHandlers = [CreateExTableHandler, UpdateExTableHandler, DeleteExTableHandler];
const QueryHandlers = [GetExTableByIdHandler, GetAllExTablesHandler];

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [ExTableController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ExTableModule {}
```

### Pattern: DTO (`presentation/ex-module/dto/create-ex-table.dto.ts`)

```typescript
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExTableDto {
  @ApiProperty({ description: 'Name of the record', example: 'Example Name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
```

### Pattern: Response DTO (`presentation/ex-module/dto/ex-table-response.dto.ts`)

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class ExTableResponseDto {
  @ApiProperty({ description: 'Unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Name of the record', example: 'Example Name' })
  name: string;
  // ... other fields with @ApiProperty
}
```

### Pattern: BaseCommandResult (`application/common/base-command-result.ts`)

```typescript
export interface BaseCommandResult {
  id?: string;
  reference?: string;
}
```

### Pattern: CustomNotFoundException (`domain/exceptions/exception-custom-notfound.ts`)

```typescript
export class CustomNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomNotFoundException';
  }
}
```

---

## Module Registration Pattern

After creating all files, register them in the parent modules:

### `application/application.module.ts` — add imports:
```typescript
import { CategoryApplicationModule } from './category/category-application.module';
import { BannerApplicationModule } from './banner/banner-application.module';

@Module({
  imports: [CqrsModule, TransactionApplicationModule, AuthApplicationModule, CategoryApplicationModule, BannerApplicationModule],
  exports: [CqrsModule, TransactionApplicationModule, AuthApplicationModule, CategoryApplicationModule, BannerApplicationModule],
})
```

### `infrastructure/infrastructure.module.ts` — add imports:
```typescript
import { CategoryInfrastructureModule } from './category/category-infrastructure.module';
import { BannerInfrastructureModule } from './banner/banner-infrastructure.module';
// add to imports[] and exports[]
```

### `presentation/presentation.module.ts` — add imports:
```typescript
import { CategoryModule } from './category/category.module';
import { BannerModule } from './banner/banner.module';
// add to imports[]
```

---

## Files to Fill In

### Category Module (8 files)

| # | File Path | What to Implement |
|---|-----------|-------------------|
| 1 | `src/domain/category/category.entity.ts` | Entity with `create()`, `reconstitute()`, `update()`. Fields: `id, name, slug, parentId, createdAt, updatedAt, deletedAt`. `create()` should auto-generate `slug` from `name` (lowercase, replace spaces with dashes). |
| 2 | `src/domain/category/category.repository.ts` | Interface `ICategoryRepository` with: `create`, `findBySlug`, `findAll` (return tree structure with children), `findById`, `update`, `softDelete`. Include data interfaces. Token: `CATEGORY_REPOSITORY` |
| 3 | `src/application/category/commands/create-category.command.ts` | Command with: `name`, `parentId?` |
| 4 | `src/application/category/commands/create-category.handler.ts` | Use entity `create()`, call repo. Check slug uniqueness — if duplicate, throw error. Return `BaseCommandResult` |
| 5 | `src/application/category/commands/update-category.command.ts` | Command with: `id`, `name?`, `parentId?` |
| 6 | `src/application/category/commands/update-category.handler.ts` | Find by id (throw `CustomNotFoundException` if not found), update, re-generate slug if name changed |
| 7 | `src/application/category/commands/delete-category.command.ts` | Command with: `id` |
| 8 | `src/application/category/commands/delete-category.handler.ts` | Soft delete (set `deletedAt`). Throw `CustomNotFoundException` if not found |
| 9 | `src/application/category/commands/index.ts` | Re-export all commands + handlers |
| 10 | `src/application/category/queries/get-all-categories.query.ts` | Empty query class |
| 11 | `src/application/category/queries/get-all-categories.handler.ts` | Return tree structure (parents with nested children). Filter out soft-deleted |
| 12 | `src/application/category/queries/get-category-by-slug.query.ts` | Query with: `slug` |
| 13 | `src/application/category/queries/get-category-by-slug.handler.ts` | Find by slug with children. Throw `CustomNotFoundException` if not found |
| 14 | `src/application/category/queries/index.ts` | Re-export all queries + handlers |
| 15 | `src/application/category/category-application.module.ts` | Module importing `CqrsModule`, exporting nothing (handlers are providers) |
| 16 | `src/infrastructure/prisma/repositories/category.repository.impl.ts` | Prisma implementation. `findAll` should use `where: { deletedAt: null, parentId: null }` with `include: { children: true }` for tree. `softDelete` sets `deletedAt: new Date()` |
| 17 | `src/infrastructure/category/category-infrastructure.module.ts` | Module pattern — provide `CATEGORY_REPOSITORY` with `CategoryRepositoryImpl` |
| 18 | `src/presentation/category/dto/create-category.dto.ts` | DTO: `name` (required), `parentId?` (optional, IsUUID) |
| 19 | `src/presentation/category/dto/update-category.dto.ts` | DTO: `name?`, `parentId?` (all optional) |
| 20 | `src/presentation/category/dto/category-response.dto.ts` | Response DTO with all fields + `children?: CategoryResponseDto[]` |
| 21 | `src/presentation/category/category.controller.ts` | Routes: `GET /categories` (Public), `GET /categories/:slug` (Public), `POST /admin/categories` (Admin guard), `PUT /admin/categories/:id` (Admin guard), `DELETE /admin/categories/:id` (Admin guard) |
| 22 | `src/presentation/category/category.module.ts` | Module pattern — register controller + all handlers |

### Banner Module (8 files)

| # | File Path | What to Implement |
|---|-----------|-------------------|
| 1 | `src/domain/banner/banner.entity.ts` | Entity with `create()`, `reconstitute()`, `update()`. Fields: `id, title, imageUrl, linkUrl, order, isActive, createdAt, updatedAt, deletedAt` |
| 2 | `src/domain/banner/banner.repository.ts` | Interface `IBannerRepository` with: `create`, `findAll`, `findActive` (isActive=true, order by `order` ASC), `findById`, `update`, `softDelete`. Token: `BANNER_REPOSITORY` |
| 3 | `src/application/banner/commands/create-banner.command.ts` | Command with: `title`, `imageUrl`, `linkUrl?`, `order?` |
| 4 | `src/application/banner/commands/create-banner.handler.ts` | Use entity `create()`, call repo. Return `BaseCommandResult` |
| 5 | `src/application/banner/commands/update-banner.command.ts` | Command with: `id`, `title?`, `imageUrl?`, `linkUrl?`, `order?`, `isActive?` |
| 6 | `src/application/banner/commands/update-banner.handler.ts` | Find by id (throw if not found), update |
| 7 | `src/application/banner/commands/delete-banner.command.ts` | Command with: `id` |
| 8 | `src/application/banner/commands/delete-banner.handler.ts` | Soft delete. Throw `CustomNotFoundException` if not found |
| 9 | `src/application/banner/commands/index.ts` | Re-export all |
| 10 | `src/application/banner/queries/get-active-banners.query.ts` | Empty query class (for public storefront) |
| 11 | `src/application/banner/queries/get-active-banners.handler.ts` | Return active banners ordered by `order` ASC |
| 12 | `src/application/banner/queries/get-all-banners.query.ts` | Empty query class (for admin — include inactive) |
| 13 | `src/application/banner/queries/get-all-banners.handler.ts` | Return all banners (admin sees everything) |
| 14 | `src/application/banner/queries/index.ts` | Re-export all |
| 15 | `src/application/banner/banner-application.module.ts` | Module |
| 16 | `src/infrastructure/prisma/repositories/banner.repository.impl.ts` | Prisma implementation |
| 17 | `src/infrastructure/banner/banner-infrastructure.module.ts` | Module pattern |
| 18 | `src/presentation/banner/dto/create-banner.dto.ts` | DTO: `title` (required), `imageUrl` (required), `linkUrl?`, `order?` (IsInt) |
| 19 | `src/presentation/banner/dto/update-banner.dto.ts` | DTO: all optional |
| 20 | `src/presentation/banner/dto/banner-response.dto.ts` | Response DTO |
| 21 | `src/presentation/banner/banner.controller.ts` | Routes: `GET /banners` (Public — active only), `GET /admin/banners` (Admin — all), `POST /admin/banners` (Admin), `PUT /admin/banners/:id` (Admin), `DELETE /admin/banners/:id` (Admin) |
| 22 | `src/presentation/banner/banner.module.ts` | Module pattern |

---

## Auth Guards to Use

```typescript
// For admin-only routes:
import { JwtAdminGuard } from '../auth/guards/jwt-admin.guard';
@UseGuards(JwtAdminGuard)

// For public routes (no guard needed, but add decorator for clarity):
import { Public } from '../auth/decorators/public.decorator';
@Public()
```

---

## API Endpoints Summary

### Category
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/categories` | Public | ดูหมวดหมู่ทั้งหมด (tree structure) |
| `GET` | `/categories/:slug` | Public | ดูหมวดหมู่ตาม slug |
| `POST` | `/admin/categories` | Admin | สร้างหมวดหมู่ |
| `PUT` | `/admin/categories/:id` | Admin | แก้ไขหมวดหมู่ |
| `DELETE` | `/admin/categories/:id` | Admin | ลบหมวดหมู่ (soft delete) |

### Banner
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/banners` | Public | ดู banner ที่ active (storefront) |
| `GET` | `/admin/banners` | Admin | ดู banner ทั้งหมด |
| `POST` | `/admin/banners` | Admin | สร้าง banner |
| `PUT` | `/admin/banners/:id` | Admin | แก้ไข banner |
| `DELETE` | `/admin/banners/:id` | Admin | ลบ banner (soft delete) |

---

## Checklist Before Done

- [ ] Add `Banner` model to `prisma/schema.prisma`
- [ ] Run `npm run prisma:migrate` and `npm run prisma:generate`
- [ ] Fill all empty files following the patterns above
- [ ] Register `CategoryApplicationModule` and `BannerApplicationModule` in `application/application.module.ts`
- [ ] Register `CategoryInfrastructureModule` and `BannerInfrastructureModule` in `infrastructure/infrastructure.module.ts`
- [ ] Register `CategoryModule` and `BannerModule` in `presentation/presentation.module.ts`
- [ ] Run `npm run start:dev` and verify no errors
- [ ] Test via Swagger at `http://localhost:3009/api`
