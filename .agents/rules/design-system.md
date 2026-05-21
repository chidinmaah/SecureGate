# design-system.md — SecureGate Design System

## Philosophy

- Mobile-first — every screen works at 375px before it works at 1280px
- Minimal — auth flows are not the place for decoration
- Clear feedback — users always know what happened and what to do next
- Accessible — color alone never conveys meaning; labels always exist

---

## Color Tokens

```css
/* Brand */
--color-primary:        #1E3A5F;   /* Deep navy — primary actions */
--color-primary-hover:  #16304F;   /* Hover state */
--color-accent:         #2E75B6;   /* Links, focus rings, highlights */

/* Neutrals */
--color-bg:             #F9FAFB;   /* Page background */
--color-surface:        #FFFFFF;   /* Card / form background */
--color-border:         #E5E7EB;   /* Input borders, dividers */
--color-muted:          #6B7280;   /* Placeholder, helper text */
--color-text:           #111827;   /* Primary body text */

/* Feedback */
--color-success:        #16A34A;   /* Success messages, verified badge */
--color-success-bg:     #F0FDF4;   /* Success banner background */
--color-error:          #DC2626;   /* Error messages, field errors */
--color-error-bg:       #FEF2F2;   /* Error banner background */
--color-warning:        #D97706;   /* Warning states */
--color-warning-bg:     #FFFBEB;   /* Warning banner background */
```

---

## Typography

```css
/* Font */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Scale */
--text-xs:   12px;   /* Helper text, labels */
--text-sm:   14px;   /* Body, form inputs */
--text-base: 16px;   /* Default body */
--text-lg:   18px;   /* Subheadings */
--text-xl:   20px;   /* Card titles */
--text-2xl:  24px;   /* Page headings */
--text-3xl:  30px;   /* Hero headings */

/* Weight */
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

---

## Spacing Scale

Use multiples of 4px consistently:

```
4px   → gap-1, p-1, m-1
8px   → gap-2, p-2, m-2
12px  → gap-3, p-3, m-3
16px  → gap-4, p-4, m-4
24px  → gap-6, p-6, m-6
32px  → gap-8, p-8, m-8
48px  → gap-12, p-12, m-12
64px  → gap-16, p-16, m-16
```

---

## Layout

### Auth Pages
- Centered card layout on all screen sizes
- Card max-width: 400px
- Card padding: 32px (desktop), 24px (mobile)
- Page background: `--color-bg`
- Card background: `--color-surface`
- Card border: 1px solid `--color-border`
- Card border-radius: 12px
- Card box-shadow: `0 1px 3px rgba(0,0,0,0.1)`

### Dashboard
- Max content width: 1200px
- Horizontal padding: 24px (desktop), 16px (mobile)

---

## Component Patterns

### Input Field

```
Label (14px, semibold, --color-text)
↓ 6px gap
Input (16px, border: --color-border, radius: 8px, padding: 12px)
↓ 4px gap
Helper or Error text (12px, --color-muted or --color-error)
```

States:
- Default: border `--color-border`
- Focus: border `--color-accent`, ring `2px --color-accent at 20% opacity`
- Error: border `--color-error`, helper text in `--color-error`
- Disabled: background `#F3F4F6`, cursor not-allowed

### Button — Primary

```
Background: --color-primary
Text: white, 14px, semibold
Padding: 12px 24px
Border-radius: 8px
Hover: --color-primary-hover
Disabled: opacity 0.5, cursor not-allowed
Loading: spinner + "Please wait..." text, disabled
```

### Button — Ghost / Link

```
Background: transparent
Text: --color-accent, 14px, medium
Underline on hover
No border
```

### Alert / Feedback Banner

```
Success: background --color-success-bg, border-left 4px --color-success, text --color-success
Error:   background --color-error-bg,   border-left 4px --color-error,   text --color-error
Warning: background --color-warning-bg, border-left 4px --color-warning, text --color-warning
```

### Password Strength Indicator

```
4 segments below the password input
Weak:   1 segment red
Fair:   2 segments orange
Good:   3 segments yellow
Strong: 4 segments green
Label text updates to match: "Weak", "Fair", "Good", "Strong"
```

---

## Form Structure

```
Page title (2xl, bold)
↓ 8px
Subtitle or instruction (sm, --color-muted)
↓ 32px
Form fields (stacked, 16px gap between fields)
↓ 24px
Primary CTA button (full width)
↓ 16px
Secondary link (center aligned)
```

---

## Error Messaging

- Field-level errors appear below the relevant input — never as a toast
- Form-level errors (e.g. wrong password) appear as an Alert banner above the submit button
- Never show technical error details to the user
- Error text is always short — one sentence maximum

---

## Accessibility

- All inputs must have a visible `<label>` — never placeholder-only
- Error states must use `aria-describedby` to link input to error text
- Buttons must have descriptive text — never just "Submit"
- Focus order must follow visual order
- Minimum touch target: 44px × 44px on mobile
- Color contrast ratio: minimum 4.5:1 for text
