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

// 答案卡片的状态 - 始终保持默认样式
const answerCardState = computed(() => {
  if (!props.userAnswer) {
    return 'placeholder'
  }
  return 'default'
})

// 答案卡片的值
const answerCardValue = computed(() => {
  // 只在答对时显示正确答案，答错时显示用户答案
  if (shouldShowFeedback.value) {
    return isCorrect.value ? props.question.answer : props.userAnswer
  }
  return props.userAnswer || '?'
})
</script>

<template>
  <div class="question-card state-default">
    <!-- 顶部信息栏 -->
    <div class="header-bar">
      <div class="question-indicator">
        <span class="current-index">第 {{ currentIndex + 1 }} 题</span>
        <span class="total-count">/ 共 {{ totalQuestions }} 题</span>
      </div>
      <div class="timer">
        <Clock :size="16" class="timer-icon" />
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
  background: #ffffff;
  border-radius: 32px;
  padding: 20px 24px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 300px;
  max-width: 95vw;
  width: 100%;
  touch-action: manipulation;
  transition: all 0.3s ease;
}

/* 状态样式 */
.question-card.state-default {
  border: 2px solid rgba(74, 144, 226, 0.2);
}

.question-card.state-correct {
  border: 3px solid #4CAF50;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.2);
}

.question-card.state-incorrect {
  border: 2px solid #FF9800;
}

/* 顶部信息栏 */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.question-indicator {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.current-index {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e3a5f;
}

.total-count {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

.timer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  border-radius: 20px;
  border: 1px solid rgba(74, 144, 226, 0.2);
}

.timer-icon {
  color: #4A90E2;
}

.timer-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #4A90E2;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

/* 算式与答案区域 */
.expression-section {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.expression {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.operator {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4A90E2;
  line-height: 1;
  user-select: none;
}

.equals-operator {
  font-size: 2.5rem;
  font-weight: 700;
  color: #64748b;
  line-height: 1;
  user-select: none;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .question-card {
    padding: 28px 32px 20px;
    gap: 20px;
    min-width: 380px;
  }

  .current-index {
    font-size: 1.25rem;
  }

  .total-count {
    font-size: 0.95rem;
  }

  .timer-value {
    font-size: 1rem;
  }

  .operator {
    font-size: 2.5rem;
    width: 56px;
    height: 56px;
  }

  .equals-operator {
    font-size: 2.5rem;
    width: 56px;
    height: 56px;
  }

  .expression {
    gap: 28px;
  }

  .divider-equals {
    font-size: 1.75rem;
  }

  .dot {
    width: 10px;
    height: 10px;
  }
}
</style>
