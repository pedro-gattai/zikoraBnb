# Zikora Brand Guide

> **Zikora** — "Show the way" in Igbo (Nigeria). A DeFi chatbot on BNB Chain that executes crypto operations via conversational commands.

## Brand Identity

**Symbol:** Geometric ant (3 stacked circles + V-shaped antennae)
**Personality:** Intelligent, tireless, collective, precise
**Tagline:** "Show the way"

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Zikora Orange | `#FF6B2C` | 255, 107, 44 | Primary accent, CTAs, logo icon, highlights |
| Zikora Dark | `#12121A` | 18, 18, 26 | Primary background |
| Zikora Surface | `#1A1A26` | 26, 26, 38 | Cards, elevated surfaces |
| Zikora Border | `#2A2A3A` | 42, 42, 58 | Borders, dividers |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#F0EDE6` | Headings, primary text |
| Text Secondary | `#A8A4B8` | Body text, descriptions |
| Text Muted | `#6B6880` | Captions, labels, disabled |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#00E676` | Transactions confirmed, profits |
| Error | `#FF5252` | Errors, losses |
| Warning | `#F0B90B` | BNB-related, pending states |
| Info | `#00BCD4` | Informational, links |

### Gradients

```css
/* Primary gradient - buttons, hero sections */
background: linear-gradient(135deg, #FF6B2C 0%, #FF8F5C 100%);

/* Subtle glow - card hover, focus states */
background: radial-gradient(ellipse at center, rgba(255, 107, 44, 0.15) 0%, transparent 70%);

/* Dark gradient - backgrounds */
background: linear-gradient(180deg, #12121A 0%, #0A0A0F 100%);
```

---

## Typography

### Font Stack

```css
/* Primary - Headings, Logo, Brand */
font-family: 'Syne', system-ui, sans-serif;

/* Secondary - Body text, UI */
font-family: 'DM Sans', system-ui, sans-serif;

/* Mono - Code, addresses, data */
font-family: 'Space Mono', 'Courier New', monospace;
```

### Scale

| Element | Font | Weight | Size | Letter Spacing |
|---------|------|--------|------|----------------|
| Logo text | Syne | 800 | 32-48px | 6-8px |
| H1 | Syne | 800 | 48px / 3rem | -0.02em |
| H2 | Syne | 700 | 36px / 2.25rem | -0.01em |
| H3 | Syne | 700 | 24px / 1.5rem | 0 |
| Body | DM Sans | 400 | 16px / 1rem | 0 |
| Body Small | DM Sans | 400 | 14px / 0.875rem | 0 |
| Caption | DM Sans | 300 | 12px / 0.75rem | 0.02em |
| Label | Space Mono | 400 | 11px / 0.688rem | 0.08em |
| Wallet Address | Space Mono | 400 | 14px / 0.875rem | 0.02em |

---

## Logo Specifications

### Full Logo (Icon + Text)

The ant icon sits to the left of "ZIKORA" text. Minimum spacing between icon and text is equal to the width of the ant's head circle.

### Ant Icon Construction

```
Antennae: 2 lines from head, angled 25° outward, stroke-width 3, round cap
Head:     Circle, radius 12px (smallest)
Thorax:   Circle, radius 10px (medium), gap 2px from head
Abdomen:  Circle, radius 16px (largest), gap 2px from thorax
```

### Minimum Sizes

- Full logo: minimum width 160px
- Icon only: minimum 24px
- Favicon: 16px, 32px, 48px

### Clear Space

Maintain padding equal to the abdomen radius around the logo on all sides.

---

## Component Patterns

### Buttons

```
Primary:    bg #FF6B2C, text #12121A, rounded-xl, font Syne 600
Secondary:  bg transparent, border #2A2A3A, text #F0EDE6, rounded-xl
Ghost:      bg transparent, text #FF6B2C, no border
Disabled:   bg #1A1A26, text #6B6880
```

### Cards

```
Background: #1A1A26
Border:     1px solid #2A2A3A
Radius:     16px (rounded-2xl)
Padding:    24px
Hover:      border-color #FF6B2C/30, translateY(-2px), shadow 0 8px 32px rgba(255,107,44,0.1)
```

### Input Fields

```
Background: #12121A
Border:     1px solid #2A2A3A
Radius:     12px (rounded-xl)
Text:       #F0EDE6
Placeholder:#6B6880
Focus:      border-color #FF6B2C, ring 2px rgba(255,107,44,0.2)
```

### Chat Bubbles

```
User:       bg #FF6B2C, text #12121A, rounded-2xl rounded-br-sm
Bot:        bg #1A1A26, border #2A2A3A, text #F0EDE6, rounded-2xl rounded-bl-sm
System:     bg transparent, text #6B6880, italic
```

---

## Spacing & Layout

```
Base unit:  4px
xs:         4px
sm:         8px
md:         16px
lg:         24px
xl:         32px
2xl:        48px
3xl:        64px

Max content width: 1200px
Chat panel width:  480px (desktop), 100% (mobile)
```

---

## Shadows & Effects

```css
/* Card shadow */
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);

/* Elevated shadow */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

/* Glow effect (hover, active states) */
box-shadow: 0 0 24px rgba(255, 107, 44, 0.15);

/* Text glow */
text-shadow: 0 0 20px rgba(255, 107, 44, 0.3);
```

---

## Animation

```css
/* Default transition */
transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Smooth entrance */
transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Bounce */
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Do's and Don'ts

**Do:**
- Use dark backgrounds exclusively for the main app
- Keep the ant icon orange on dark backgrounds
- Use Syne for headings and brand elements
- Use Space Mono for wallet addresses, hashes, and numeric data
- Maintain generous spacing between elements

**Don't:**
- Place the orange logo on light/white backgrounds without switching to dark text
- Stretch or rotate the ant icon
- Use colors outside the defined palette
- Mix more than 2 font families in one component
- Use rounded corners smaller than 8px
