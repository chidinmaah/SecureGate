# code-style.md — SecureGate Code Style Rules

## Language

- TypeScript everywhere — no `.js` files in `app/`, `components/`, or `lib/`
- Never use `any` — use `unknown` and narrow it, or define a proper type
- Always define return types on functions that return non-trivial values
- Use `interface` for object shapes, `type` for unions and primitives

---

## Naming Conventions

| Thing              | Convention         | Example                          |
|--------------------|--------------------|----------------------------------|
| Files (components) | PascalCase         | `SignUpForm.tsx`                 |
| Files (lib/utils)  | camelCase          | `tokens.ts`, `mailer.ts`         |
| Files (routes)     | lowercase          | `route.ts`, `page.tsx`           |
| React components   | PascalCase         | `LoginForm`, `PasswordInput`     |
| Functions          | camelCase          | `generateToken()`, `hashPassword()`|
| Variables          | camelCase          | `expiresAt`, `isVerified`        |
| Constants          | SCREAMING_SNAKE    | `SALT_ROUNDS`, `TOKEN_EXPIRY_MS` |
| Types/Interfaces   | PascalCase         | `UserSession`, `SignUpInput`     |
| Zod schemas        | camelCase + Schema | `signUpSchema`, `loginSchema`    |
| API routes         | Descriptive nouns  | `/api/auth/signup`               |
| Environment vars   | SCREAMING_SNAKE    | `SMTP_HOST`, `NEXTAUTH_SECRET`   |

---

## TypeScript Patterns

### Always type API responses

```typescript
type ApiResponse<T = null> = {
  success: boolean
  message: string
  data?: T
  error?: string
}
```

### Always type Zod inference

```typescript
import { z } from 'zod'
import { signUpSchema } from '@/lib/validations'

type SignUpInput = z.infer<typeof signUpSchema>
```

### Never use `any` — narrow unknown instead

```typescript
// BAD
} catch (error: any) {
  return { error: error.message }
}

// GOOD
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  return { error: message }
}
```

---

## Function Patterns

### API route structure — always follow this order

```typescript
export async function POST(req: Request) {
  // 1. Rate limit
  // 2. Parse body
  // 3. Validate with Zod
  // 4. Business logic
  // 5. Database operation
  // 6. Return response
}
```

### Always handle errors explicitly

```typescript
// BAD — silent failure
const user = await db.user.findUnique({ where: { email } })
return user

// GOOD — explicit handling
const user = await db.user.findUnique({ where: { email } })
if (!user) {
  return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 })
}
```

---

## Imports

- Use `@/` path alias for all internal imports — never use relative `../../`
- Group imports: external packages → internal lib → internal components → types
- Never import server-only modules (Prisma, Nodemailer) in client components

```typescript
// External
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Internal lib
import { db } from '@/lib/db'
import { signUpSchema } from '@/lib/validations'
import { generateToken } from '@/lib/tokens'

// Types
import type { ApiResponse } from '@/types'
```

---

## Constants

Define all magic values as named constants in `lib/constants.ts`:

```typescript
export const SALT_ROUNDS = 12
export const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000  // 24 hours
export const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000              // 1 hour
export const MAX_LOGIN_ATTEMPTS = 5
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000               // 15 minutes
```

---

## Comments

- Comment the *why*, not the *what*
- Never leave `console.log` in production code — use structured logging
- Mark all TODO items with `// TODO:` and a description

```typescript
// BAD
// Hash the password
const hash = await bcrypt.hash(password, 12)

// GOOD
// Use 12 salt rounds — below 10 is too fast for brute force, above 14 is too slow for UX
const hash = await bcrypt.hash(password, SALT_ROUNDS)
```

---

## Formatting

- 2-space indentation
- Single quotes for strings
- Semicolons always
- Trailing commas in multi-line objects and arrays
- Max line length: 100 characters
- Use Prettier — do not override formatting manually
