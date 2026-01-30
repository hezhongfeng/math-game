# Math Game - Master Design System

## Design Philosophy
**Modern, Tech-Inspired, Energetic, Perfect for Young Boys (3-6 years)**

This design system prioritizes modern, tech-inspired colors with energetic accents that create an engaging learning environment for young boys while maintaining clarity and approachability.

---

## Color Palette

### Primary Colors
| Role | Hex | Tailwind | Usage |
|------|-----|---------|-------|
| **Primary** | `#4F46E5` | `game-primary` | Main buttons, headers, primary actions |
| **Primary Light** | `#6366F1` | `game-primary-light` | Secondary accents, highlights |
| **Primary Dark** | `#3730A3` | `game-primary-dark` | Hover states, active states |
| **Primary BG** | `#EEF2FF` | `game-bg` | Page backgrounds, subtle accents |

### Accent Colors
| Role | Hex | Tailwind | Usage |
|------|-----|---------|-------|
| **Accent** | `#F97316` | `game-accent` | Call-to-action buttons, key interactions |
| **Accent Light** | `#FB923C` | `game-accent-light` | Accent highlights, stars |
| **Accent Dark** | `#EA580C` | `game-accent-dark` | Accent hover states |

### Semantic Colors
| Role | Hex | Tailwind | Usage |
|------|-----|---------|-------|
| **Success** | `#22C55E` | `game-success` | Correct answers, positive feedback |
| **Success Light** | `#4ADE80` | `game-success-light` | Success backgrounds |
| **Warning** | `#EAB308` | `game-warning` | Warning messages |
| **Warning Light** | `#FACC15` | `game-warning-light` | Warning backgrounds |
| **Error** | `#EF4444` | `game-error` | Incorrect answers, negative feedback |
| **Error Light** | `#F87171` | `game-error-light` | Error backgrounds |

### Neutral Colors
| Role | Hex | Tailwind | Usage |
|------|-----|---------|-------|
| **Text Primary** | `#1E293B` | `game-text` | Headings, primary text |
| **Text Secondary** | `#64748B` | `game-text-secondary` | Body text, descriptions |
| **Text Muted** | `#94A3B8` | `game-text-muted` | Disabled text, labels |
| **Background** | `#F1F5F9` | `game-bg` | Main page background |
| **Card** | `#FFFFFF` | `game-card` | Card backgrounds |
| **Border** | `#E2E8F0` | `game-border` | Borders, dividers |

---

## Typography

### Font Family
- **Headings**: Fredoka (Google Fonts)
- **Body**: Nunito (Google Fonts)

### Import
```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');
```

### Font Scale
| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-child-xs` | 14px | 1.6 | Labels, small text |
| `text-child-sm` | 16px | 1.6 | Secondary text |
| `text-child-base` | 18px | 1.6 | Body text (minimum for children) |
| `text-child-lg` | 22px | 1.5 | Subheadings |
| `text-child-xl` | 26px | 1.4 | Large text |
| `text-child-2xl` | 32px | 1.3 | Card titles |
| `text-child-3xl` | 40px | 1.2 | Page headings |
| `text-child-4xl` | 48px | 1.1 | Hero headings |

---

## Components

### Buttons
**Primary Button (Indigo)**
```html
<button class="
  bg-gradient-to-b from-game-primary to-game-primary-dark
  text-white font-bold rounded-cute-xl
  shadow-game-button hover:shadow-game-button-hover
  hover:-translate-y-0.5 active:shadow-game-button-active active:translate-y-0.5
  transition-all duration-200
">
  Button Text
</button>
```

**CTA Button (Orange)**
```html
<button class="
  bg-gradient-to-b from-game-accent to-game-accent-dark
  text-white font-bold rounded-cute-xl
  shadow-game-button hover:shadow-game-button-hover
  hover:-translate-y-0.5 active:shadow-game-button-active active:translate-y-0.5
  transition-all duration-200
">
  CTA
</button>
```

**Secondary Button (White)**
```html
<button class="
  bg-white text-game-primary-dark font-bold rounded-cute-xl
  border-2 border-game-neutral-border
  shadow-game-button
  hover:bg-game-primary/5 hover:-translate-y-0.5
  active:translate-y-0.5
  transition-all duration-200
">
  Secondary
</button>
```

### Cards
**Standard Card**
```html
<div class="
  bg-white rounded-2xl shadow-game
  border-2 border-game-neutral-border
  hover:shadow-game-lg hover:-translate-y-1
  transition-all duration-300
">
  Card Content
</div>
```

**Success Card**
```html
<div class="
  bg-gradient-to-br from-white to-game-success/10
  border-2 border-game-success/30
  rounded-2xl shadow-game
">
  Success Content
