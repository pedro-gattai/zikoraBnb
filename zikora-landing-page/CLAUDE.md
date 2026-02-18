# CLAUDE.md — Zikora Landing Page

## What is this?

Marketing landing page and documentation site for Zikora. Static export deployed to Vercel.

---

## Tech Stack

- **Next.js 16** + **React 19** + **TypeScript 5.7**
- **Tailwind CSS 3.4** with custom theme tokens
- **shadcn/ui** (52+ Radix UI components in `components/ui/`)
- **Lucide React** for icons
- **Static export** (`output: 'export'` in next.config.mjs)

---

## Folder Structure

```
zikora-landing-page/
├── app/
│   ├── layout.tsx           # Root layout (fonts, metadata, ThemeProvider)
│   ├── page.tsx             # / — Landing page
│   ├── docs/page.tsx        # /docs — Documentation (9 sections + sidebar TOC)
│   └── globals.css          # CSS variables, design tokens, animations
├── components/
│   ├── navbar.tsx
│   ├── hero-section.tsx     # Hero with ChatMock preview
│   ├── features-section.tsx
│   ├── how-it-works-section.tsx
│   ├── cta-section.tsx
│   ├── footer.tsx
│   ├── chat-mock.tsx        # Interactive chat demo
│   ├── zikora-logo.tsx
│   ├── theme-provider.tsx
│   ├── docs/                # DocsLayout, DocsSidebar, DocsSection
│   └── ui/                  # shadcn/ui components (button, card, dialog, etc.)
├── hooks/
│   ├── use-active-section.ts   # IntersectionObserver for scroll tracking
│   ├── use-in-view.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts             # cn() helper (clsx + tailwind-merge)
├── styles/
│   └── globals.css          # (legacy — real styles in app/globals.css)
├── public/                  # Placeholder assets
├── tailwind.config.ts
├── components.json          # shadcn/ui config
├── next.config.mjs
└── postcss.config.mjs
```

---

## Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Landing page (hero, features, how-it-works, CTA, footer) |
| `/docs` | `app/docs/page.tsx` | Documentation with 9 sections and sidebar TOC |

**Docs sections:** Introduction, Quick Start, Architecture, AI Agents, Supported Tokens, Contract Addresses, API Reference, Security, FAQ.

---

## Fonts

Configured in `app/layout.tsx` via Google Fonts:

| Font | CSS Variable | Tailwind Class | Usage |
|------|-------------|----------------|-------|
| Syne | `--font-syne` | `font-heading` | Headings, logo, buttons |
| DM Sans | `--font-dm-sans` | `font-sans` | Body text, UI elements |
| Space Mono | `--font-space-mono` | `font-mono` | Code, addresses |

---

## Design System

See `../zikora-brand/CLAUDE.md` for full design rules.

**Key CSS variables** (in `app/globals.css`):
- `--background: 240 20% 9%` → `#12121A` (dark bg)
- `--foreground: 30 20% 93%` → `#F0EDE6` (text)
- `--primary: 18 100% 56%` → `#FF6B2C` (orange accent)
- `--card: 240 20% 12%` → `#1A1A26` (surface)
- `--muted: 252 10% 46%` → secondary text
- `--radius: 0.75rem` → 12px default border radius

**Rules:** Dark theme only. Orange sparingly (CTAs, highlights, logo only).

---

## shadcn/ui Configuration

From `components.json`:
- Style: `default`
- RSC: `true`
- CSS variables: `true`
- Icon library: `lucide`
- Aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/hooks`

---

## Path Alias

```json
"@/*" → "./*"
```

All imports use `@/components/...`, `@/lib/...`, `@/hooks/...`.

---

## Commands

```bash
pnpm install
pnpm dev          # Dev server (port 3000)
pnpm build        # Static export to out/
pnpm lint
```

---

## Conventions

- TypeScript everywhere
- Functional components with hooks
- Tailwind utility classes with custom theme tokens
- `cn()` from `lib/utils.ts` for conditional class merging
- Dark theme only — never use light backgrounds
- Mobile-first responsive design (md: and lg: breakpoints)
- Transitions: `transition-all duration-200` on interactive elements
