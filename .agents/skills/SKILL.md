# SKILL.md — Component Builder

## Purpose

Use this skill whenever you need to build a new UI component for SecureGate.
Covers auth forms, input fields, buttons, banners, and layout wrappers.

---

## Step 1 — Classify the Component

Before writing any code, answer these three questions:

1. **Server or client?**
   - Needs state, event handlers, or browser APIs → `"use client"`
   - Just renders data passed as props → server component (no directive needed)

2. **Where does it live?**
   - Generic UI primitive (Button, Input, Badge) → `components/ui/`
   - Auth-specific (SignUpForm, LoginForm, PasswordInput) → `components/auth/`

3. **Does it need a Zod schema?**
   - Form component → yes, import schema from `lib/validations.ts`
   - Display component → no

---

## Step 2 — File and Naming

```
components/
├── ui/
│   └── ComponentName.tsx       ← PascalCase, always
└── auth/
    └── ComponentName.tsx
```

- File name: PascalCase — `PasswordInput.tsx`, `AuthCard.tsx`
- Component name: matches file name exactly
- Props interface: `ComponentNameProps`

---

## Step 3 — Component Template

### Client Component (Form)

```typescript
"use client"

import { useState } from 'react'
import { z } from 'zod'
import { schemaName } from '@/lib/validations'

interface ComponentNameProps {
  // define all props explicitly — no implicit any
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // call API route
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorBanner message={error} />}
      {/* fields */}
      <Button type="submit" isLoading={isLoading}>
        Submit
      </Button>
    </form>
  )
}
```

### Server Component (Display)

```typescript
interface ComponentNameProps {
  // define all props explicitly
}

export function ComponentName({ prop1 }: ComponentNameProps) {
  return (
    <div>
      {/* content */}
    </div>
  )
}
```

---

## Step 4 — Design System Compliance

Apply these from `design-system.md` on every component:

- Input fields: label → input → helper/error text
- Error text: below the input, `text-sm text-red-600`, linked via `aria-describedby`
- Buttons: full width on auth forms, show spinner + "Please wait..." when loading
- Disabled state on all inputs and button while `isLoading` is true
- Color tokens: use CSS variables, never hardcode hex values inline

---

## Step 5 — Accessibility Checklist

Before marking a component done:

- [ ] Every input has a visible `<label>` with matching `htmlFor` / `id`
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Button has descriptive text — not just "Submit"
- [ ] Loading state disables all interactive elements
- [ ] Component works at 375px viewport width
- [ ] Focus ring is visible on all focusable elements

---

## Step 6 — Export

Always use named exports — never default exports for components:

```typescript
// CORRECT
export function LoginForm() {}

// WRONG
export default function LoginForm() {}
```

---

## Common Components Reference

| Component         | Location              | Purpose                            |
|-------------------|-----------------------|------------------------------------|
| `Button`          | `components/ui/`      | Primary and ghost button variants  |
| `Input`           | `components/ui/`      | Text input with label and error    |
| `PasswordInput`   | `components/ui/`      | Input with show/hide toggle        |
| `AuthCard`        | `components/ui/`      | Centered card wrapper for auth pages|
| `ErrorBanner`     | `components/ui/`      | Form-level error alert             |
| `SuccessBanner`   | `components/ui/`      | Form-level success alert           |
| `StrengthMeter`   | `components/ui/`      | Password strength indicator        |
| `SignUpForm`      | `components/auth/`    | Full sign up form                  |
| `LoginForm`       | `components/auth/`    | Full login form                    |
| `ForgotPasswordForm` | `components/auth/` | Forgot password form               |
| `ResetPasswordForm` | `components/auth/`  | Reset password form                |
