# Components Documentation

This document describes the current Vue components used in the math game project.

## 📁 Component Directory Structure

```text
src/components/
├── DifficultyCard.vue      # Difficulty level selection card
├── ErrorBoundary.vue       # Error boundary wrapper
├── NumberPad.vue           # Numeric keypad (3×4 grid)
├── PWAUpdatePrompt.vue     # In-app PWA refresh prompt
├── QuestionCard.vue        # Current question display
├── ResultModal.vue         # Completion summary and mistake review
├── ScoreBoard.vue          # Compact gameplay status panel
├── SkeletonCard.vue        # Lightweight loading placeholder
├── Toast.vue               # Toast notification item
└── ToastContainer.vue      # Toast notification container
```

## 🎮 Core Components

### NumberPad

**File**: `src/components/NumberPad.vue`

A 3×4 numeric keypad with delete and confirm buttons. Optimized for mobile touch interaction.

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

Displays the current math question, current position in the round, and answer feedback state.

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
- Correct: shows success badge and correct answer styling
- Wrong: keeps the user's answer visible and shows an error badge

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

- Shows round progress percentage
- Shows streak badge when `streak >= 3`
- Shows compact status text such as remaining question count
- Shows correct-answer count only

### ResultModal

**File**: `src/components/ResultModal.vue`

Completion modal shown after a round ends. Uses a two-step flow: summary first, mistake review second.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | Boolean | `false` | Whether to show modal |
| `result` | Object | required | Game result data |
| `isNewBest` | Boolean | `false` | Whether this is a new best score |

#### Result Object Structure

```javascript
{
  score: 100,
  correctCount: 10,
  totalCount: 10,
  accuracy: 100,
  duration: 120,
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

- Step 1: summary, stars, stats, and primary actions
- Step 2: dedicated mistake-review panel opened by "查看错题"
- Supports direct "再练错题" action

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

## 📚 See Also

- [AGENTS.md](./AGENTS.md) - Development guidelines
- [DESIGN.md](./DESIGN.md) - Design specifications
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture overview
