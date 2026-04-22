<script setup>
import { computed } from 'vue'
import NumberBondHint from './NumberBondHint.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  difficulty: {
    type: Object,
    default: null
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
    default: 20
  },
  showNumberBondHint: {
    type: Boolean,
    default: true
  }
})

const shouldShowFeedback = computed(() => props.showAnswer && props.question?.userAnswer !== null)
const isCorrect = computed(() => props.question.isCorrect === true)
const isIncorrect = computed(() => props.question.isCorrect === false)
const missingPart = computed(() => props.question?.missingPart || 'answer')

const answerDisplay = computed(() => {
  if (shouldShowFeedback.value) {
    return isCorrect.value ? props.question.answer : props.userAnswer
  }

  return props.userAnswer || '?'
})

const answerStateClass = computed(() => ({
  'is-placeholder': !props.userAnswer && !props.showAnswer,
  'is-correct': isCorrect.value,
  'is-wrong': isIncorrect.value
}))
</script>

<template>
  <div class="question-card">
    <div class="card-top">
      <div class="counter-badge">{{ currentIndex + 1 }} / {{ totalQuestions }}</div>
    </div>

    <div class="math-display font-number" data-testid="question-expression">
      <span
        v-if="missingPart === 'operand1'"
        class="answer"
        :class="answerStateClass"
      >
        {{ answerDisplay }}
      </span>
      <span v-else class="number">{{ question.operand1 }}</span>
      <span
        class="symbol operator"
        :class="question.operator === '+' ? 'operator-plus' : 'operator-minus'"
      >
        {{ question.operator }}
      </span>
      <span
        v-if="missingPart === 'operand2'"
        class="answer"
        :class="answerStateClass"
      >
        {{ answerDisplay }}
      </span>
      <span v-else class="number">{{ question.operand2 }}</span>
      <span class="symbol equals">=</span>
      <span
        v-if="missingPart === 'answer'"
        class="answer"
        :class="answerStateClass"
      >
        {{ answerDisplay }}
      </span>
      <span v-else class="number result">{{ question.result }}</span>
    </div>

    <NumberBondHint
      :question="question"
      :difficulty="difficulty"
      :enabled="showNumberBondHint"
    />
  </div>
</template>

<style scoped>
.question-card {
  width: min(100%, 640px);
  padding: 8px 14px;
  border-radius: var(--radius-xl);
  background: var(--bg-panel-strong);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-lg);
}

.card-top,
.math-display {
  display: flex;
  align-items: center;
}

.card-top {
  justify-content: space-between;
  margin-bottom: 4px;
}

.counter-badge {
  padding: 5px 10px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 800;
}

.math-display {
  justify-content: center;
  gap: 8px;
  min-height: 82px;
}

.number,
.answer {
  color: var(--text-primary);
  font-size: clamp(48px, 12vw, 76px);
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: clamp(46px, 10vw, 62px);
  height: clamp(46px, 10vw, 62px);
  border-radius: 18px;
  box-shadow: none;
  font-size: clamp(38px, 9vw, 54px);
  font-weight: 900;
  line-height: 1;
}

.operator,
.equals {
  font-size: clamp(38px, 9vw, 56px);
  font-weight: 800;
}

.operator {
  min-width: clamp(34px, 7vw, 46px);
  height: auto;
  border-radius: 0;
  background: transparent;
}

.operator-plus,
.operator-minus {
  background: transparent;
}

.operator-plus {
  color: #0F3D91;
}

.operator-minus {
  color: #0D6B57;
}

.equals {
  color: #8A5A00;
  background: rgba(245, 201, 74, 0.12);
  min-width: clamp(40px, 8vw, 52px);
  height: clamp(40px, 8vw, 52px);
  font-size: clamp(34px, 8vw, 48px);
}

.answer {
  min-width: 80px;
  padding: 12px 14px;
  border-radius: var(--radius-lg);
  background: #F7FAFF;
  border: 2px solid #DCE7FA;
  text-align: center;
  transition: all var(--duration-fast) var(--ease-standard);
}

.answer:not(.is-placeholder) {
  animation: pop var(--duration-fast) var(--ease-out);
}

.answer.is-placeholder {
  color: var(--text-muted);
}

.answer.is-correct {
  color: var(--candy-mint-dark);
  border-color: rgba(107, 203, 119, 0.4);
  box-shadow: var(--glow-mint);
  animation: success-jump var(--duration-slow) var(--ease-standard);
}

.answer.is-wrong {
  color: var(--candy-red-dark);
  border-color: rgba(255, 107, 107, 0.4);
  animation: error-soft-shake var(--duration-normal) var(--ease-standard);
}

@keyframes pop {
  0% { transform: scale(0.96); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
}

@media (max-width: 420px) {
  .question-card {
    padding: 8px 12px;
  }

  .math-display {
    min-height: 76px;
  }

  .answer {
    min-width: 66px;
    padding: 10px 10px;
    border-radius: var(--radius-lg);
  }
}

@media (max-width: 360px) {
  .card-top {
    margin-bottom: 4px;
  }

  .counter-badge {
    padding: 5px 9px;
    font-size: 12px;
  }

  .math-display {
    min-height: 72px;
  }

  .number,
  .answer {
    font-size: 42px;
  }

  .symbol {
    min-width: 40px;
    height: 40px;
    border-radius: 14px;
    font-size: 30px;
  }

  .equals {
    min-width: 34px;
    height: 34px;
    font-size: 24px;
  }
}
</style>
