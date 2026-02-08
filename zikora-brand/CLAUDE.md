# CLAUDE.md — Zikora Project Context

## Project Overview

Zikora is a DeFi chatbot on BNB Chain. Users connect their crypto wallet and execute operations (swap tokens, transfer, check portfolio, manage positions) through conversational chat commands.

**Name origin:** "Zikora" means "show the way" in Igbo (Nigeria). The mascot is a geometric ant representing collective intelligence, tireless execution, and organization.

**Tech stack:** React, Next.js, Tailwind CSS, TypeScript, ethers.js / wagmi for Web3

---

## Brand & Design Rules

### ALWAYS follow these when writing frontend code:

**Colors — use Tailwind custom classes defined in tailwind.config.js:**
- `bg-zikora-dark` (#12121A) — page backgrounds
- `bg-zikora-surface` (#1A1A26) — cards, elevated surfaces
- `border-zikora-border` (#2A2A3A) — all borders
- `text-zikora-orange` (#FF6B2C) — accent color, CTAs
- `text-text-primary` (#F0EDE6) — headings, main text
- `text-text-secondary` (#A8A4B8) — body text
- `text-text-muted` (#6B6880) — captions, disabled
- `text-success` (#00E676) — confirmed tx, profit
- `text-error` (#FF5252) — failed tx, loss
- `text-warning` (#F0B90B) — BNB related, pending

**Fonts:**
- `font-syne` — headings, logo, buttons, brand
- `font-dm` — body text, UI elements
- `font-mono` — wallet addresses, hashes, tx data, labels

**Components — use these CSS component classes from globals.css:**
- `.btn-primary` / `.btn-secondary` / `.btn-ghost` — buttons
- `.card` — interactive card with hover glow
- `.card-static` — non-interactive card
- `.input` — form inputs with focus ring
- `.chat-user` / `.chat-bot` / `.chat-system` — chat messages
- `.tag` / `.tag-accent` — label tags
- `.wallet-address` — wallet display
- `.section-label` — section headers
- `.navbar` — sticky navigation

**Radius:**
- Cards: `rounded-2xl` (16px)
- Buttons/Inputs: `rounded-xl` (12px)
- Chat bubbles: `rounded-[20px]`
- Tags: `rounded-full`

**NEVER:**
- Use light backgrounds
- Use colors outside the defined palette
- Use font-sans or system fonts directly (always use font-syne, font-dm, or font-mono)
- Use border radius smaller than rounded-lg (8px)
- Forget to add hover states on interactive elements

**ALWAYS:**
- Import Syne, DM Sans, Space Mono from Google Fonts
- Use dark backgrounds exclusively
- Display wallet addresses in Space Mono with truncation
- Add transition-all duration-200 ease-smooth on interactive elements
- Use orange (#FF6B2C) sparingly — only for CTAs, highlights, and the logo

---

## Logo Usage

The `ZikoraLogo` component (in components/ZikoraLogo.jsx) supports these props:
- `variant`: 'full' | 'icon' | 'text' | 'favicon' | 'token'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `color`: hex string for icon color
- `textColor`: hex string for text color

```jsx
// Navbar
<ZikoraLogo variant="full" size="sm" />

// Favicon
<ZikoraLogo variant="favicon" size="md" />

// Large hero
<ZikoraLogo variant="full" size="xl" />

// Icon only (loading states, mobile)
<ZikoraLogo variant="icon" size="md" />
```

---

## File Structure Reference

```
src/
  components/
    ZikoraLogo.jsx        — Logo component with all variants
  styles/
    globals.css           — Base styles, component classes, utilities
  app/
    layout.tsx            — Root layout with fonts and metadata
tailwind.config.js        — Extended theme with Zikora tokens
```

---

## Code Style

- TypeScript preferred
- Functional components with hooks
- Tailwind utility classes (extended with custom theme)
- Component classes from globals.css for repeated patterns
- Mobile-first responsive design
- Framer Motion for animations when needed
