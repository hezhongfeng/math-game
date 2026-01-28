# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a mobile-first children's math game built with Vue 3, Tailwind CSS, and Vite. It teaches addition and subtraction through 15 progressive difficulty levels (1-3 through 1-100 number ranges) with rich feedback via animations, sound effects, and haptic vibrations.

**Key Tech Stack:**
- Vue 3 (Composition API with `<script setup>`)
- Vite 7 (modern bundler)
- Tailwind CSS 3 (atomic CSS with custom Peppa Pig theme)
- Vue Router 4 (3 routes: Home, DifficultySelect, Game)
- Pinia 3 (minimal state management for settings)
- Lucide Vue Next (icons)

## Build & Development Commands

### Development
```bash
npm run dev
# Starts development server on http://localhost:5173
# Vite watches for file changes with HMR
```

### Production Build
```bash
npm run build
# Outputs compiled assets to ./dist/
# Build artifacts: index.html + assets/index-[hash].{js,css}
# Typical sizes: JS ~145KB (gzip: 53KB), CSS ~54KB (gzip: 10KB)
```

### Preview Build Output
```bash
npm run preview
# Serves the built version locally to verify production build
```

## Project Architecture

### High-Level Data Flow

```
User Input (NumberPad)
    ↓
Game Composable (useGame.js)
    ↓
Question Generator (generator.js)
    ↓
Answer Validation + Score Calculation
    ↓
Persist Results (useStorage.js) → LocalStorage
    ↓
UI Feedback: Sound (useSound.js) + Animations + Haptics
```

### Directory Structure & Responsibilities

**Core Application Files:**
- `src/main.js` - Vue app initialization, Pinia store registration
- `src/App.vue` - Root component
- `src/router.js` - Vue Router with 3 routes
- `src/style.css` - Global base styles, keyframe animations

**Routes (src/pages/):**
- `Home.vue` - Title screen with "Start Game" button
- `DifficultySelect.vue` - Grid of 15 difficulty levels, organized by 5 difficulty groups
- `Game.vue` - Main game component with question display, answer submission, and feedback logic

**Components (src/components/) - Reusable UI building blocks:**
- `QuestionCard.vue` - Displays math question (e.g., "2 + 3 = ?")
- `NumberPad.vue` - 3×4 grid of digit buttons (0-9) + delete + confirm buttons
- `ScoreBoard.vue` - Real-time score display during gameplay
- `ParticleEffects.vue` - Canvas-based particle explosion animation for feedback
- `ResultModal.vue` - Post-game stats modal (accuracy, time, best score)
- `DifficultyCard.vue` - Clickable difficulty card with lock state and best score
- `Toast.vue` + `ToastContainer.vue` - Toast notification system
- `SettingsPanel.vue` - Audio settings toggles

**Composables (src/composables/) - Vue 3 composition functions with business logic:**
- `useGame.js` - Game state (questions, currentIndex, score), lifecycle (startGame, submitAnswer, nextQuestion, resetGame)
- `useSound.js` - Web Audio API sound synthesis for: correct/wrong/win/click sounds, uses AudioContext utility
- `useSpeech.js` - Web Speech API text-to-speech for question and feedback announcements
- `useStorage.js` - LocalStorage persistence for best scores and difficulty completion status
- `useToast.js` - Toast notification queue management

**Utilities & Config:**
- `utils/generator.js` - Pure functions to generate questions and validate answers
- `utils/audioContext.js` - Shared AudioContext initialization and lifecycle (getAudioContext, ensureAudioContextRunning, closeAudioContext)
- `config/difficulty.js` - 15 difficulty level definitions + grouping for UI
- `config/constants.js` - Game constants, audio frequencies/parameters, speech messages, operator text

**State Management (src/stores/):**
- `settings.js` - Pinia store for UI settings: soundEnabled, speechEnabled (persisted to localStorage)

### Audio Architecture

The project uses Web Audio API for all sound effects with no external audio files:

**AudioContext Management:**
- Centralized in `utils/audioContext.js`
- Single shared AudioContext instance managed globally
- `getAudioContext()` creates/returns the context
- `ensureAudioContextRunning()` handles browser autoplay restrictions (some browsers suspend AudioContext until user interaction)
- `closeAudioContext()` cleans up on unmount

