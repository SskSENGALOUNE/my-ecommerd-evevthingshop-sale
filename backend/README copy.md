# Clean Architecture NestJS Template with CQRS

This is a NestJS template implementing Clean Architecture principles with CQRS pattern, Prisma ORM, and PostgreSQL.

## Project Structure

```
clean-nest/
├── src/
│   ├── application/          # Application layer (CQRS commands and queries)
│   │   └── ex-module/
│   │       ├── commands/     # Command handlers (write operations)
│   │       └── queries/      # Query handlers (read operations)
│   ├── domain/              # Domain layer (business logic and entities)
│   │   └── ex-module/
│   ├── infrastructure/       # Infrastructure layer (database, external services)
│   │   └── prisma/
│   └── presentation/         # Presentation layer (controllers, DTOs)
│       └── ex-module/
├── prisma/
│   └── schema.prisma        # Prisma schema definition
└── test/
```

## Architecture Overview

### Clean Architecture Layers

1. **Domain Layer**: Contains business entities and repository interfaces
2. **Application Layer**: Implements CQRS with command and query handlers
3. **Infrastructure Layer**: Implements repositories and external dependencies (Prisma)
4. **Presentation Layer**: Contains controllers and DTOs

### CQRS Pattern

- **Commands**: Handle write operations (Create, Update, Delete)
- **Queries**: Handle read operations (Get, List)

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker and Docker Compose (for PostgreSQL)

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL Database

Using Docker Compose:

```bash
docker-compose up -d
```

Or using Docker directly:

```bash
docker run -d \
  --name postgres-clean-nest \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=template_clean_nest \
  -p 5433:5433 \
  postgres:15-alpine
```

### 3. Configure Environment Variables

The `.env` file is already configured with:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/template_clean_nest?schema=public"
```

### 4. Run Prisma Migrations

```bash
pnpm prisma:migrate
```

This will:

- Create the database tables
- Generate the Prisma Client

### 5. Start the Application

Development mode:

```bash
pnpm start:dev
```

Production mode:

```bash
pnpm build
pnpm start:prod
```

## Available Scripts

- `pnpm start:dev` - Start development server with hot reload
- `pnpm build` - Build the application
- `pnpm start:prod` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio

## API Endpoints

### ExTable Resource

- `POST /ex-tables` - Create a new record

  ```json
  {
    "name": "Example",
    "createdBy": "user-id"
  }
  ```

- `GET /ex-tables` - Get all records

- `GET /ex-tables/:id` - Get a record by ID

- `PUT /ex-tables/:id` - Update a record

  ```json
  {
    "name": "Updated Name",
    "updatedBy": "user-id"
  }
  ```

- `DELETE /ex-tables/:id` - Delete a record

## Database Schema

The `ex_table` model includes:

- `id` (UUID, primary key)
- `name` (String)
- `created_at` (DateTime)
- `created_by` (String)
- `updated_at` (DateTime)
- `updated_by` (String)

## Adding New Modules

To add a new module following the clean architecture:

1. **Domain Layer**: Create entity and repository interface in `src/domain/your-module/`
2. **Infrastructure Layer**: Implement repository in `src/infrastructure/prisma/repositories/`
3. **Application Layer**: Create commands and queries in `src/application/your-module/`
4. **Presentation Layer**: Create controller and DTOs in `src/presentation/your-module/`
5. Update `app.module.ts` to import the new module

## Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Pattern**: CQRS (Command Query Responsibility Segregation)
- **Architecture**: Clean Architecture
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

## License

UNLICENSED
