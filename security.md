# security.md — SecureGate Security Rules

## Non-Negotiable Rules

These are not suggestions. Every rule below is enforced on every feature.
If a rule is broken, the feature is not done.

---

## Passwords

- NEVER store a password in plain text — not even temporarily
- ALWAYS hash with `bcryptjs` at exactly 12 salt rounds
- ALWAYS use `bcrypt.compare()` for verification — never compare strings
- NEVER log a password, even partially, even in development

```typescript
// CORRECT
import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from '@/lib/constants'

const hash = await bcrypt.hash(password, SALT_ROUNDS)
const isValid = await bcrypt.compare(password, storedHash)

// WRONG — never do this
const isValid = password === storedPassword
const hash = Buffer.from(password).toString('base64')
```

---

## Tokens

- ALWAYS generate tokens with `crypto.randomBytes()` — never `Math.random()`
- ALWAYS store the expiry at time of creation
- ALWAYS check expiry at the database query level — not just in application code
- ALWAYS delete or invalidate tokens immediately after use
- ALWAYS mark password reset tokens `used: true` on first use
- Verification token expiry: 24 hours
- Password reset token expiry: 1 hour

```typescript
// CORRECT token generation
import crypto from 'crypto'

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// CORRECT expiry check — at query level
const token = await db.passwordResetToken.findUnique({
  where: {
    token,
    expiresAt: { gt: new Date() },   // enforced in the query
    used: false,
  },
})
```

---

## Input Validation

- ALWAYS validate with Zod on the server — client validation is UX only
- ALWAYS validate before any database operation
- ALWAYS validate before sending any email
- NEVER trust any value that comes from the client
- NEVER pass raw request body directly to Prisma

```typescript
// CORRECT
const result = signUpSchema.safeParse(await req.json())
if (!result.success) {
  return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 })
}
const { name, email, password } = result.data  // safe, typed

// WRONG
const { name, email, password } = await req.json()
await db.user.create({ data: { name, email, password } })
```

---

## Error Messages

Error messages must NEVER reveal:
- Which field is wrong (email vs password)
- Whether an email address exists in the database
- Stack traces or internal error details
- Database error codes or messages

```typescript
// CORRECT — generic, reveals nothing
return NextResponse.json(
  { success: false, message: 'Invalid email or password' },
  { status: 401 }
)

// WRONG — leaks information
return NextResponse.json(
  { success: false, message: 'No account found with this email' },
  { status: 404 }
)
```

### Forgot Password — Always return the same message

```typescript
// CORRECT — identical response whether email exists or not
return NextResponse.json({
  success: true,
  message: 'If this email exists, a reset link has been sent',
})

// WRONG — leaks whether email is registered
if (!user) {
  return NextResponse.json({ message: 'Email not found' }, { status: 404 })
}
```

---

## Rate Limiting

Rate limiting is required on every auth endpoint. No exceptions.

| Endpoint                      | Limit              | Window     |
|-------------------------------|--------------------|------------|
| `POST /api/auth/login`        | 5 requests per IP  | 15 minutes |
| `POST /api/auth/signup`       | 5 requests per IP  | 15 minutes |
| `POST /api/auth/forgot-password` | 3 requests per IP | 15 minutes |

```typescript
// CORRECT — rate limit is always first
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return NextResponse.json(
      { success: false, message: 'Too many attempts. Please try again later.' },
      { status: 429 }
    )
  }
  // ... rest of handler
}
```

---

## Session Security

- ALWAYS configure NextAuth session cookies as `httpOnly`, `secure`, `sameSite: strict`
- ALWAYS destroy session server-side on logout — never just clear the cookie client-side
- ALWAYS replace duplicate sessions on new login — never accumulate sessions
- NEVER expose session tokens in URLs or response bodies

```typescript
// nextauth config — enforce cookie security
cookies: {
  sessionToken: {
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  },
},
```

---

## Environment Variables

- NEVER hardcode secrets — not even in development
- NEVER commit `.env.local` to Git — it must be in `.gitignore`
- ALWAYS access env vars through `process.env.VARIABLE_NAME`
- ALWAYS validate required env vars exist at startup

```typescript
// CORRECT — validate at startup in lib/env.ts
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
]

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})
```

---

## Middleware Route Protection

Middleware must run on every protected route and enforce:

1. Valid NextAuth session exists
2. User `isVerified` is `true`
3. If either fails — redirect to `/login`

```typescript
// middleware.ts
export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

---

## What to Never Do

| Never | Because |
|---|---|
| Store plain text passwords | Catastrophic if database is breached |
| Use `Math.random()` for tokens | Predictable, not cryptographically secure |
| Skip Zod validation | Raw client input can contain anything |
| Return `404` for missing emails | Confirms whether email is registered |
| Reuse a reset token | Replay attack vector |
| Expose error details to client | Leaks internal system information |
| Hardcode secrets | Exposed in version control |
| Skip rate limiting | Login endpoint becomes brute-force target |
| Trust `isVerified` from client | Client data is always attacker-controlled |
| Log passwords or tokens | Creates a secondary exposure vector |
