# AGENTS.md

> **⚠️ CRITICAL: This project follows MINIMALIST DESIGN PRINCIPLES.**
> All UI/UX changes must be simple, functional, and purposeful.
> Minimalist design is not optional - it's the core design philosophy.

This guide helps agentic coding agents work effectively in this math-game repository.

## 🎯 Core Design Principles

### 1. Minimalist First
- **Avoid over-decoration**: No unnecessary visual elements
- **Function-driven**: Every animation, color, shape must have a clear purpose
- **Restrained effects**: Use glow, shadow, gradients sparingly
- **High contrast**: Ensure content readability is never compromised

**What NOT to do:**
- ❌ Complex 3D effects
- ❌ Redundant decorative animations
- ❌ Excessive gradients and textures
- ❌ Complex storylines and characters

**What to do:**
- ✅ Flat design + subtle glow effects
- ✅ Functional animations with clear purpose
- ✅ Simple solid colors + light glow
- ✅ Clear information hierarchy

### 2. Tech & Cool (Boy-Friendly)
- **Color scheme**: Blue/Green tones (cool colors)
- **Effects**: Neon glow, energy pulse - but minimal
- **Theme**: Adventure, challenge, hero narrative
- **Keep it simple**: Cool but not cluttered

## Build & Run Commands

```bash
# Start development server
npm run dev
# or: pnpm dev, yarn dev

# Build for production
npm run build
# or: pnpm build, yarn build

# Preview production build
npm run preview
# or: pnpm preview, yarn preview
```

**Playwright E2E smoke tests are configured in this project.**

## Git 提交约定

- 提交信息尽量使用中文
- 可保留必要的英文代码标识、模块名和命令名
- 推荐使用 Conventional Commits 风格
- 推荐格式：`type(scope): 中文说明`
- 示例：`feat(ui): 应用统一字体样式与动画效果`

---

## Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 3.x with custom theme
- **Routing**: Vue Router 4.x
- **Icons**: Lucide Vue Next
- **Data Persistence**: LocalStorage (manual)
- **Language**: JavaScript (NO TypeScript)

---

## Code Style Guidelines

### Vue Components

**Always use `<script setup>` syntax:**
```vue
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { IconName } from 'lucide-vue-next'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['input', 'delete', 'submit'])
</script>
```

**Props:**
- Always define prop types explicitly
- Provide default values where applicable

**Emits:**
- Always use defineEmits with array of event names
- Emit simple values (strings, numbers, booleans)

### Imports

**Order:**
1. Vue imports
2. Vue Router imports
3. External libraries (lucide-vue-next)
4. Internal composables (`../composables/*`)
5. Internal config (`../config/*`)
6. Internal utils (`../utils/*`)

**Style:**
```javascript
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Play } from 'lucide-vue-next'
import { useGame } from '../composables/useGame'
import { DIFFICULTY_LEVELS } from '../config/difficulty'
import { generateQuestions } from '../utils/generator'
```

### Composables

**Naming:** Always use `use` prefix
```javascript
export function useGame(difficulty) {
  // State
  const questions = ref([])
  const currentIndex = ref(0)

  // Computed
  const progress = computed(() => ...)

  // Methods
  function startGame() { ... }
  function submitAnswer(answer) { ... }

  return {
    questions,
    currentIndex,
    progress,
    startGame,
    submitAnswer
  }
}
```

**Return:** Explicit object with all exported values

### Naming Conventions

