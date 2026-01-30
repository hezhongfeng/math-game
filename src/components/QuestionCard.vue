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
  <div class="question-card-candy" :class="{ 'success-candy': isCorrect, 'error-candy': isIncorrect }">
    <!-- 顶部信息栏 -->
    <div class="header-bar-candy">
      <div class="question-indicator">
        <span class="current-index">第 {{ currentIndex + 1 }} 题</span>
        <span class="total-count">/ 共 {{ totalQuestions }} 题</span>
      </div>
      <div class="timer-candy">
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
        <span class="operator-candy">{{ question.operator }}</span>
        <NumberCard
          :value="question.operand2"
          size="normal"
          state="default"
        />
        <span class="equals-operator-candy">=</span>
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
/* Candy Claymorphism 题目卡片 */
.question-card-candy {
  background: linear-gradient(135deg, #ffffff 0%, #FFFBF5 100%);
  border-radius: 28px;
  padding: 20px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 300px;
  max-width: 95vw;
  width: 100%;
  touch-action: manipulation;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    8px 8px 20px rgba(0, 0, 0, 0.08),
    -4px -4px 12px rgba(255, 255, 255, 0.9),
    inset -2px -2px 8px rgba(0, 0, 0, 0.03),
    inset 2px 2px 8px rgba(255, 255, 255, 0.9);
}

/* 成功反馈 */
.success-candy {
  animation: celebrateClay 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 0 25px rgba(152, 255, 152, 0.6),
    8px 8px 20px rgba(0, 0, 0, 0.08),
    -4px -4px 12px rgba(255, 255, 255, 0.9),
    inset -2px -2px 8px rgba(0, 0, 0, 0.03),
    inset 2px 2px 8px rgba(255, 255, 255, 0.9);
  border-color: rgba(152, 255, 152, 0.5);
}

/* 错误反馈 */
.error-candy {
  animation: shakeClay 0.5s ease-in-out;
  box-shadow:
    0 0 20px rgba(255, 143, 163, 0.5),
    8px 8px 20px rgba(0, 0, 0, 0.08),
    -4px -4px 12px rgba(255, 255, 255, 0.9),
    inset -2px -2px 8px rgba(0, 0, 0, 0.03),
    inset 2px 2px 8px rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 143, 163, 0.5);
}

@keyframes celebrateClay {
  0% { transform: scale(0.98) rotate(0deg); }
  50% { transform: scale(1.02) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes shakeClay {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* 顶部信息栏 */
.header-bar-candy {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 143, 163, 0.1);
}

.question-indicator {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.current-index {
  font-size: 1.1rem;
  font-weight: 700;
  color: #5D4E37;
}

.total-count {
  font-size: 0.85rem;
  color: #9E9E9E;
  font-weight: 500;
}

/* 计时器 - Candy Style */
.timer-candy {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%);
  border-radius: 20px;
  border: 2px solid white;
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.05),
    -1px -1px 4px rgba(255, 255, 255, 0.8),
    inset -1px -1px 3px rgba(0, 0, 0, 0.03),
    inset 1px 1px 3px rgba(255, 255, 255, 0.9);
}

.timer-icon {
  color: #29B6F6;
}

.timer-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #29B6F6;
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

.operator-candy {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #FF8FA3 0%, #4FC3F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  user-select: none;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.equals-operator-candy {
  font-size: 2.5rem;
  font-weight: 700;
  color: #98FF98;
  line-height: 1;
  user-select: none;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* 响应式设计 */
@media (min-width: 768px) {
  .question-card-candy {
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

  .operator-candy {
    font-size: 3rem;
  }

  .equals-operator-candy {
    font-size: 3rem;
  }

  .expression {
    gap: 28px;
  }
}
</style>
