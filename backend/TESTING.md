# TESTING.md — Test Strategy

## 🔺 Test Pyramid

```
        /\
       /e2e\          ← น้อย (~10%) — happy path + auth + CORS
      /------\
     /  intg  \       ← พอประมาณ (~30%) — repo + DB จริง
    /----------\
   /   unit     \     ← เยอะ (~60%) — handler + entity + pure logic
  /--------------\
```

---

## 🧪 1. Unit Test — Handler (เร็วสุด, mock repo)

**ที่ตั้ง:** ข้าง ๆ ไฟล์ handler `*.handler.spec.ts`

```ts
// src/application/category/commands/create-category.handler.spec.ts
import { ConflictException } from '@nestjs/common';
import { CreateCategoryHandler } from './create-category.handler';
import { CreateCategoryCommand } from './create-category.command';
import type { ICategoryRepository } from '../../../domain/category/category.repository';

describe('CreateCategoryHandler', () => {
  let handler: CreateCategoryHandler;
  let repo: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findByName: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    handler = new CreateCategoryHandler(repo);
  });

  it('creates category when name is unique', async () => {
    repo.findByName.mockResolvedValue(null);
    repo.create.mockResolvedValue({
      id: 'uuid-1', name: 'Food',
      createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    });

    const result = await handler.execute(new CreateCategoryCommand('Food'));

    expect(result.id).toBe('uuid-1');
    expect(repo.create).toHaveBeenCalledWith({ name: 'Food' });
  });

  it('throws ConflictException when name exists', async () => {
    repo.findByName.mockResolvedValue({ id: 'x', name: 'Food' } as any);

    await expect(
      handler.execute(new CreateCategoryCommand('Food')),
    ).rejects.toThrow(ConflictException);
    expect(repo.create).not.toHaveBeenCalled();
  });
});
```

**Rule:**
- Mock repository ผ่าน `jest.Mocked<I...>`
- ทดสอบ **business path** + **failure path** อย่างน้อย 2 case
- ห้าม import Prisma ใน unit test

---

## 🧪 2. Integration Test — Repository (DB จริง)

**ที่ตั้ง:** `test/integration/<noun>.repository.spec.ts`

```ts
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../src/infrastructure/prisma/prisma.service';
import { CategoryRepositoryImpl } from '../../src/infrastructure/prisma/repositories/category.repository.impl';

describe('CategoryRepositoryImpl (integration)', () => {
  let repo: CategoryRepositoryImpl;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService, CategoryRepositoryImpl],
    }).compile();

    repo = module.get(CategoryRepositoryImpl);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.category.deleteMany();
  });

  it('soft deletes — findById returns null after delete', async () => {
    const created = await repo.create({ name: 'Test' });
    await repo.delete(created.id);

    expect(await repo.findById(created.id)).toBeNull();
  });
});
```

**Rule:**
- ใช้ **test DB แยก** (`DATABASE_URL_TEST`) — ห้ามชน dev DB
- `beforeEach` clean table ที่จะ test
- ทดสอบ **edge case ของ DB** เช่น soft delete, unique constraint, transaction

---

## 🧪 3. E2E Test — HTTP

**ที่ตั้ง:** `test/e2e/<feature>.e2e-spec.ts`

```ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Category (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    // Login admin → get token
    const login = await request(app.getHttpServer())
      .post('/auth/admin/login')
      .send({ email: 'admin@example.com', password: 'Admin@1234' });
    adminToken = login.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /admin/categories returns 201 + wrapped response', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'E2E Test' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /admin/categories without token → 401', () =>
    request(app.getHttpServer())
      .post('/admin/categories')
      .send({ name: 'X' })
      .expect(401));
});
```

**Cover:**
- Happy path 1 ตัวต่อ endpoint
- Auth: missing token, wrong role
- Validation: missing required field
- Response shape: `success`, `data`

---

## ▶️ Commands

```bash
npm run test              # unit + integration
npm run test:watch        # watch mode
npm run test:cov          # coverage report
npm run test:e2e          # e2e only
npm run test:arch         # dependency rules (dependency-cruiser)
```

---

## 🎯 Coverage Goals

| Layer | Target |
|---|---|
| `domain/` (entities) | 100% |
| `application/` (handlers) | 90%+ |
| `infrastructure/` (repos) | 70%+ via integration |
| `presentation/` (controllers) | covered by e2e |

> Critical paths (auth, payment, order) ต้อง 95%+

---

## 🛠️ Test Data Factories

`test/factories/category.factory.ts`:
```ts
export const makeCategoryData = (overrides = {}) => ({
  id: 'uuid-test',
  name: 'Test Category',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  deletedAt: null,
  ...overrides,
});
```

ใช้ใน test แทนการ hard-code object ทุกครั้ง

---

## 🧱 Architecture Test (dependency rules)

`dependency-cruiser.js` มีอยู่แล้ว — รัน:
```bash
npm run test:arch
```

เช็ค:
- `domain/` ไม่ import `@nestjs/*`, `@prisma/*`, `infrastructure/`, `presentation/`
- `application/` ไม่ import `infrastructure/`
- ห้าม circular dependency

> **CI ต้อง block** ถ้า test:arch ไม่ผ่าน

---

## ⚠️ ที่ห้ามทำ

- ❌ Mock Prisma ใน integration test (มี test DB แยก)
- ❌ ใช้ dev DB ใน test (ข้อมูลจะหาย)
- ❌ Test ที่พึ่ง `Date.now()` แบบไม่ freeze (ใช้ `jest.useFakeTimers()`)
- ❌ Test ที่ไม่ deterministic (random UUID, network)
- ❌ Skip test ด้วย `.skip` แล้วลืม — เปิด lint rule
