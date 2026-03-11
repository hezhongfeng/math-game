# Components Documentation

This document provides detailed information about all Vue components in the math game project.

## 📁 Component Directory Structure

```
src/components/
├── DifficultyCard.vue       # Difficulty level selection card
├── NumberPad.vue           # Numeric keypad (3×4 grid)
├── QuestionCard.vue        # Math question display
├── ResultModal.vue         # Game completion modal
├── ScoreBoard.vue          # Real-time score display
├── Toast.vue               # Toast notification item
├── ToastContainer.vue      # Toast notification container
└── ErrorBoundary.vue       # Error boundary wrapper
```

---

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

#### Layout

```
┌───┬───┬───┐
│ 1 │ 2 │ 3 │
├───┼───┼───┤
│ 4 │ 5 │ 6 │
├───┼───┼───┤
│ 7 │ 8 │ 9 │
├───┼───┼───┤
│ 🗑 │ 0 │ ✓ │
└───┴───┴───┘
```

#### Key Features

- **Touch Target Size**: 64×64px minimum (72×72px on desktop)
- **Visual Feedback**: Active state with scale animation
- **Sound Effects**: Plays 'click' sound on button press
- **Accessibility**: `-webkit-tap-highlight-color: transparent` and `touch-action: manipulation`

#### Usage Example

```vue
<script setup>
import NumberPad from '../components/NumberPad.vue'

const isWaiting = ref(false)
const userAnswer = ref('')

function handleInput(num) {
  userAnswer.value += num
}

function handleDelete() {
  userAnswer.value = userAnswer.value.slice(0, -1)
}

function handleSubmit() {
  // Submit answer logic
}
</script>

<template>
  <NumberPad
    :disabled="isWaiting"
    @input="handleInput"
    @delete="handleDelete"
    @submit="handleSubmit"
  />
</template>
```

---

### QuestionCard

**File**: `src/components/QuestionCard.vue`

Displays the current math question with progress indicator and timer.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `question` | Object | required | Question object with `operand1`, `operand2`, `operator`, `answer` |
| `showAnswer` | Boolean | `false` | Whether to show answer feedback |
| `userAnswer` | String | `''` | User's current input |
| `currentIndex` | Number | `0` | Current question index (0-based) |
| `totalQuestions` | Number | `10` | Total number of questions |
| `questionTimer` | Number | `0` | Elapsed time in seconds |

#### Question Object Structure

```javascript
{
  operand1: 5,        // First number
  operand2: 3,        // Second number
  operator: '+',      // '+', '-', or '±'
  answer: 8,          // Correct answer
  userAnswer: null,   // User's answer (null if not answered)
  isCorrect: null     // Boolean or null
}
```

#### Visual States

- **Default**: White background, normal border
- **Success** (`success` class): Green border, success animation
- **Error** (`error` class): Orange border, shake animation

#### Usage Example

```vue
<script setup>
import QuestionCard from '../components/QuestionCard.vue'

const question = {
  operand1: 5,
  operand2: 3,
  operator: '+',
  answer: 8
}
</script>

<template>
  <QuestionCard
    :question="question"
    :show-answer="false"
    user-answer="5"
    :current-index="0"
    :total-questions="10"
    :question-timer="15"
  />
</template>
```

---

### DifficultyCard

**File**: `src/components/DifficultyCard.vue`

Card component for displaying a difficulty level in the selection screen.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | Number | required | Difficulty level ID |
| `name` | String | required | Level name (e.g., "入门1") |
| `description` | String | required | Level description |
| `color` | String | required | Tailwind color class |
| `textColor` | String | required | Tailwind text color class |
| `stars` | Number | required | Difficulty rating (1-5) |
| `isLocked` | Boolean | `true` | Whether level is locked |
| `bestScore` | Object | `null` | Best score data `{ score, accuracy, duration }` |

#### Events

| Event | Description |
|-------|-------------|
| `select` | Emitted when card is clicked (only if not locked) |

#### Usage Example

