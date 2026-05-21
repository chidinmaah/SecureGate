# SKILL.md — API Route Scaffolder

## Purpose

Use this skill whenever you need to build a new API route for SecureGate.
Every auth endpoint must follow this exact structure — no shortcuts.

---

## Step 1 — Locate the Route

All API routes live under `app/api/auth/`:

```
app/api/auth/
├── [...nextauth]/route.ts     ← NextAuth — do not modify manually
├── signup/route.ts
├── verify-email/route.ts
├── forgot-password/route.ts
└── reset-password/route.ts
```

File name is always `route.ts`. The folder name is the endpoint path.

---

## Step 2 — Mandatory Execution Order

Every POST handler must follow this exact order. Do not skip or reorder steps.

```
1. Rate limit check
2. Parse request body
3. Zod validation
4. Business logic (DB read, token check, etc.)
5. Side effects (DB write, send email)
6. Return response
```

If any step fails, return immediately — do not continue to the next step.

---

## Step 3 — Route Template

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ratelimit } from '@/lib/ratelimit'
import { db } from '@/lib/db'
import { schemaName } from '@/lib/validations'

export async function POST(req: Request) {
  // ── 1. Rate Limit ──────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success: rateLimitOk } = await ratelimit.limit(ip)

  if (!rateLimitOk) {
    return NextResponse.json(
      { success: false, message: 'Too many attempts. Please try again later.' },
      { status: 429 }
    )
  }

  // ── 2. Parse Body ───────────────────────────────────────────────
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 }
    )
  }

  // ── 3. Validate ─────────────────────────────────────────────────
  const result = schemaName.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid input.', errors: result.error.flatten() },
      { status: 400 }
    )
  }

  const { field1, field2 } = result.data

  // ── 4. Business Logic ───────────────────────────────────────────
  // DB reads, token validation, existence checks

  // ── 5. Side Effects ─────────────────────────────────────────────
  // DB writes, email sending

  // ── 6. Response ─────────────────────────────────────────────────
  return NextResponse.json(
    { success: true, message: 'Action completed.' },
    { status: 200 }
  )
}
```

---

## Step 4 — Error Handling Pattern

Wrap all database and email operations in try/catch.
Never let an unhandled exception reach the client.

```typescript
try {
  await db.user.create({ data: { ... } })
} catch (error: unknown) {
  console.error('[ROUTE_NAME] DB error:', error)
  return NextResponse.json(
    { success: false, message: 'Something went wrong. Please try again later.' },
    { status: 500 }
  )
}
```

Rules:
- Log the real error server-side with a route label: `[SIGNUP]`, `[LOGIN]`, etc.
- Return a generic message to the client — never expose DB errors
- Always return `{ success: boolean, message: string }` shape

---

## Step 5 — Status Code Reference

| Scenario                        | Status |
|---------------------------------|--------|
| Success                         | 200    |
| Resource created                | 201    |
| Invalid input (Zod failure)     | 400    |
| Unauthenticated                 | 401    |
| Forbidden (verified check)      | 403    |
| Rate limit exceeded             | 429    |
| Server / database error         | 500    |

---

## Step 6 — Security Checklist

Before finalising any route:

- [ ] Rate limiting is the first operation
- [ ] Body is parsed inside try/catch
- [ ] Zod validates before any DB operation
- [ ] Passwords are hashed — never stored plain
- [ ] Tokens are generated with `crypto.randomBytes()`
- [ ] Token expiry set at creation and checked at query level
- [ ] Error messages do not reveal email existence or field details
- [ ] Forgot-password returns same message regardless of email match
- [ ] No secrets hardcoded in route file

---

## Step 7 — Zod Schema Location

Never define a schema inline inside a route file.
Always define in `lib/validations.ts` and import:

```typescript
// lib/validations.ts
export const signUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

// app/api/auth/signup/route.ts
import { signUpSchema } from '@/lib/validations'
```

---

## Route Summary

| Route                         | Method | What It Does                              |
|-------------------------------|--------|-------------------------------------------|
| `/api/auth/signup`            | POST   | Create user, send verification email      |
| `/api/auth/verify-email`      | POST   | Validate token, set isVerified true       |
| `/api/auth/forgot-password`   | POST   | Generate reset token, send reset email    |
| `/api/auth/reset-password`    | POST   | Validate token, hash + update password    |
| `/api/auth/[...nextauth]`     | ANY    | NextAuth session — do not scaffold manually|
