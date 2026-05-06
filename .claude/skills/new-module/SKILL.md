---
name: new-module
description: Scaffold a new feature module in the backend following Clean Architecture + CQRS pattern (domain → application → infrastructure → presentation). Use when the user asks to create/add a new module, feature, or resource (e.g. "add brand module", "สร้าง module review"). Generates entity, repository interface + impl, commands/queries with handlers, DTOs, controller, and module registration.
---

# Skill: Create New Backend Module

## When to use this skill

User asks to add a new feature/module/resource to the backend. Triggers:

- "add `<noun>` module"
- "สร้าง module `<noun>`"
- "scaffold `<noun>`"
- "เพิ่ม CRUD `<noun>`"

## Reference

The canonical template is the `category` module (most complete). Mirror its structure exactly. Read these files first to confirm current patterns before generating:

- `backend/src/domain/category/category.entity.ts`
- `backend/src/domain/category/category.repository.ts`
- `backend/src/application/category/commands/create-category.handler.ts`
- `backend/src/application/category/queries/get-id-categories.handler.ts`
- `backend/src/infrastructure/prisma/repositories/category.repository.impl.ts`
- `backend/src/presentation/category/category.controller.ts`
- `backend/src/presentation/category/category.module.ts`

Full step-by-step is documented in `backend/MODULE_GUIDE.md`. Architectural rules in `backend/ARCHITECTURE.md`. Naming/conventions in `backend/CONVENTIONS.md`.

## Steps

1. **Clarify scope before generating.** Ask the user 3 short questions if not specified:
   - What fields does the entity have? (and types — UUID, string, decimal, etc.)
   - Admin-only, public-only, or dual access?
   - Soft delete needed? (default: yes for user-facing data)

2. **Generate Prisma model first.**
   - Append to `backend/prisma/schema.prisma`
   - Use conventions: `String @id @default(uuid()) @db.Uuid`, `@map("snake_case")`, `@@map("plural_snake_case")`, audit fields (`createdAt`, `updatedAt`, `deletedAt?`)
   - Add `@@index` for fields used in filters
   - **Do not run migrate** — tell the user to run `npm run prisma:migrate -- --name add-<noun>` themselves.

3. **Create files in this order** (mirror `category` exactly):

   ```
   backend/src/domain/<noun>/<noun>.entity.ts
   backend/src/domain/<noun>/<noun>.repository.ts        # interface + Symbol token + Data interfaces
   backend/src/infrastructure/prisma/repositories/<noun>.repository.impl.ts
   backend/src/application/<noun>/commands/{create,update,delete}-<noun>.{command,handler}.ts
   backend/src/application/<noun>/commands/index.ts      # barrel array
   backend/src/application/<noun>/queries/{get-all,get-by-id}-<noun>.{query,handler}.ts
   backend/src/application/<noun>/queries/index.ts
   backend/src/presentation/<noun>/dto/{create,update}-<noun>.dto.ts
   backend/src/presentation/<noun>/dto/<noun>-response.dto.ts
   backend/src/presentation/<noun>/<noun>.controller.ts          # admin (@UseGuards(JwtAdminGuard))
   backend/src/presentation/<noun>/public-<noun>.controller.ts   # ONLY if public access needed
   backend/src/presentation/<noun>/<noun>.module.ts
   ```

4. **Register the module** in `backend/src/app.module.ts` — add to `imports` array.

5. **Hard rules — verify before reporting done:**
   - Domain entity has private constructor + `static create(...)` + `static reconstitute(...)`
   - Repository interface uses `Symbol` token: `export const <NOUN>_REPOSITORY = Symbol('<NOUN>_REPOSITORY');`
   - Domain layer imports **NOTHING** from `@nestjs/*`, `@prisma/*`, infrastructure, or presentation
   - Repository impl filters `deletedAt: null` in every read (if soft delete enabled)
   - Repository impl maps Prisma rows to `<Noun>Data` (no Prisma type leak)
   - Handler injects via `@Inject(<NOUN>_REPOSITORY)`, never instantiates impl directly
   - Handler throws Nest exceptions (`NotFoundException`, `ConflictException`) — never `new Error()`
   - Controller has `@ApiTags`, `@ApiBearerAuth`, `@UseGuards(JwtAdminGuard)` on admin routes
   - Every DTO field has `@ApiProperty`/`@ApiPropertyOptional` + a `class-validator` decorator
   - Endpoint URL pattern: admin → `/admin/<plural-kebab>`, public → `/<plural-kebab>`
   - Money fields use `Decimal @db.Decimal(10, 2)` in Prisma — never `Float`

6. **Tell the user, in this exact order:**
   - List of files created
   - Migration command to run: `cd backend && npm run prisma:migrate -- --name add-<noun>`
   - Suggest writing handler unit tests next (point to `TESTING.md`)
   - Add to `backend/apiSpace.md` if it tracks endpoints

## What NOT to do

- Do not create the module if the user hasn't specified entity fields. Ask first.
- Do not run `prisma migrate` yourself — it's destructive-adjacent and the user should review the generated migration.
- Do not import `PrismaClient` or `PrismaService` in `application/` or `domain/` layers.
- Do not skip the `index.ts` barrel files in `commands/` and `queries/` — `<noun>.module.ts` depends on them.
- Do not write tests as part of scaffolding unless the user asks. Suggest it instead.
- Do not modify existing modules' code while scaffolding a new one. Stay in scope.
