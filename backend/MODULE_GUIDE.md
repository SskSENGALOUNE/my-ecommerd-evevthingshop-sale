# MODULE_GUIDE.md — สร้าง Feature Module ใหม่

> Reference: copy pattern จาก `category` module (สมบูรณ์ที่สุด)

---

## ⚡ Quick Recipe

สมมติเพิ่ม module **`brand`** (CRUD ง่าย ๆ)

```
1. prisma/schema.prisma     → เพิ่ม model Brand
2. domain/brand/            → entity + repository interface
3. infrastructure/prisma/repositories/  → impl
4. infrastructure/brand/    → infra module (optional)
5. application/brand/       → commands + queries + handlers + module
6. presentation/brand/      → controller + DTO + module
7. app.module.ts            → import BrandModule
8. npm run prisma:migrate   → migrate DB
```

---

## 📝 Step-by-Step (ตัวอย่าง: `brand`)

### 1️⃣ Prisma Schema

`prisma/schema.prisma`:

```prisma
model Brand {
  id   String @id @default(uuid()) @db.Uuid
  name String @unique
  logoUrl String? @map("logo_url")
  isActive Boolean @default(true) @map("is_active")

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@index([name])
  @@map("brands")
}
```

```bash
npm run prisma:migrate -- --name add-brand
npm run prisma:generate
```

---

### 2️⃣ Domain Layer

`src/domain/brand/brand.entity.ts`:

```ts
export class Brand {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly logoUrl: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  static create(name: string, logoUrl?: string) {
    return { name, logoUrl: logoUrl ?? null, isActive: true };
  }

  static reconstitute(
    id: string, name: string, logoUrl: string | null, isActive: boolean,
    createdAt: Date, updatedAt: Date, deletedAt: Date | null,
  ): Brand {
    return new Brand(id, name, logoUrl, isActive, createdAt, updatedAt, deletedAt);
  }
}
```

`src/domain/brand/brand.repository.ts`:

```ts
export const BRAND_REPOSITORY = Symbol('BRAND_REPOSITORY');

export interface IBrandRepository {
  create(data: CreateBrandData): Promise<BrandData>;
  findById(id: string): Promise<BrandData | null>;
  findByName(name: string): Promise<BrandData | null>;
  findAll(): Promise<BrandData[]>;
  update(id: string, data: UpdateBrandData): Promise<BrandData>;
  delete(id: string): Promise<void>;
}

export interface CreateBrandData {
  name: string;
  logoUrl: string | null;
  isActive: boolean;
}

export interface UpdateBrandData {
  name?: string;
  logoUrl?: string | null;
  isActive?: boolean;
}

export interface BrandData {
  id: string;
  name: string;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```

---

### 3️⃣ Infrastructure (Prisma Impl)

`src/infrastructure/prisma/repositories/brand.repository.impl.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IBrandRepository, CreateBrandData, UpdateBrandData, BrandData,
} from '../../../domain/brand/brand.repository';

@Injectable()
export class BrandRepositoryImpl implements IBrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBrandData): Promise<BrandData> {
    const r = await this.prisma.brand.create({ data });
    return this.toDomain(r);
  }

  async findById(id: string): Promise<BrandData | null> {
    const r = await this.prisma.brand.findFirst({ where: { id, deletedAt: null } });
    return r ? this.toDomain(r) : null;
  }

  async findByName(name: string): Promise<BrandData | null> {
    const r = await this.prisma.brand.findFirst({ where: { name, deletedAt: null } });
    return r ? this.toDomain(r) : null;
  }

  async findAll(): Promise<BrandData[]> {
    const rows = await this.prisma.brand.findMany({ where: { deletedAt: null } });
    return rows.map(r => this.toDomain(r));
  }

  async update(id: string, data: UpdateBrandData): Promise<BrandData> {
    const r = await this.prisma.brand.update({ where: { id }, data });
    return this.toDomain(r);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.brand.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private toDomain(r: any): BrandData {
    return {
      id: r.id, name: r.name, logoUrl: r.logoUrl, isActive: r.isActive,
      createdAt: r.createdAt, updatedAt: r.updatedAt, deletedAt: r.deletedAt,
    };
  }
}
```

---

### 4️⃣ Application Layer

#### Commands

`src/application/brand/commands/create-brand.command.ts`:
```ts
export class CreateBrandCommand {
  constructor(
    public readonly name: string,
    public readonly logoUrl?: string,
  ) {}
}
```

