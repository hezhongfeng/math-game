# Components Documentation

This document describes the current Vue components used in the math game project.

## 📁 Component Directory Structure

```text
src/components/
├── BallArray.vue           # Three.js ball-array visualization
├── DifficultyCard.vue      # Difficulty level selection card
├── ErrorBoundary.vue       # Error boundary wrapper
├── NumberPad.vue           # Numeric keypad (3×4 grid)
├── PWAUpdatePrompt.vue     # In-app PWA refresh prompt
├── QuestionCard.vue        # Current question display
├── ResultModal.vue         # Completion summary and mistake review
├── ScoreBoard.vue          # Compact gameplay status panel
├── Toast.vue               # Toast notification item
└── ToastContainer.vue      # Toast notification container
```

## 🎮 Core Components

### BallArray

**File**: `src/components/BallArray.vue`

Visualizes a number (1-1000) as a strict decimal ball array using Three.js. The current implementation uses one shared 3D scene across all ranges, with grouped color cues for tens and hundreds plus mobile-friendly interaction defaults.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | Number | required | Number to visualize (1-1000) |

#### Behavior

- Uses strict decimal spatial layout: ones on X, tens on Y, hundreds on Z
- Uses layered lighting, translucent materials, and grouped color shifts to make `10` / `100` structures easier to read
- Mobile devices default to gentle auto-rotation while preserving vertical page scroll
- Desktop devices support direct rotation and zoom through OrbitControls

### NumberPad

**File**: `src/components/NumberPad.vue`

A 3×4 numeric keypad with delete and confirm buttons. Optimized for mobile touch interaction and reused by gameplay plus number exploration/challenge flows.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | Boolean | `false` | Disable all buttons |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `input` | `number` | Number button pressed (0-9) |
| `delete` | - | Delete button pressed |
| `submit` | - | Confirm button pressed |

### QuestionCard

**File**: `src/components/QuestionCard.vue`

Displays the current math question and current position in the round.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `question` | Object | required | Question object with `operand1`, `operand2`, `operator`, `answer` |
| `showAnswer` | Boolean | `false` | Whether to show answer feedback |
| `userAnswer` | String | `''` | User's current input |
| `currentIndex` | Number | `0` | Current question index (0-based) |
| `totalQuestions` | Number | `10` | Total number of questions |

#### Question Object Structure

```javascript
{
  operand1: 5,
  operand2: 3,
  operator: '+',
  answer: 8,
  userAnswer: null,
  isCorrect: null
}
```

#### Visual States

- Default: shows the question and current input placeholder
- Correct: shows the correct answer in the answer slot while the success overlay is handled by `Game.vue`
- Wrong: keeps the user's answer visible while the error feedback card is handled by `Game.vue`

### DifficultyCard

**File**: `src/components/DifficultyCard.vue`

Card component for displaying a difficulty level in the selection screen.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `difficulty` | Object | required | Difficulty config object |
| `isLocked` | Boolean | `false` | Whether level is locked |
| `isCompleted` | Boolean | `false` | Whether level has been cleared |
| `bestScore` | Object | `null` | Best score data `{ score, accuracy, duration }` |
| `leaderboard` | Array | `[]` | Current level top-10 fastest times |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `(event, difficulty)` | Emitted when card is clicked and not locked |

### ScoreBoard

**File**: `src/components/ScoreBoard.vue`

Compact gameplay status panel. The current implementation intentionally avoids showing score, timer, and accuracy during play.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentIndex` | Number | `0` | Current question index |
| `totalQuestions` | Number | `0` | Total questions |
| `correctCount` | Number | `0` | Number of correct answers |
| `streak` | Number | `0` | Current correct-answer streak |

#### Behavior

- Shows round progress as `current/total`
- Shows streak badge when `streak >= 3`
- Shows compact status text such as remaining question count
- Shows correct-answer count only

### ResultModal

**File**: `src/components/ResultModal.vue`

Completion modal shown after a round ends. Uses a two-step flow: lightweight summary first, mistake review second.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | Boolean | `false` | Whether to show modal |
| `result` | Object | required | Game result data |
| `isNewBest` | Boolean | `false` | Whether this is a new best score |
| `difficultyId` | Number/String | required | Current level id |
| `leaderboard` | Array | `[]` | Current level top-10 fastest times |
| `leaderboardRank` | Number | `null` | Current result rank in the leaderboard |

#### Result Object Structure

```javascript
{
  score: 100,
  correctCount: 10,
  totalCount: 10,
  accuracy: 100,
  duration: 120,
  durationMs: 52340,
  difficulty: { ... },
  completedAt: '...',
  incorrectQuestions: [
    {
      operand1: 5,
      operand2: 3,
      operator: '+',
      userAnswer: 7,
      correctAnswer: 8
    }
  ]
}
```

#### Events

| Event | Description |
|-------|-------------|
| `retry` | User wants to retry the same round |
| `retry-mistakes` | User wants to retry only incorrect questions |
| `home` | User wants to return to difficulty selection |

#### Behavior

- Step 1: stars, short summary text, and primary actions
- Step 1 also includes current level leaderboard and current rank when applicable
- Step 2: dedicated mistake-review panel opened by "看错的"
- Supports direct "练错的 / 再练" action

## 🔔 Toast Components

### Toast

**File**: `src/components/Toast.vue`

Receives a single `toast` object and emits `remove` when dismissed.

### ToastContainer

**File**: `src/components/ToastContainer.vue`

Renders global toast notifications from `useToast()`.

### PWAUpdatePrompt

**File**: `src/components/PWAUpdatePrompt.vue`

Listens to `virtual:pwa-register` and displays an in-app refresh prompt when a new service worker is ready.

## 📄 Page Components

### NumberExplore

**File**: `src/pages/NumberExplore.vue`

Number exploration page supporting both free exploration and range-based challenge practice.

#### Features

- **自由探索**: Enter a number (1-1000), inspect the ball array, then continue stepping through nearby values
- **挑战模式**: Choose a training range and guess the quantity after inspecting the ball array first
- **结构辅助**: Shows decomposition like `237 = 2个百 + 3个十 + 7个一`
- **即时反馈**: Inline guidance, validation states, and challenge-range status

#### Dependencies

- `NumberPad` - Numeric input
- `BallArray` - Ball array visualization
- `useSound` - Click and success sounds

## 📚 See Also

- [AGENTS.md](./AGENTS.md) - Development guidelines
- [DESIGN.md](./DESIGN.md) - Design specifications
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture overview
