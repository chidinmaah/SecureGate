# workflows/new-component.md — Adding a New Component

## When to Use This Workflow

Use this workflow every time you need to add a new UI component to SecureGate,
whether it is a primitive (Button, Input) or an auth-specific form (LoginForm).

---

## Pre-Flight Checks

Before writing any code, confirm:

- [ ] This component does not already exist in `components/ui/` or `components/auth/`
- [ ] You have read `skills/component-builder/SKILL.md`
- [ ] You have read `.agents/rules/design-system.md`
- [ ] You have read `.agents/rules/code-style.md`

---

## Step 1 — Classify

Answer these questions:

**1. Server or client component?**
- Needs `useState`, `useEffect`, event handlers, or browser APIs → `"use client"`
- Only renders data passed as props → server component

**2. Where does it live?**
- Generic primitive → `components/ui/ComponentName.tsx`
- Auth-specific → `components/auth/ComponentName.tsx`

**3. Does it handle a form?**
- Yes → it needs a Zod schema imported from `lib/validations.ts`
- No → skip schema

---

## Step 2 — Create the File

```bash
# For a UI primitive
touch components/ui/ComponentName.tsx

# For an auth component
touch components/auth/ComponentName.tsx
```

File naming: PascalCase always.

---

## Step 3 — Scaffold the Component

Follow the template from `skills/component-builder/SKILL.md`:

1. Add `"use client"` if needed
2. Define the `Props` interface
3. Write the component function
4. Handle loading and error states (for forms)
5. Apply design system tokens
6. Export as a named export

---

## Step 4 — Connect to API (for forms)

If the component submits data to an API route:

1. Confirm the API route exists — check `app/api/auth/`
2. If it does not exist, run `workflows/new-api-route.md` first
3. Call the route using `fetch` inside `handleSubmit`
4. Handle the response — success redirect or error display

```typescript
const res = await fetch('/api/auth/route-name', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
})

const data = await res.json()

if (!res.ok) {
  setError(data.message ?? 'Something went wrong. Please try again later.')
  return
}

// handle success — redirect or show success state
```

---

## Step 5 — Accessibility Pass

Before finishing:

- [ ] Every `<input>` has a `<label>` with `htmlFor` matching `id`
- [ ] Error messages use `aria-describedby` to link to their input
- [ ] Button text is descriptive — not "Submit" alone
- [ ] Loading state disables all inputs and the button
- [ ] Keyboard navigation works in logical order
- [ ] Component renders correctly at 375px width

---

## Step 6 — Render in a Page

Add the component to the relevant page in `app/(auth)/`:

```typescript
// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  )
}
```

---

## Step 7 — Done Checklist

- [ ] Component file is in the correct folder
- [ ] Named export used — not default
- [ ] Props interface is typed — no `any`
- [ ] Loading and error states handled (forms)
- [ ] Design system tokens applied
- [ ] Accessibility checks passed
- [ ] Renders correctly on mobile (375px)
- [ ] Linked to the correct page
