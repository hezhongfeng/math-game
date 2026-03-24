# CLAUDE.md

> **⚠️ CRITICAL: This project is designed for mobile browsers first.**
> All feature changes should be verified against the mobile experience before merge.

This file provides implementation context for agents working in this repository.

## Project Overview

This is a mobile-first children's math game built with Vue 3 and Vite. It teaches addition and subtraction through 15 progressive difficulty levels covering `0-3` through `0-100`, with visual feedback, Web Audio sound effects, and haptic vibration.

## Build & Verification

```bash
npm run dev
npm run build
npm run preview
pnpm run test:e2e
```

Notes:
- Playwright E2E smoke tests are configured
- There is currently no unit test framework

## Current Architecture

### Routes

- `src/pages/Home.vue` - Landing page and progress summary
- `src/pages/DifficultySelect.vue` - Difficulty selection and unlock flow
- `src/pages/Game.vue` - Main gameplay loop, answer feedback, round completion

### Components

- `src/components/QuestionCard.vue` - Current question display with answer-state badge
- `src/components/NumberPad.vue` - Touch keypad for numeric entry
- `src/components/ScoreBoard.vue` - Compact progress/status panel during gameplay
- `src/components/ResultModal.vue` - Two-step completion flow: summary first, mistake review second
- `src/components/DifficultyCard.vue` - Difficulty card with lock/completion/best-score state
- `src/components/PWAUpdatePrompt.vue` - In-app refresh prompt for updated service worker
- `src/components/Toast.vue` + `src/components/ToastContainer.vue` - Toast system
- `src/components/ErrorBoundary.vue` - Graceful render error wrapper

### Composables

- `src/composables/useGame.js` - Question state, scoring, accuracy, completion, incorrect question tracking
- `src/composables/useSound.js` - Centralized Web Audio synthesis and AudioContext lifecycle
- `src/composables/useStorage.js` - LocalStorage-backed best score cache and completion logic
- `src/composables/useToast.js` - Global toast queue

### Utilities & Config

- `src/utils/generator.js` - Weighted question-pool generation and answer checking
- `src/utils/stars.js` - Rating and star rules
- `src/utils/format.js` - Time formatting helpers
- `src/config/difficulty.js` - 15 difficulty definitions and groupings
- `src/config/constants.js` - Gameplay and audio constants

## Important Current Behaviors

### Gameplay

- Correct answers auto-advance to the next question
- Wrong answers stay on the current feedback card until the user confirms
- Result modal shows summary first; mistake review opens as a second step
- “Retry mistakes” starts a new round from the incorrect question list only

### Difficulty & Question Generation

- Difficulty progression is sequential: level `N` unlocks only after passing `N-1`
- Question counts currently scale by stage:
  - `12` questions for `0-3` and `0-5`
  - `14` questions for `0-10`
  - `16` questions for `0-20`
  - `18` questions for `0-100`
- `src/utils/generator.js` builds candidate pools and samples weighted questions instead of using pure random generation

### Audio & Haptics

- Sound and vibration are product defaults and intentionally have no settings toggle
- Audio is handled entirely inside `src/composables/useSound.js`
- The current audio chain uses a shared `AudioContext`, master gain, and lowpass filter

### Persistence

- Best scores are stored in `localStorage['math-game-data']`
- Completion is derived from stored best-score accuracy meeting the pass threshold
- There is no current Pinia store or `src/stores/` directory in the active codebase

## Docs to Keep in Sync

When behavior changes, update these together:

- `README.md` - public-facing features and usage
- `DESIGN.md` - UX and mobile constraints
- `COMPONENTS.md` - component contracts
- `docs/ARCHITECTURE.md` - runtime flow and system behavior
- `PWA.md` - PWA configuration and update flow
- `CHANGELOG.md` - unreleased changes

## Verification Checklist

When changing gameplay or UI:

1. Run `npm run build`
2. Run `pnpm run test:e2e` if flow changes
3. Verify mobile layout manually
4. Check docs for drift if props, routes, config, or flow changed