`src/application/brand/commands/create-brand.handler.ts`:
```ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateBrandCommand } from './create-brand.command';
import * as brandRepository from '../../../domain/brand/brand.repository';
import { Brand } from '../../../domain/brand/brand.entity';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(CreateBrandCommand)
export class CreateBrandHandler implements ICommandHandler<CreateBrandCommand> {
  constructor(
    @Inject(brandRepository.BRAND_REPOSITORY)
    private readonly repository: brandRepository.IBrandRepository,
  ) {}

  async execute(cmd: CreateBrandCommand): Promise<BaseCommandResult> {
    const existing = await this.repository.findByName(cmd.name);
    if (existing) throw new ConflictException('Brand name already exists');

    const data = Brand.create(cmd.name, cmd.logoUrl);
    const created = await this.repository.create(data);
    return { id: created.id, ...created };
  }
}
```

> ทำซ้ำสำหรับ `update-brand`, `delete-brand` (soft delete), `get-all-brands`, `get-brand-by-id`

#### Barrel exports

`src/application/brand/commands/index.ts`:
```ts
import { CreateBrandHandler } from './create-brand.handler';
import { UpdateBrandHandler } from './update-brand.handler';
import { DeleteBrandHandler } from './delete-brand.handler';

export const BrandCommandHandlers = [
  CreateBrandHandler, UpdateBrandHandler, DeleteBrandHandler,
];
```

`src/application/brand/queries/index.ts` — เหมือนกัน

---

### 5️⃣ Presentation Layer

`src/presentation/brand/dto/create-brand.dto.ts`:
```ts
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ example: 'Nike' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/nike.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
```

`src/presentation/brand/brand.controller.ts`:
```ts
import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAdminGuard } from '../auth/guards/jwt-admin.guard';
import { CreateBrandCommand } from '../../application/brand/commands/create-brand.command';
import { CreateBrandDto } from './dto/create-brand.dto';

@ApiTags('admin/brands')
@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@Controller('admin/brands')
export class BrandController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Brand' })
  async create(@Body() dto: CreateBrandDto) {
    return this.commandBus.execute(new CreateBrandCommand(dto.name, dto.logoUrl));
  }
  // ... GET / PUT / DELETE
}
```

`src/presentation/brand/brand.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BrandController } from './brand.controller';
import { ApplicationModule } from '../../application/application.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { BRAND_REPOSITORY } from '../../domain/brand/brand.repository';
import { BrandRepositoryImpl } from '../../infrastructure/prisma/repositories/brand.repository.impl';
import { BrandCommandHandlers } from '../../application/brand/commands';
import { BrandQueryHandlers } from '../../application/brand/queries';

@Module({
  imports: [CqrsModule, ApplicationModule, PrismaModule],
  controllers: [BrandController],
  providers: [
    ...BrandCommandHandlers,
    ...BrandQueryHandlers,
    { provide: BRAND_REPOSITORY, useClass: BrandRepositoryImpl },
  ],
})
export class BrandModule {}
```

---

### 6️⃣ Register Module

`src/app.module.ts`:
```ts
@Module({
  imports: [
    SharedModule,
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
    BrandModule,   // ← เพิ่มตรงนี้
  ],
})
export class AppModule {}
```

---

## ✅ Checklist ก่อน commit

- [ ] Prisma migrate สำเร็จ + commit migration file
- [ ] `npm run prisma:generate` รัน
- [ ] Domain ไม่ import `@nestjs/*`, `@prisma/*`, infrastructure
- [ ] Repository ทุกตัวกรอง `deletedAt: null` (ถ้ามี soft delete)
- [ ] DTO มี `@ApiProperty` + `class-validator`
- [ ] Controller ใช้ `@UseGuards(JwtAdminGuard)` ถ้าเป็น admin endpoint
- [ ] Public endpoint แยกไฟล์ controller (เช่น `public-brand.controller.ts`)
- [ ] `npm run lint` ผ่าน
- [ ] `npm run test` (อย่างน้อย handler unit test)
- [ ] อัปเดต `apiSpace.md` ด้วย endpoint ใหม่

---

## 🪄 Tips

- ถ้า module **read-only** (เช่น public listing) → ใส่แค่ `queries/` ไม่ต้องมี `commands/`
- ถ้ามี **dual access** (admin จัดการ + public อ่าน) → แยก 2 controllers
- ถ้า command เกี่ยวข้องหลาย table → ใช้ `prisma.$transaction(...)` ใน repository
- ถ้าต้อง publish event → ใช้ `EventBus` จาก `@nestjs/cqrs`