```vue
<DifficultyCard
  :id="1"
  name="入门1"
  description="1-3 以内加法"
  color="bg-green-400"
  text-color="text-green-600"
  :stars="1"
  :is-locked="false"
  :best-score="{ score: 100, accuracy: 100, duration: 45 }"
  @select="startLevel(1)"
/>
```

---

### ScoreBoard

**File**: `src/components/ScoreBoard.vue`

Real-time score and progress display during gameplay.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `score` | Number | `0` | Current score |
| `currentIndex` | Number | `0` | Current question index |
| `totalQuestions` | Number | `10` | Total questions |
| `correctCount` | Number | `0` | Number of correct answers |
| `duration` | Number | `0` | Game duration in seconds |
| `accuracy` | Number | `0` | Accuracy percentage |

#### Usage Example

```vue
<ScoreBoard
  :score="game.score.value"
  :current-index="game.currentIndex.value"
  :total-questions="game.questions.value.length"
  :correct-count="game.correctCount.value"
  :duration="gameTime"
  :accuracy="game.accuracy.value"
/>
```

---

### ResultModal

**File**: `src/components/ResultModal.vue`

Modal displayed when game is completed, showing statistics and next actions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | Boolean | `false` | Whether to show modal |
| `result` | Object | required | Game result data |
| `isNewBest` | Boolean | `false` | Whether this is a new best score |

#### Result Object Structure

```javascript
{
  score: 100,           // Total score
  correctCount: 10,     // Correct answers
  totalCount: 10,       // Total questions
  accuracy: 100,        // Accuracy percentage
  duration: 120,        // Duration in seconds
  difficulty: { ... },  // Difficulty config object
  completedAt: "..."    // ISO timestamp
  difficulty: { ... },  // Difficulty config object
  completedAt: "...",   // ISO timestamp
  incorrectQuestions: [
    {
      question: "5 + 3 = ?",
      questionText: "5 + 3 = ?",
      userAnswer: 8,
      correctAnswer: 10,
      operation: "+"
    }
  ]
}```
```

#### Events

| Event | Description |
|-------|-------------|
| `retry` | User wants to retry the same level |
| `home` | User wants to return to difficulty selection |

#### Usage Example

```vue
<ResultModal
  :show="showModal"
  :result="resultData"
  :is-new-best="isNewBest"
  :result="resultData"
  :is-new-best="isNewBest"
  @retry="handleRetry"
  @home="handleHome"
/>
```

#### Incorrect Questions Review

The ResultModal now includes an expandable section showing incorrect questions:

- **Toggle Button**: Shows "查看错题 (N题)" button when there are incorrect questions
- **Expandable List**: Click to expand/collapse the incorrect questions list
- **Question Display**: Shows the question text and answers
  - **Your Answer**: Displayed in orange (`answer wrong`)
  - **Correct Answer**: Displayed in green (`answer correct`)
- **Animation**: Smooth expand/collapse animation using CSS transitions

**Note**: Incorrect questions are tracked in `useGame.js` and passed to the ResultModal through the `result.incorrectQuestions` array.
  @home="handleHome"
/>
```

---

## 🔔 Toast Components

### Toast

**File**: `src/components/Toast.vue`

Individual toast notification item.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | String | required | Toast message text |
| `type` | String | `'info'` | `'info'`, `'success'`, `'warning'`, or `'error'` |
| `duration` | Number | `3000` | Display duration in milliseconds |

### ToastContainer

**File**: `src/components/ToastContainer.vue`

Container component that manages and displays toast notifications.

Used in conjunction with `useToast` composable:

```vue
<script setup>
import { useToast } from '../composables/useToast'

const { showToast } = useToast()

// Show toast
showToast('Answer submitted!', 'success')
showToast('An error occurred', 'error')
</script>
```

---

## 📚 See Also

- [AGENTS.md](./AGENTS.md) - Development guidelines
- [DESIGN.md](./DESIGN.md) - Design specifications
- [CLAUDE.md](./CLAUDE.md) - Architecture overview