- **Components**: PascalCase (e.g., `NumberPad.vue`, `DifficultyCard.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useGame`, `useSound`)
- **Utilities**: camelCase (e.g., `generateQuestions`, `checkAnswer`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DIFFICULTY_LEVELS`, `STORAGE_KEY`)
- **Variables**: camelCase
- **Functions**: camelCase
- **Vue 文件**: PascalCase for pages/components (e.g., `Home.vue`, `DifficultyCard.vue`)

### Styling

**Use Tailwind utility classes extensively:**

**Custom theme colors (简约科技风格 - from tailwind.config.js):**
- `hero-blue`, `hero-green`, `energy-yellow`, `warning-orange`
- Each has light/dark variants: `hero-blue-light`, `hero-blue-dark`

**Custom border radius:**
- `rounded-cute` (16px)
- `rounded-cute-lg` (24px)
- `rounded-cute-xl` (32px)
- `rounded-cute-2xl` (40px)
- `rounded-pill` (9999px)

**Custom shadows:**
- `shadow-cute` (subtle)
- `shadow-cute-lg` (medium)
- `shadow-cute-xl` (large)
- `shadow-card` (cards)
- `shadow-card-hover` (hover state)

**Custom animations:**
- `animate-float` (gentle floating)
- `animate-pulse-gentle` (subtle pulse)
- `animate-fade-in-up` (entry animation)
- `animate-card-entrance` (card entry)
- `animate-button-entrance` (button entry)
- `animate-title-glow` (glowing title)

**Gradients:** Use sparingly for buttons, prefer simple solid colors with subtle glow
```vue
class="bg-hero-blue hover:shadow-glow-blue"
```

**Minimal Glow Effects:**
```vue
class="shadow-glow-blue"    <!-- Subtle blue glow -->
class="shadow-glow-green"   <!-- Subtle green glow -->
class="shadow-glow-yellow"  <!-- Subtle yellow glow -->
```

**Responsive:** Mobile-first, use `md:` prefix for tablet/desktop
```vue
class="text-xl md:text-2xl p-4 md:p-6"
```

### Error Handling

**LocalStorage operations:**
```javascript
try {
  const data = localStorage.getItem('math-game-data')
  return data ? JSON.parse(data) : defaultValue
} catch (error) {
  console.error('Error message:', error)
  // Optional: show user toast notification
  return defaultValue
}
```

**Never use empty catch blocks.** Always at minimum use `console.error()`.

### JSDoc Comments

**Add JSDoc for functions (especially in utils/composables):**
```javascript
/**
 * Generates a random integer within a range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
```

### Configuration Files

**Difficulty configuration (src/config/difficulty.js):**
- Contains `DIFFICULTY_LEVELS` array with all 20 levels
- Each level has: `id`, `name`, `level`, `range`, `operation`, `stage`, `questionCount`, `description`, `helperText`, `color`, `textColor`, `stars`
- Contains `DIFFICULTY_GROUPS` for grouping by level category

**Constants (src/config/constants.js):**
- Game constants, storage keys, audio cooldowns, frequencies and parameters for sound effects

### Component Structure

**Standard layout:**
```vue
<script setup>
// 1. Imports
// 2. Props definition
// 3. Emits definition
// 4. Router/stores/composables
// 5. State (ref/reactive)
// 6. Computed
// 7. Methods
</script>

<template>
  // Component markup
</template>

<style scoped>
// Component-specific styles (minimal, prefer Tailwind)
</style>
```

### Accessibility

- Use semantic HTML elements
- Add ARIA labels where appropriate
- Ensure color contrast (using peppa theme colors)
- Touch-friendly button sizes (minimum 44x44px, recommended 64x64px)

### Mobile-First Requirements

**All interactive elements MUST have:**
```css
-webkit-tap-highlight-color: transparent;
touch-action: manipulation;
```

**Touch target sizes:**
| Element | Minimum Size | Example |
|---------|--------------|---------|
| NumberPad buttons | 64×64px | `min-h-[64px] min-w-[64px]` |
| Action buttons | 48px height | `py-4` or `h-12` |
| Cards | 88px height | `min-height: 88px` |

**Viewport config (index.html):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

**Safe area support (for notched devices):**
```css
padding-bottom: max(24px, env(safe-area-inset-bottom));
padding-top: max(10px, env(safe-area-inset-top));
```

**See [DESIGN.md](./DESIGN.md) for complete mobile specifications.**

### Storage Keys

**LocalStorage keys:**
- `math-game-data` - Game progress, best scores, and per-level top-10 speed leaderboards

---

## Important Notes

1. **No TypeScript** - This is a pure JavaScript project
2. **E2E tests only** - Playwright 冒烟测试已配置，当前没有单元测试框架
3. **Child-friendly design** - Use rounded corners, bright colors, fun animations
4. **Mobile-first** - Design for touch screens first, then enhance for desktop
5. **Progressive difficulty** - 20 levels, must complete previous to unlock next
6. **Non-negative results** - Subtraction always ensures result ≥ 0
7. **Mobile specifications** - See [DESIGN.md](./DESIGN.md) for detailed mobile-first design guidelines

---

## File Organization

```
src/
├── components/      # Reusable Vue components
├── composables/     # Vue Composition API functions (use*)
├── config/          # Configuration (difficulty.js, constants.js)
├── pages/           # Route components (Home, DifficultySelect, Game)
├── utils/           # Pure utility functions
├── App.vue          # Root component
├── main.js          # App entry point
├── router.js        # Vue Router configuration
└── style.css        # Global styles + Tailwind directives
```

---

## When Adding New Features

1. **New difficulty level**: Add to `src/config/difficulty.js`
2. **New page component**: Add to `src/pages/`, register in `src/router.js`
3. **New reusable logic**: Create composable in `src/composables/`
4. **New utility function**: Add to `src/utils/`
5. **New component**: Add to `src/components/` with proper props/emits

Always follow existing patterns and conventions when extending the codebase.