**Sound Synthesis:**
- `useSound.js` generates 4 types of sounds via oscillators:
  - `correct`: Three ascending notes (C5→E5→G5, G5→B5, C6)
  - `wrong`: Sawtooth wave sweep from 200Hz to 100Hz
  - `win`: C5-E5-G5-C6 arpeggio
  - `click`: 800Hz sine wave burst
- All frequencies/parameters configurable in `config/constants.js` (AUDIO_FREQUENCIES, AUDIO_PARAMS)

### State Flow & Persistence

**Game State (Runtime, not persisted):**
- Managed by `useGame.js` composable
- Questions array, currentIndex, score, submitted answers
- Reset on each game start

**User Data (Persisted):**
- Best scores per difficulty: `localStorage['math-game-data']` → `{bestScores: {[id]: {score, accuracy, duration, ...}}}`
- Settings: `localStorage['math-game-settings']` → `{soundEnabled, speechEnabled}`
- Loaded/saved via `useStorage.js` and `settings.js` store

**Difficulty Completion Logic:**
- Tracked by presence of entry in bestScores
- Used to determine lock state (must complete difficulty N-1 to unlock N)
- Level 1 is always unlocked

## Code Organization Principles

### Composition Over Duplication
- Common logic extracted to `utils/` (audioContext.js, audioSynthesis.js, generator.js)
- Composables handle data + lifecycle, components handle UI only
- No console statements in production code (errors handled gracefully with toast notifications)

### Configuration-Driven
- All magic numbers in `config/constants.js`: game delays, audio frequencies, sound parameters, speech messages
- Difficulty levels defined declaratively in `config/difficulty.js` (15 entries)
- Easy to tune gameplay feel without touching logic

### Mobile-First Responsive Design
- Base styles target mobile (320px+)
- `md:` prefix for tablet/desktop (768px+)
- Touch targets ≥64×64px minimum
- Safe area insets (env(safe-area-inset-*)) for notched devices
- Tailwind custom extensions: `rounded-cute-*`, `shadow-cute-*`, custom animations (float, pulse-gentle, fade-in-up)

### Component Responsibilities
- **Pages**: Route-specific layout, route params → child props
- **Components**: Pure UI rendering, event emission, no business logic
- **Composables**: Business logic, state management, side effects
- **Utils**: Pure functions, no Vue dependencies

## Important Files to Know

**When modifying game difficulty/balance:**
- `src/config/difficulty.js` - Difficulty definitions, level progression
- `src/config/constants.js` - GAME_CONFIG (feedback delay, answer length)
- `src/utils/generator.js` - Question generation algorithm, answer checking

**When adding/modifying sounds:**
- `src/config/constants.js` - AUDIO_FREQUENCIES, AUDIO_PARAMS (all tuning parameters)
- `src/composables/useSound.js` - Sound synthesis implementation
- `src/utils/audioSynthesis.js` - Background music generation
- `src/utils/audioContext.js` - AudioContext lifecycle

**When changing UI:**
- `tailwind.config.js` - Custom Peppa Pig theme colors, border radius, shadows, animations
- `src/style.css` - Global base styles, CSS animations (keyframes)
- Component files use atomic Tailwind classes + scoped styles for complex animations

**When persisting new data:**
- `src/composables/useStorage.js` - Add new getter/setter functions
- `src/stores/settings.js` - For settings, use Pinia store
- Key: always provide error handling and sensible defaults

## Testing & Verification

The project currently has no unit tests. Manual verification approach:

**Game Logic Verification:**
1. Start dev server: `npm run dev`
2. Test each difficulty level: verify question counts, number ranges, operation types
3. Verify score calculation: 10 points per correct answer
4. Verify difficulty progression: each level requires previous level completion
5. Check localStorage persistence: complete a level, reload page, verify best score saved

**UI/Mobile Testing:**
1. Chrome DevTools: Responsive Design Mode for various device sizes
2. Actual device testing: iOS Safari + Android Chrome
3. Test rotations: portrait ↔ landscape
4. Verify touch target sizes: all buttons ≥64px minimum
5. Test safe areas: notched devices (iPhone 12+, Android devices with notches)

**Audio Testing:**
1. Verify sound effects play on user interaction (some browsers block autoplay)
2. Test background music play/pause
3. Verify audio settings persist across page reloads
4. Test volume slider responsiveness

**Performance Baseline:**
- Build size: JS ~145KB (gzip: 53KB), CSS ~54KB (gzip: 10KB)
- Expected build time: 1-2 seconds
- Dev server startup: < 1 second

## Responsive Design & Mobile Optimization

