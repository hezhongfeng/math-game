<script setup>
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import { formatTimePad } from '../utils/format'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  showAnswer: {
    type: Boolean,
    default: false
  },
  userAnswer: {
    type: String,
    default: ''
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 10
  },
  questionTimer: {
    type: Number,
    default: 0
  }
})

const shouldShowFeedback = computed(() => props.showAnswer && props.question?.userAnswer !== null)
const isCorrect = computed(() => props.question.isCorrect === true)
const isIncorrect = computed(() => props.question.isCorrect === false)

const formattedTime = computed(() => formatTimePad(props.questionTimer))

const answerDisplay = computed(() => {
  if (shouldShowFeedback.value) {
    return isCorrect.value ? props.question.answer : props.userAnswer
  }
  return props.userAnswer || '?'
})
</script>

<template>
  <div class="question-card">
    <div class="card-header">
      <span class="counter">{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
      <div class="timer">
        <Clock :size="20" />
        <span>{{ formattedTime }}</span>
      </div>
    </div>

    <div class="math-display">
      <span class="number">{{ question.operand1 }}</span>
      <span class="operator">{{ question.operator }}</span>
      <span class="number">{{ question.operand2 }}</span>
      <span class="equals">=</span>
      <span class="answer" :class="{ 
        'is-placeholder': !userAnswer && !showAnswer,
        'is-correct': isCorrect,
        'is-wrong': isIncorrect 
      }">
        {{ answerDisplay }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.counter {
  font-size: var(--font-lg);
  font-weight: 700;
  color: var(--text-gray);
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-light);
  border-radius: var(--radius-full);
  font-size: var(--font-md);
  font-weight: 700;
  color: var(--text-gray);
}

.math-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 4px 0;
}

.number {
  font-size: var(--font-hero);
  font-weight: 800;
  color: var(--text-dark);
  font-variant-numeric: tabular-nums;
}

.operator {
  font-size: var(--font-h1);
  font-weight: 700;
  color: var(--coral);
}

.equals {
  font-size: var(--font-h1);
  font-weight: 700;
  color: var(--text-gray);
}

.answer {
  font-size: var(--font-hero);
  font-weight: 800;
  min-width: 72px;
  text-align: center;
  padding: 8px 12px;
  background: var(--bg-light);
  border-radius: var(--radius-md);
  border: 3px solid var(--border-light);
  font-variant-numeric: tabular-nums;
  transition: all 0.2s ease;
}

.answer.is-placeholder {
  color: var(--border-default);
}

.answer.is-correct {
  color: var(--success);
  border-color: var(--success);
}

.answer.is-wrong {
  color: var(--coral);
  border-color: var(--coral);
}

@media (min-width: 768px) {
  .question-card {
    padding: 20px 28px;
    max-width: 560px;
  }

  .number, .answer {
    font-size: 64px;
  }

  .operator, .equals {
    font-size: 48px;
  }

  .answer {
    min-width: 100px;
    padding: 12px 16px;
  }
}

@media (max-width: 375px) {
  .question-card {
    padding: 12px 16px;
  }

  .math-display {
    gap: 8px;
  }

  .number, .answer {
    font-size: 40px;
  }

  .operator, .equals {
    font-size: 32px;
  }

  .answer {
    min-width: 64px;
    padding: 6px 10px;
  }
}
</style>
