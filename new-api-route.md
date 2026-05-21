# workflows/new-api-route.md — Adding a New API Route

## When to Use This Workflow

Use this workflow every time you need to add a new API route to SecureGate.
No auth endpoint gets built without following every step in order.

---

## Pre-Flight Checks

Before writing any code, confirm:

- [ ] This route does not already exist in `app/api/auth/`
- [ ] You have read `skills/api-route-scaffolder/SKILL.md`
- [ ] You have read `.agents/rules/security.md`
- [ ] You have read `.agents/rules/code-style.md`

---

## Step 1 — Define the Route

Decide:
- Endpoint path: `/api/auth/your-route-name`
- HTTP method: POST (all auth mutations are POST)
- What it does: one clear, single responsibility

All auth routes live under `app/api/auth/`. No exceptions.

---

## Step 2 — Create the Zod Schema

Before creating the route file, add the validation schema to `lib/validations.ts`:

```typescript
// lib/validations.ts
export const yourRouteSchema = z.object({
  field1: z.string().min(1),
  field2: z.string().email(),
  // define every expected field
})
```

Rules:
- Schema name: `camelCase` + `Schema` — e.g. `signUpSchema`, `resetPasswordSchema`
- Never define schemas inline inside route files
- Cover every field the route will receive

---

## Step 3 — Create the Route File

```bash
mkdir -p app/api/auth/your-route-name
touch app/api/auth/your-route-name/route.ts
```

---

## Step 4 — Scaffold the Handler

Follow the mandatory execution order from `skills/api-route-scaffolder/SKILL.md`:

```typescript
import { NextResponse } from 'next/server'
import { ratelimit } from '@/lib/ratelimit'
import { db } from '@/lib/db'
import { yourRouteSchema } from '@/lib/validations'

export async function POST(req: Request) {
  // 1. Rate limit
  // 2. Parse body
  // 3. Zod validate
  // 4. Business logic
  // 5. Side effects
  // 6. Return response
}
```

Do not skip or reorder any step.

---

## Step 5 — Apply Security Rules

Run through `.agents/rules/security.md` before finishing the route:

- [ ] Rate limiting is the first operation in the handler
- [ ] Body is parsed inside try/catch
- [ ] Zod validates before any DB operation
- [ ] Passwords hashed with bcryptjs at 12 salt rounds (if applicable)
- [ ] Tokens generated with `crypto.randomBytes()` (if applicable)
- [ ] Token expiry set at creation and checked at query level (if applicable)
- [ ] Error messages reveal nothing about email existence or which field failed
- [ ] Forgot-password returns the same message regardless of email match
- [ ] No secrets hardcoded in the file
- [ ] DB errors are caught and a generic message returned to client

---

## Step 6 — Add the Upstash Rate Limiter Config

Confirm `lib/ratelimit.ts` has the correct limit for this route type:

```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
})
```

For forgot-password use a stricter limit: 3 requests per 15 minutes.
Create a separate `ratelimitStrict` export if needed.

---

## Step 7 — Test the Route Manually

Before connecting to any UI, verify the route works:

**Test happy path:**
```bash
curl -X POST http://localhost:3000/api/auth/your-route \
  -H "Content-Type: application/json" \
  -d '{"field1": "value1", "field2": "value2"}'
```

**Test validation failure:**
```bash
curl -X POST http://localhost:3000/api/auth/your-route \
  -H "Content-Type: application/json" \
  -d '{}'
```
Expected: `400` with validation errors

**Test rate limit:**
Send 6+ rapid requests.
Expected: `429` on the 6th

---

## Step 8 — Connect to the Component

Once the route is verified:

1. If no UI component exists yet, run `workflows/new-component.md`
2. Connect the component's `handleSubmit` to fetch this route
3. Handle success and error states in the component

---

## Step 9 — Done Checklist

- [ ] Schema defined in `lib/validations.ts`
- [ ] Route file created at correct path
- [ ] Execution order: rate limit → parse → validate → logic → effects → respond
- [ ] Rate limiting applied — first operation, every time
- [ ] All DB operations inside try/catch
- [ ] Error messages are generic — nothing leaked to client
- [ ] Token generation uses `crypto.randomBytes()` (if applicable)
- [ ] Token expiry enforced at query level (if applicable)
- [ ] HTTP status codes are correct
- [ ] Route tested manually before connecting UI
- [ ] No `any` types in the file
- [ ] No hardcoded secrets
