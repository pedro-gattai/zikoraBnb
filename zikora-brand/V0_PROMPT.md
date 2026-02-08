# Zikora — v0 Design System Prompt

Paste this entire file as context when prompting v0.dev to build Zikora pages/components.

---

## Project Context

Zikora is a DeFi chatbot on BNB Chain. Users connect their wallet and execute crypto operations (swap, transfer, check portfolio, etc.) via chat commands. The name means "show the way" in Igbo (Nigeria) and the mascot is a geometric ant representing collective intelligence and tireless execution.

## Design System

### Colors (use exactly these)

```
Primary accent:     #FF6B2C  (Zikora Orange)
Primary accent hover: #FF8F5C
Background:         #12121A
Surface/Cards:      #1A1A26
Borders:            #2A2A3A
Text primary:       #F0EDE6
Text secondary:     #A8A4B8
Text muted:         #6B6880
Success:            #00E676
Error:              #FF5252
Warning/BNB:        #F0B90B
Info:               #00BCD4
```

### Fonts (import from Google Fonts)

```
Syne (800, 700, 600) — headings, logo, brand elements
DM Sans (300, 400, 500, 600) — body text, UI elements
Space Mono (400, 700) — wallet addresses, data, labels
```

### Logo

The Zikora logo is a geometric ant made of 3 stacked circles (small head, medium thorax, large abdomen) with 2 V-shaped antennae extending from the head. Color: #FF6B2C. The text "ZIKORA" uses Syne font-weight 800 with wide letter-spacing.

SVG for the ant icon:
```svg
<svg width="56" height="86" viewBox="0 0 56 86" fill="none">
  <line x1="22" y1="12" x2="17" y2="1" stroke="#FF6B2C" stroke-width="3" stroke-linecap="round"/>
  <line x1="34" y1="12" x2="39" y2="1" stroke="#FF6B2C" stroke-width="3" stroke-linecap="round"/>
  <circle cx="28" cy="20" r="11" fill="#FF6B2C"/>
  <circle cx="28" cy="42" r="9" fill="#FF6B2C"/>
  <circle cx="28" cy="68" r="15" fill="#FF6B2C"/>
</svg>
```

### Component Rules

**Buttons:**
- Primary: bg-[#FF6B2C] text-[#12121A] rounded-xl font-semibold, hover glow effect
- Secondary: border border-[#2A2A3A] text-[#F0EDE6] rounded-xl, hover border-orange/30
- Always use Syne font for buttons

**Cards:**
- bg-[#1A1A26] border border-[#2A2A3A] rounded-2xl p-6
- On hover: border becomes orange/30, subtle translateY(-2px), soft orange glow shadow

**Inputs:**
- bg-[#12121A] border border-[#2A2A3A] rounded-xl
- Focus: border-[#FF6B2C] with ring-2 ring-[#FF6B2C]/20

**Chat messages:**
- User messages: bg-[#FF6B2C] text-[#12121A] rounded-2xl rounded-br-sm, aligned right
- Bot messages: bg-[#1A1A26] border border-[#2A2A3A] text-[#F0EDE6] rounded-2xl rounded-bl-sm, aligned left
- System messages: text-[#6B6880] italic centered

**Navbar:**
- bg-[#1A1A26]/80 backdrop-blur-lg border-b border-[#2A2A3A]
- Logo on left, nav links center, "Connect Wallet" button on right
- Sticky top-0 z-50

**Wallet addresses:**
- Always use Space Mono font
- Truncate with ellipsis in the middle: 0x1234...5678
- bg-[#12121A] border border-[#2A2A3A] rounded-xl px-3 py-2

### Layout

- Max content width: 1200px
- Chat panel: max-w-[480px] on desktop, full width on mobile
- Dark background only — no light mode
- Generous spacing, use p-6 for cards minimum
- All corners rounded-xl or rounded-2xl minimum

### Animation

- Transitions: 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Chat messages: slide up with fade in
- Cards on hover: subtle lift + glow
- Buttons: scale(0.98) on active

### Aesthetic

- Dark, premium, Web3-native feel
- Clean and minimal, not cluttered
- Orange accents used sparingly for CTAs and highlights
- Lots of breathing room between elements
- No gradients on backgrounds — flat dark colors
- Subtle glow effects on interactive elements
