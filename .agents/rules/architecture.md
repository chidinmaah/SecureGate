# architecture.md — SecureGate Architecture Rules

## Folder Structure

```
securegate/
├── app/
│   ├── (auth)/
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── verify-email/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts
│   │       ├── signup/
│   │       │   └── route.ts
│   │       ├── verify-email/
│   │       │   └── route.ts
│   │       ├── forgot-password/
│   │       │   └── route.ts
│   │       └── reset-password/
│   │           └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/               ← Primitive components (Button, Input, etc.)
│   └── auth/             ← Auth-specific components (SignUpForm, LoginForm, etc.)
├── emails/               ← React Email templates
│   ├── verification.tsx
│   └── reset-password.tsx
├── lib/
│   ├── auth.ts           ← NextAuth config
│   ├── db.ts             ← Prisma client singleton
│   ├── mailer.ts         ← Nodemailer transport + send helpers
│   ├── ratelimit.ts      ← Upstash rate limiter config
│   ├── tokens.ts         ← Token generation and validation helpers
│   └── validations.ts    ← All Zod schemas
├── middleware.ts          ← Route protection logic
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .agents/
│   └── rules/
├── skills/
├── workflows/
└── .env.local
```

---

## Routing Rules

- All auth pages live inside the `(auth)` route group
- The `(auth)` group shares a layout with no navigation — clean, focused pages
- `/dashboard` is a standalone protected route outside `(auth)`
- All API routes live under `/api/auth/`
- NextAuth lives at `/api/auth/[...nextauth]/route.ts`

---

## Layering Rules

### Pages (`app/`)
- Pages are server components by default
- Pages only fetch data and pass it to components
- Pages never contain business logic
- Mark client components explicitly with `"use client"` at the top

### Components (`components/`)
- UI primitives go in `components/ui/`
- Auth-specific forms and views go in `components/auth/`
- Components never call the database directly
- Components never contain auth business logic

### API Routes (`app/api/`)
- All business logic lives in API routes or server actions
- Every route validates input with Zod before any operation
- Every route applies rate limiting before any operation
- Every route returns consistent JSON responses

### Lib (`lib/`)
- `db.ts` exports a single Prisma client instance — never instantiate Prisma elsewhere
- `auth.ts` exports the NextAuth config — import `authOptions` from here everywhere
- `tokens.ts` handles all token generation and expiry checks
- `validations.ts` holds all Zod schemas — import schemas from here, never inline

### Middleware (`middleware.ts`)
- Runs on every request to `/dashboard` and all future protected routes
- Checks for a valid NextAuth session
- Checks `isVerified` status
- Redirects unauthenticated or unverified users to `/login`

---

## Data Flow

```
Client → API Route → Zod Validation → Rate Limiter → Business Logic → Prisma → PostgreSQL
                                                                     ↓
                                                              Nodemailer (email)
                                                                     ↓
                                                            JSON Response → Client
```

---

## Environment Variables

All secrets must live in `.env.local`. Never hardcode values.

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## Rules

- Never put auth or database logic inside a page or component
- Never instantiate Prisma more than once — use the singleton in `lib/db.ts`
- Never import server-only modules inside client components
- Never use the `pages/` router — this project uses App Router exclusively
- Always co-locate email templates in `emails/`
- Always keep Zod schemas in `lib/validations.ts`
