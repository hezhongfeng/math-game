<script setup>
import { computed } from 'vue'

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
  }
})

const shouldShowFeedback = computed(() => props.showAnswer && props.question?.userAnswer !== null)
const isCorrect = computed(() => props.question.isCorrect === true)
const isIncorrect = computed(() => props.question.isCorrect === false)

const answerDisplay = computed(() => {
  if (shouldShowFeedback.value) {
    return isCorrect.value ? props.question.answer : props.userAnswer
  }

  return props.userAnswer || '?'
})
</script>

<template>
  <div class="question-card">
    <div class="card-top">
      <div class="counter-badge">第 {{ currentIndex + 1 }} 题 / 共 {{ totalQuestions }} 题</div>
      <div v-if="showAnswer" class="result-badge" :class="{ 'is-correct': isCorrect, 'is-wrong': isIncorrect }">
        {{ isCorrect ? '回答正确' : '看一眼答案' }}
      </div>
    </div>

    <div class="math-display font-number" data-testid="question-expression">
      <span class="number">{{ question.operand1 }}</span>
      <span class="operator">{{ question.operator }}</span>
      <span class="number">{{ question.operand2 }}</span>
      <span class="equals">=</span>
      <span
        class="answer"
        :class="{
          'is-placeholder': !userAnswer && !showAnswer,
          'is-correct': isCorrect,
          'is-wrong': isIncorrect
        }"
      >
        {{ answerDisplay }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  width: min(100%, 640px);
  padding: 10px 16px;
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
  margin-bottom: 10px;
}

.counter-badge,
.result-badge {
  padding: 8px 12px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 800;
}

.result-badge.is-correct {
  color: var(--candy-mint-dark);
  border-color: rgba(46, 196, 182, 0.2);
  background: var(--candy-mint-soft);
}

.result-badge.is-wrong {
  color: var(--candy-peach-dark);
  border-color: rgba(242, 140, 82, 0.2);
  background: var(--candy-peach-soft);
}

.math-display {
  justify-content: center;
  gap: 8px;
  min-height: 112px;
}

.number,
.answer {
  color: var(--text-primary);
  font-size: clamp(48px, 12vw, 76px);
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.operator,
.equals {
  font-size: clamp(34px, 8vw, 50px);
  font-weight: 800;
}

.operator {
  color: var(--candy-pink-dark);
}

.equals {
  color: var(--text-muted);
}

.answer {
  min-width: 80px;
  padding: 12px 14px;
  border-radius: var(--radius-lg);
  background: #F7FAFF;
  border: 2px solid #DCE7FA;
  text-align: center;
  transition: border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}

.answer.is-placeholder {
  color: var(--text-muted);
}

.answer.is-correct {
  color: var(--candy-mint-dark);
  border-color: rgba(78, 205, 196, 0.4);
  box-shadow: var(--glow-mint);
}

.answer.is-wrong {
  color: var(--candy-red-dark);
  border-color: rgba(255, 107, 107, 0.4);
}

@media (max-width: 420px) {
  .question-card {
    padding: 10px 14px;
  }

  .math-display {
    min-height: 96px;
  }

  .answer {
    min-width: 66px;
    padding: 10px 10px;
    border-radius: var(--radius-lg);
  }
}

@media (max-width: 360px) {
  .card-top {
    margin-bottom: 8px;
  }

  .counter-badge,
  .result-badge {
    padding: 8px 10px;
    font-size: 12px;
  }

  .math-display {
    min-height: 92px;
  }

  .number,
  .answer {
    font-size: 42px;
  }

  .operator,
  .equals {
    font-size: 28px;
  }
}
</style>