**Breakpoints & Tailwind Usage:**
- **Mobile (default)**: base classes, no prefix
- **Tablet/Desktop (768px+)**: `md:` prefix for layout adjustments
- **Large Desktop (1024px+)**: `lg:` prefix (minimal use in this project)

**Key Mobile Considerations:**
- **Touch Targets**: Buttons ≥64×64px (WCAG 44px minimum + buffer)
- **Safe Areas**: Use `max()` with `env(safe-area-inset-*)` for notched devices
- **iOS Optimizations**: `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`
- **Scroll**: `-webkit-overflow-scrolling: touch` for inertial scrolling
- **Viewport**: `maximum-scale=1.0, user-scalable=no` to prevent accidental zoom during gameplay

## Documentation Requirements

**Git Hook Check:**
- Pre-commit hook checks for code changes without documentation updates
- If code changes detected, warns which docs might need updates: README.md, DESIGN.md, AGENTS.md, CHANGELOG.md
- Skip with: `git commit --no-verify`

**When to Update Docs:**
- **README.md**: Public-facing features, usage instructions, tech stack
- **DESIGN.md**: UI/UX details, responsive design specs, component layouts
- **CHANGELOG.md**: All notable code changes (features, fixes, refactors)
- **CLAUDE.md**: Architecture changes, new project dependencies, tooling changes

## Common Development Tasks

### Adding a New Sound Effect
1. Define frequency sequence in `config/constants.js` (AUDIO_FREQUENCIES)
2. Define parameters in `config/constants.js` (AUDIO_PARAMS)
3. Add handler in `useSound.js` playSound switch statement
4. Implement synthesis function using Web Audio API oscillators
5. Call `playSound('type')` from component

### Adjusting Game Difficulty
1. Modify `config/difficulty.js`: range, operation type, questionCount
2. Verify progression logic: each level should build on previous
3. Test in Game.vue to ensure questions generate correctly
4. Update documentation if adding/removing levels

### Adding Game Settings
1. Add ref to `settings.js` Pinia store
2. Add load/save in store functions (loadSettings, saveSettings)
3. Add UI toggle in `SettingsPanel.vue`
4. Consume in relevant composables (useSound, useSpeech, etc.)

### Debugging Audio Issues
1. Open browser DevTools → Console
2. Check if AudioContext exists: `window.AudioContext || window.webkitAudioContext`
3. Verify AudioContext state: `context.state` (should be 'running' or 'suspended')
4. On iOS Safari: audio must be triggered by user interaction first
5. For background music: ensure createBackgroundMusicBuffer() completes before play()

## Architecture Decisions & Rationale

**Why Composables for Game Logic?**
- Game state (questions, score, currentIndex) needs reactivity
- useGame lifecycle methods (startGame, nextQuestion, resetGame) organize game flow
- Easy to test if separated from UI components

**Why Web Audio API for Sounds?**
- No external audio files needed → smaller bundle
- Frequencies/parameters easily configurable
- Dynamic generation allows variation without assets

**Why Pinia for Settings Only?**
- Game state (questions, answers) is ephemeral, resets on new game
- Only settings persist, and Pinia provides simple reactive persistence
- Lightweight: 1 store file with 6 reactive refs

**Why Tailwind CSS?**
- Atomic classes enable rapid responsive design
- Custom theme (Peppa Pig colors, border radius, shadows) defined in config
- Hot reload in dev mode
- Small build size with PurgeCSS

**Why No Component Library?**
- Deliberate simplicity and customization for children's game
- All components built from semantic HTML + Tailwind
- Full control over touch targets, colors, animations

## Deployment Notes

- Built output is static (no server needed)
- Can be deployed to: Vercel, Netlify, GitHub Pages, or any static host
- No environment variables required
- LocalStorage-based persistence (works offline after first load)
- PWA-ready: manifest.json not included, but `apple-mobile-web-app-capable` meta tag present

## Known Limitations & Future Improvements

**Current Limitations:**
- No TypeScript (all `.js` and `.vue` files)
- No unit tests
- Background music synthesis CPU-intensive on low-end devices
- Vibration API has limited iOS support
- Speech API quality varies by browser/OS

**Suggested Future Enhancements:**
1. Add multiplication/division operations
2. TypeScript migration for type safety
3. Unit tests for useGame, generator.js, useStorage
4. Internationalization (multiple languages)
5. Achievement/reward system
6. Leaderboard (local or cloud-based)
7. Offline PWA manifest
