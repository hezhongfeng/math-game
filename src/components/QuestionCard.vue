<script setup>
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import NumberCard from './NumberCard.vue'

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

// 答案卡片的状态
const answerCardState = computed(() => {
  if (!props.userAnswer) {
    return 'placeholder'
  }
  return 'default'
})

// 答案卡片的值
const answerCardValue = computed(() => {
  if (shouldShowFeedback.value) {
    return isCorrect.value ? props.question.answer : props.userAnswer
  }
  return props.userAnswer || '?'
})
</script>

<template>
  <div class="question-card" :class="{ 'success': isCorrect, 'error': isIncorrect }">
    <!-- 顶部信息栏 -->
    <div class="header-bar">
      <div class="question-indicator">
        <span class="current-index">第 {{ currentIndex + 1 }} 题</span>
        <span class="total-count">/ 共 {{ totalQuestions }} 题</span>
      </div>
      <div class="timer">
        <Clock :size="14" class="timer-icon" />
        <span class="timer-value">{{ formattedTime }}</span>
      </div>
    </div>

    <!-- 算式与答案区域 -->
    <div class="expression-section">
      <div class="expression">
        <NumberCard
          :value="question.operand1"
          size="normal"
          state="default"
        />
        <span class="operator">{{ question.operator }}</span>
        <NumberCard
          :value="question.operand2"
          size="normal"
          state="default"
        />
        <span class="equals-operator">=</span>
        <NumberCard
          :value="answerCardValue"
          size="large"
          :state="answerCardState"
          min-width="4ch"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  background: white;
  border-radius: 24px;
  padding: 18px 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 280px;
  max-width: 95vw;
  width: 100%;
  touch-action: manipulation;
  transition: all 0.3s ease;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.08);
}

/* 成功反馈 */
.success {
  animation: successPulse 0.4s ease-out;
  border: 2px solid var(--game-success);
  box-shadow:
    0 0 16px rgba(34, 197, 94, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.08);
}

/* 错误反馈 */
.error {
  animation: errorShake 0.4s ease-out;
  border: 2px solid var(--game-accent);
  box-shadow:
    0 0 16px rgba(249, 115, 22, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.08);
}

@keyframes successPulse {
  0% { transform: scale(0.98); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

/* 顶部信息栏 */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--game-border);
}

.question-indicator {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.current-index {
  font-size: 16px;
  font-weight: 700;
  color: var(--game-text);
}

.total-count {
  font-size: 13px;
  color: var(--game-text-secondary);
  font-weight: 500;
}

/* 计时器 */
.timer {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  background: var(--game-bg-light);
  border-radius: 12px;
}

.timer-icon {
  color: var(--game-text-secondary);
}

.timer-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--game-text-secondary);
  font-variant-numeric: tabular-nums;
}

/* 算式与答案区域 */
.expression-section {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}

.expression {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.operator {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--game-primary-dark);
  line-height: 1;
  user-select: none;
}

.equals-operator {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--game-success-dark);
  line-height: 1;
  user-select: none;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .question-card {
    padding: 24px 28px 18px;
    gap: 18px;
    min-width: 360px;
  }

  .current-index {
    font-size: 18px;
  }

  .total-count {
    font-size: 14px;
  }

  .timer-value {
    font-size: 14px;
  }

  .operator {
    font-size: 2.6rem;
  }

  .equals-operator {
    font-size: 2.6rem;
  }

  .expression {
    gap: 20px;
  }
}
</style>
