# AGENTS.md

This guide helps agentic coding agents work effectively in this math-game repository.

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

**No tests are configured in this project.**

---

## Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 3.x with custom theme
- **State Management**: Pinia 3.x (setup function style)
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
5. Internal stores (`../stores/*`)
6. Internal config (`../config/*`)
7. Internal utils (`../utils/*`)

**Style:**
```javascript
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Play } from 'lucide-vue-next'
import { useGame } from '../composables/useGame'
import { useSettingsStore } from '../stores/settings'
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

### Pinia Stores

**Use setup function style:**
```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const soundEnabled = ref(true)

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  return {
    soundEnabled,
    toggleSound
  }
})
```

### Naming Conventions

- **Components**: PascalCase (e.g., `NumberPad.vue`, `DifficultyCard.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useGame`, `useSound`)
- **Stores**: camelCase with `use` prefix + `Store` suffix (e.g., `useSettingsStore`)
- **Utilities**: camelCase (e.g., `generateQuestions`, `checkAnswer`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DIFFICULTY_LEVELS`, `STORAGE_KEY`)
- **Variables**: camelCase
- **Functions**: camelCase
- **Files**: kebab-case for pages/components (e.g., `home-page.vue`)

### Styling

**Use Tailwind utility classes extensively:**

**Custom theme colors (from tailwind.config.js):**
- `peppa-blue`, `peppa-cyan`, `peppa-green`, `peppa-yellow`, `peppa-orange`, `peppa-purple`, `peppa-red`
- Each has light/dark variants: `peppa-blue-light`, `peppa-blue-dark`

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

**Gradients:** Use extensively for buttons and backgrounds
```vue
class="bg-gradient-to-br from-peppa-blue to-peppa-blue-dark"
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
- Contains `DIFFICULTY_LEVELS` array with all 15 levels
- Each level has: `id`, `name`, `level`, `range`, `operation`, `questionCount`, `description`, `color`, `textColor`, `stars`
- Contains `DIFFICULTY_GROUPS` for grouping by level category

**Constants (src/config/constants.js):**
- Game constants, storage keys, etc.

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
- Touch-friendly button sizes (minimum 44x44px)

### Storage Keys

**LocalStorage keys:**
- `math-game-data` - Game progress and best scores
- `math-game-settings` - User settings (sound, speech, music)

---

## Important Notes

1. **No TypeScript** - This is a pure JavaScript project
2. **No tests** - No test framework configured
3. **Child-friendly design** - Use rounded corners, bright colors, fun animations
4. **Mobile-first** - Design for touch screens first, then enhance for desktop
5. **Progressive difficulty** - 15 levels, must complete previous to unlock next
6. **Non-negative results** - Subtraction always ensures result ≥ 0

---

## File Organization

```
src/
├── components/      # Reusable Vue components
├── composables/     # Vue Composition API functions (use*)
├── config/          # Configuration (difficulty.js, constants.js)
├── pages/           # Route components (Home, DifficultySelect, Game)
├── stores/          # Pinia stores
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
4. **New global state**: Add to `src/stores/` using Pinia setup function style
5. **New utility function**: Add to `src/utils/`
6. **New component**: Add to `src/components/` with proper props/emits

Always follow existing patterns and conventions when extending the codebase.
