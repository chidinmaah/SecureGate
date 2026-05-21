# SKILL.md — DB Migration Runner

## Purpose

Use this skill whenever you need to create, modify, or run a Prisma database
migration for SecureGate. Covers schema changes, migration commands, and
the rules for keeping the database in sync with the codebase.

---

## Prisma Setup

ORM: Prisma
Database: PostgreSQL
Schema file: `prisma/schema.prisma`
Migrations folder: `prisma/migrations/`
Client: singleton in `lib/db.ts`

---

## Step 1 — Edit the Schema

All schema changes start in `prisma/schema.prisma`.
Never modify the database directly — always go through Prisma migrations.

### Full SecureGate Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  isVerified   Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  verificationTokens  VerificationToken[]
  passwordResetTokens PasswordResetToken[]
  sessions            Session[]
  accounts            Account[]
}

model VerificationToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

---

## Step 2 — Migration Commands

### Create and apply a new migration (development)

```bash
npx prisma migrate dev --name describe_your_change
```

Use descriptive migration names:
- `add_user_table`
- `add_verification_token`
- `add_is_verified_to_user`
- `add_password_reset_token`

### Apply existing migrations (CI / production)

```bash
npx prisma migrate deploy
```

### Reset database (development only — destroys all data)

```bash
npx prisma migrate reset
```

### Check migration status

```bash
npx prisma migrate status
```

### Generate Prisma client after schema change

```bash
npx prisma generate
```

Always run `prisma generate` after any schema change, before running the app.

---

## Step 3 — Prisma Client Singleton

Never instantiate `PrismaClient` more than once.
Always import from `lib/db.ts`:

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
```

Import everywhere else as:

```typescript
import { db } from '@/lib/db'
```

---

## Step 4 — Common Query Patterns

### Create a user

```typescript
const user = await db.user.create({
  data: {
    name,
    email,
    passwordHash: hash,
  },
})
```

### Find user by email

```typescript
const user = await db.user.findUnique({
  where: { email },
})
```

### Create a verification token

```typescript
const token = await db.verificationToken.create({
  data: {
    userId: user.id,
    token: generatedToken,
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS),
  },
})
```

### Find and validate a token (expiry checked in query)

```typescript
const record = await db.verificationToken.findUnique({
  where: {
    token,
    expiresAt: { gt: new Date() },
  },
})

if (!record) {
  // token missing or expired
}
```

### Mark reset token as used

```typescript
await db.passwordResetToken.update({
  where: { token },
  data: { used: true },
})
```

### Update password

```typescript
await db.user.update({
  where: { id: userId },
  data: { passwordHash: newHash },
})
```

### Set user as verified and delete token (transaction)

```typescript
await db.$transaction([
  db.user.update({
    where: { id: token.userId },
    data: { isVerified: true },
  }),
  db.verificationToken.delete({
    where: { id: token.id },
  }),
])
```

---

## Step 5 — Migration Rules

- Never edit a migration file that has already been applied — create a new one
- Always run `prisma generate` after editing the schema
- Never run `migrate reset` in production — data is permanently lost
- Always use `migrate deploy` in production and CI environments
- Always use `onDelete: Cascade` on relations to User — orphaned tokens must not persist
- Never access the database URL directly — always use `env("DATABASE_URL")`
- Always add indexes for fields used in `where` queries:

```prisma
model VerificationToken {
  token String @unique   ← @unique creates an index automatically
}
```

---

## Step 6 — Migration Checklist

Before applying any migration:

- [ ] Schema change is intentional and matches the feature being built
- [ ] Migration name describes the change clearly
- [ ] `prisma generate` will be run after migration
- [ ] `onDelete: Cascade` is set on all User relations
- [ ] No sensitive data is hardcoded in seed files
- [ ] Migration tested locally before pushing to production
