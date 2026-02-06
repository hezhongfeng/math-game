<script setup>
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'

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

const shouldShowFeedback = computed(() => props.showAnswer && props.question.userAnswer !== null)
const isCorrect = computed(() => props.question.isCorrect === true)
const isIncorrect = computed(() => props.question.isCorrect === false)

// 格式化计时器显示 MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(props.questionTimer / 60)
  const seconds = props.questionTimer % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 答案显示
const answerDisplay = computed(() => {
  if (shouldShowFeedback.value) {
    return isCorrect.value ? props.question.answer : props.userAnswer
  }
  return props.userAnswer || '?'
})
</script>

<template>
  <div 
    class="question-card" 
    :class="{ 
      'is-success': isCorrect, 
      'is-error': isIncorrect 
    }"
  >
    <!-- 顶部栏 -->
    <div class="card-header">
      <span class="question-counter">{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
      <div class="timer-badge">
        <Clock :size="14" stroke-width="2.5" />
        <span>{{ formattedTime }}</span>
      </div>
    </div>

    <!-- 算式区域 -->
    <div class="math-expression">
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 380px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 8px 32px rgba(0, 0, 0, 0.02);
  transition: all var(--duration-micro) var(--ease-standard);
  will-change: transform, box-shadow;
}

/* 成功反馈 */
.is-success {
  border-color: rgba(52, 199, 89, 0.3);
  box-shadow: 
    0 0 0 4px rgba(52, 199, 89, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 8px 32px rgba(0, 0, 0, 0.02);
  animation: successFeedback var(--duration-emphasis) var(--ease-spring);
}

@keyframes successFeedback {
  0% {
    transform: scale(1);
    box-shadow: 
      0 0 0 0 rgba(52, 199, 89, 0.3),
      0 4px 16px rgba(0, 0, 0, 0.06),
      0 8px 32px rgba(0, 0, 0, 0.02);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 
      0 0 0 12px rgba(52, 199, 89, 0),
      0 4px 16px rgba(0, 0, 0, 0.06),
      0 8px 32px rgba(0, 0, 0, 0.02);
  }
  100% {
    transform: scale(1);
    box-shadow: 
      0 0 0 4px rgba(52, 199, 89, 0.15),
      0 4px 16px rgba(0, 0, 0, 0.06),
      0 8px 32px rgba(0, 0, 0, 0.02);
  }
}

/* 错误反馈 */
.is-error {
  border-color: rgba(255, 59, 48, 0.3);
  box-shadow: 
    0 0 0 4px rgba(255, 59, 48, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 8px 32px rgba(0, 0, 0, 0.02);
  animation: errorFeedback var(--duration-emphasis) var(--ease-standard);
}

@keyframes errorFeedback {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* 顶部栏 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-counter {
  font-size: 17px;
  font-weight: 600;
  color: var(--ios-gray-1);
  letter-spacing: -0.01em;
}

/* 计时器徽章 */
.timer-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--ios-gray-6);
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 600;
  color: var(--ios-gray-1);
}

/* 算式区域 */
.math-expression {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px 0;
}

.number {
  font-size: 44px;
  font-weight: 600;
  color: var(--ios-text-primary);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.operator {
  font-size: 40px;
  font-weight: 600;
  color: var(--ios-blue);
  line-height: 1;
}

.equals {
  font-size: 40px;
  font-weight: 600;
  color: var(--ios-gray-1);
  line-height: 1;
}

/* 答案框 */
.answer {
  font-size: 44px;
  font-weight: 700;
  color: var(--ios-text-primary);
  line-height: 1;
  min-width: 56px;
  text-align: center;
  padding: 8px 12px;
  background: var(--ios-gray-6);
  border-radius: var(--radius-md);
  border: 1px solid var(--ios-gray-4);
  font-variant-numeric: tabular-nums;
  transition: all var(--duration-micro) var(--ease-standard);
}

.answer.is-placeholder {
  color: var(--ios-gray-2);
  border-style: dashed;
}

.answer.is-correct {
  color: var(--ios-green);
  background: rgba(52, 199, 89, 0.1);
  border-color: var(--ios-green);
}

.answer.is-wrong {
  color: var(--ios-red);
  background: rgba(255, 59, 48, 0.1);
  border-color: var(--ios-red);
}

/* 响应式 */
@media (min-width: 768px) {
  .question-card {
    padding: 28px 32px;
    gap: 20px;
    max-width: 440px;
  }

  .number {
    font-size: 56px;
  }

  .operator,
  .equals {
    font-size: 52px;
  }

  .answer {
    font-size: 56px;
    min-width: 72px;
    padding: 10px 16px;
  }

  .question-counter {
    font-size: 19px;
  }

  .timer-badge {
    font-size: 15px;
    padding: 8px 14px;
  }
}
</style>