</div>
```

### Inputs
**Text Input**
```html
<input class="
  bg-white rounded-2xl
  border-2 border-game-neutral-border
  px-4 py-3
  text-game-text placeholder:text-game-text-muted
  focus:outline-none focus:border-game-primary focus:ring-4 focus:ring-game-primary/20
  transition-all duration-200
">
```

---

## Spacing

### Touch-Friendly Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `touch-sm` | 8px | Minimum touch spacing |
| `touch-md` | 12px | Recommended touch spacing |
| `touch-lg` | 16px | Large touch spacing |
| `touch-xl` | 24px | Extra large touch spacing |

### Child-Friendly Component Sizes
| Token | Value | Usage |
|-------|-------|-------|
| `child-btn-sm` | 48px | Small buttons (minimum touch target) |
| `child-btn-md` | 64px | Standard buttons |
| `child-btn-lg` | 80px | Large buttons |
| `child-card` | 88px | Card minimum height |

---

## Shadows

### Game Shadow System
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-game` | `0 2px 8px rgba(79, 70, 229, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)` | Subtle elements |
| `shadow-game-lg` | `0 4px 16px rgba(79, 70, 229, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)` | Cards on hover |
| `shadow-game-xl` | `0 8px 32px rgba(79, 70, 229, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)` | Important cards |
| `shadow-game-button` | `0 3px 0 0 #312E81, 0 4px 12px rgba(79, 70, 229, 0.3)` | Default buttons |
| `shadow-game-button-hover` | `0 5px 0 0 #312E81, 0 8px 20px rgba(79, 70, 229, 0.4)` | Button hover |
| `shadow-game-button-active` | `0 1px 0 0 #312E81, 0 2px 8px rgba(79, 70, 229, 0.3)` | Button active |

### Glow Effects
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-game-glow` | `0 0 20px rgba(79, 70, 229, 0.5)` | Primary glow |
| `shadow-game-glow-success` | `0 0 20px rgba(34, 197, 94, 0.5)` | Success glow |
| `shadow-game-glow-accent` | `0 0 20px rgba(249, 115, 22, 0.5)` | Accent glow |

---

## Animations

### Entry Animations
- `animate-fade-in-up` - Elements appearing from below
- `animate-card-entrance` - Card entry with scale
- `animate-button-entrance` - Button entry with scale

### Interactive Animations
- `animate-wiggle` - Playful shake (60deg rotation)
- `animate-shake` - Horizontal shake (error feedback)
- `animate-pop` - Quick scale effect (0.3s)
- `animate-elastic` - Elastic bounce (0.6s)

### Background Animations
- `animate-float` - Gentle floating (4s infinite)
- `animate-pulse-gentle` - Subtle pulse (2.5s infinite)
- `animate-star-twinkle` - Star twinkle effect (2s infinite)

---

## Accessibility

### Contrast Requirements
- **Light mode**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Must meet 3:1 contrast ratio

### Touch Targets
- **Minimum size**: 44×44px (WCAG 2.1 Level AAA)
- **Recommended**: 64×64px for children

### Focus States
- All interactive elements must have visible focus states
- Focus ring: 4px offset, 30% opacity of primary color

### Reduced Motion
- Respect `prefers-reduced-motion` media query
- Provide reduced animation options in settings

---

## Anti-Patterns

### ❌ Avoid
- High saturation colors that cause visual fatigue
- High contrast combinations (e.g., pure black on pure white)
- Small touch targets (< 44px)
- Layout shifts on hover
- Animations that trigger motion sickness
- Emoji icons (use SVG instead)
- Empty focus states

### ✅ Do
- Use modern tech-inspired colors for main backgrounds
- Maintain 4.5:1 minimum contrast ratio
- Ensure all interactive elements have `cursor-pointer`
- Provide smooth transitions (150-300ms)
- Use consistent spacing and sizing
- Test on multiple screen sizes

---

## Responsive Breakpoints
- **Mobile**: 375px (minimum)
- **Tablet**: 768px
- **Desktop**: 1024px
- **Large Desktop**: 1440px

---

## Implementation Notes

1. **Color Usage**: Always use semantic color names (e.g., `game-primary`, `game-success`) not raw hex values
2. **Transitions**: Keep between 150-300ms for smooth but responsive feel
3. **Spacing**: Use touch-friendly spacing values for mobile-first approach
4. **Typography**: Never use font sizes smaller than `text-child-base` (18px) for primary content
5. **Borders**: Use `game-border` for clean, professional look

---

## Version
- **Version**: 3.0
- **Created**: 2026-01-30
- **Last Updated**: 2026-01-30
- **Status**: Active
- **Target Age**: 3-6 years old (Boys)
- **Theme**: Modern Tech, Indigo Primary, Orange Accent
