# Design System Master File

> **设计参考归档**：这是生成式设计参考，不是当前 UI 的事实来源。实现规范以根目录 `DESIGN.md` 和 CSS 变量为准。

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Math Game
**Generated:** 2026-01-30 14:30:09
**Category:** Gaming

---

## Global Rules

### Color Palette (Mobile-First Kids Theme)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | `#FF5757` | `--color-primary` | Main buttons, brand elements (Warm Coral) |
| Secondary | `#00D9C0` | `--color-secondary` | Secondary actions, success (Fresh Mint) |
| CTA/Accent | `#FFC107` | `--color-cta` | Rewards, highlights (Sunshine Yellow) |
| Background | `#FFFBF7` | `--color-background` | Page background (Cream White) |
| Text | `#1A1A2E` | `--color-text` | Primary text (Deep Navy - high contrast) |
| Success | `#4ADE80` | `--color-success` | Correct answers, positive feedback |
| Warning | `#FB923C` | `--color-warning` | Warning messages |
| Error | `#F87171` | `--color-error` | Incorrect answers |

### Typography

- **Heading Font:** Baloo 2
- **Body Font:** Comic Neue
- **Mood:** kids, education, playful, friendly, colorful, learning
- **Google Fonts:** [Baloo 2 + Comic Neue](https://fonts.google.com/share?selection.family=Baloo+2:wght@400;500;600;700|Comic+Neue:wght@300;400;700)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Comic+Neue:wght@300;400;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons (Mobile-Optimized, 64px+ Touch Targets)

```css
/* Primary Button - Warm Coral */
.btn-primary {
  background: linear-gradient(to bottom, #FF5757, #E63E3E);
  color: white;
  padding: 16px 32px;
  min-height: 64px;
  min-width: 64px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 18px;
  transition: all 200ms ease;
  cursor: pointer;
  box-shadow: 0 4px 0 0 #B32525, 0 6px 12px rgba(255, 87, 87, 0.3);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn-primary:active {
  transform: translateY(2px) scale(0.98);
  box-shadow: 0 2px 0 0 #B32525, 0 3px 6px rgba(255, 87, 87, 0.3);
}

/* Secondary Button - Fresh Mint */
.btn-secondary {
  background: linear-gradient(to bottom, #00D9C0, #00B8A3);
  color: white;
  padding: 16px 32px;
  min-height: 64px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 18px;
  transition: all 200ms ease;
  cursor: pointer;
  box-shadow: 0 4px 0 0 #008575, 0 6px 12px rgba(0, 217, 192, 0.3);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn-secondary:active {
  transform: translateY(2px) scale(0.98);
  box-shadow: 0 2px 0 0 #008575, 0 3px 6px rgba(0, 217, 192, 0.3);
}

/* Accent Button - Sunshine Yellow */
.btn-accent {
  background: linear-gradient(to bottom, #FFC107, #FFAB00);
  color: white;
  padding: 16px 32px;
  min-height: 64px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 18px;
  transition: all 200ms ease;
  cursor: pointer;
  box-shadow: 0 4px 0 0 #CC7A00, 0 6px 12px rgba(255, 193, 7, 0.3);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn-accent:active {
  transform: translateY(2px) scale(0.98);
  box-shadow: 0 2px 0 0 #CC7A00, 0 3px 6px rgba(255, 193, 7, 0.3);
}
```

### Cards (Mobile-Optimized)

```css
.card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(255, 87, 87, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: all 200ms ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(255, 87, 87, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-success {
  background: linear-gradient(to bottom right, #FFFFFF, #F0FDF4);
  border-color: rgba(74, 222, 128, 0.3);
}
```

### Inputs (Child-Friendly)

```css
.input {
  padding: 16px 20px;
  border: 2px solid #E2E8F0;
  border-radius: 16px;
  font-size: 18px;
  min-height: 56px;
  transition: all 200ms ease;
  background: white;
}

.input:focus {
  border-color: #FF5757;
  outline: none;
  box-shadow: 0 0 0 4px rgba(255, 87, 87, 0.2);
}

.input::placeholder {
  color: #A0AEC0;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Warm, Playful, Child-Friendly

**Keywords:** Coral, Mint, Sunshine, Kids, Education, Colorful, Touch-friendly, High-contrast

**Best For:** Children's educational apps, mobile games for young kids, touch-friendly interfaces

**Key Effects:** Soft shadows, rounded corners (16px+), warm gradients, gentle animations, tactile feedback

### Mobile-First Requirements

| Element | Minimum Size | Recommended | Touch Spacing |
|---------|-------------|-------------|---------------|
| Buttons | 44×44px | 64×64px | 12px |
| Number Pad | 44×44px | 72×72px | 12px |
| Cards | 88px height | 100px height | 16px |
| Text | 16px | 18-20px | - |

### Touch Optimization CSS

```css
/* Eliminate 300ms tap delay */
* {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Prevent pull-to-refresh */
.game-container {
  overscroll-behavior: contain;
}

/* Disable text selection on game elements */
.no-select {
  user-select: none;
  -webkit-user-select: none;
}

/* Haptic feedback for important actions */
@media (hover: none) and (pointer: coarse) {
  .btn-primary:active,
  .btn-secondary:active {
    /* Triggers haptic on mobile devices that support it */
  }
}
```

### Page Pattern

**Pattern Name:** Mobile Game Interface

- **Screen Layout:** Single-column, bottom-aligned controls for thumb reach
- **Touch Targets:** All interactive elements 64px+ for children
- **Navigation:** Simple, max 2 levels deep
- **Feedback:** Immediate visual + haptic feedback on touch
- **Safe Areas:** Respect device notches and home indicators

---

## Anti-Patterns (Do NOT Use)

- ❌ Minimalist design for kids apps
- ❌ Static assets without interaction
- ❌ Tiny touch targets (< 44px)
- ❌ Closely packed buttons (< 8px gap)

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio (especially important for outdoor use)
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y
- ❌ **Reliance on hover** — Mobile has no hover, use active/tap states
- ❌ **Small font sizes** — Never use < 18px for primary content
- ❌ **Complex gestures** — Avoid swipe, pinch for main interactions

---

## Pre-Delivery Checklist (Mobile-First)

Before delivering any UI code, verify:

### Visual Quality
- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] Warm coral (#FF5757) used for primary actions
- [ ] Fresh mint (#00D9C0) used for success/secondary
- [ ] Sunshine yellow (#FFC107) used for rewards/highlights
- [ ] Cream white (#FFFBF7) used for backgrounds

### Touch & Mobile
- [ ] All touch targets minimum 64×64px (for children)
- [ ] Minimum 12px spacing between touch targets
- [ ] `touch-action: manipulation` on interactive elements
- [ ] `-webkit-tap-highlight-color: transparent` applied
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states don't cause layout shift
- [ ] Active states provide clear feedback

### Typography & Readability
- [ ] Light mode text contrast 4.5:1 minimum
- [ ] Text size minimum 18px for body, 20px+ recommended
- [ ] Font family: Baloo 2 for headings, Comic Neue for body
- [ ] Test readability in outdoor sunlight

### Responsiveness
- [ ] Responsive: 375px (small phone), 428px (large phone), 768px (tablet)
- [ ] No horizontal scroll on mobile
- [ ] Safe area insets respected (notch, home indicator)
- [ ] No content hidden behind fixed elements

### Accessibility
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] `prefers-contrast: high` supported
- [ ] Color is not the only indicator of state

### Performance
- [ ] No layout shifts on page load
- [ ] Animations are smooth (60fps)
- [ ] Bundle size minimized for mobile networks
