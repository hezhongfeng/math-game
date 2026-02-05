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
  <div class="question-card" :class="{ 'success': isCorrect, 'error': isIncorrect }">
    <!-- 简洁顶部栏 -->
    <div class="card-header">
      <span class="question-counter">{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
      <div class="timer-badge">
        <Clock :size="14" />
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
        'placeholder': !userAnswer && !showAnswer,
        'correct': isCorrect,
        'wrong': isIncorrect 
      }">
        {{ answerDisplay }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   Claymorphism 粘土风题目卡片
   ============================================ */

.question-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f8f0 100%);
  border-radius: 24px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 2px 2px 4px rgba(255, 255, 255, 0.8),
    inset -2px -2px 4px rgba(0, 0, 0, 0.05);
}

/* 成功反馈 - 粘土风发光效果 */
.success {
  border: 3px solid var(--game-success);
  box-shadow:
    0 0 25px rgba(82, 196, 26, 0.4),
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 2px 2px 4px rgba(255, 255, 255, 0.8);
  animation: successPulse 0.6s ease-out;
}

@keyframes successPulse {
  0% {
    box-shadow:
      0 0 5px rgba(82, 196, 26, 0.2),
      8px 8px 16px rgba(0, 0, 0, 0.1),
      -8px -8px 16px rgba(255, 255, 255, 0.8);
  }
  50% {
    box-shadow:
      0 0 35px rgba(82, 196, 26, 0.6),
      8px 8px 16px rgba(0, 0, 0, 0.1),
      -8px -8px 16px rgba(255, 255, 255, 0.8);
  }
  100% {
    box-shadow:
      0 0 25px rgba(82, 196, 26, 0.4),
      8px 8px 16px rgba(0, 0, 0, 0.1),
      -8px -8px 16px rgba(255, 255, 255, 0.8);
  }
}

/* 错误反馈 - 粘土风发光效果 */
.error {
  border: 3px solid var(--game-error);
  box-shadow:
    0 0 25px rgba(207, 74, 74, 0.4),
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 2px 2px 4px rgba(255, 255, 255, 0.8);
  animation: errorShake 0.5s ease-out;
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
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
  font-size: 18px;
  font-weight: 700;
  color: var(--game-text-secondary);
}

/* 计时器徽章 - 粘土风 */
.timer-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(145deg, #f0f0e8 0%, #e8e8e0 100%);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--game-text-secondary);
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    inset 3px 3px 6px rgba(0, 0, 0, 0.08),
    inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}

/* 算式区域 */
.math-expression {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 0;
}

.number {
  font-family: 'Alimama ShuHeiTi', 'Noto Sans SC', sans-serif;
  font-size: 44px;
  font-weight: 700;
  color: var(--game-text);
  line-height: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.operator {
  font-size: 40px;
  font-weight: 700;
  color: var(--game-primary);
  line-height: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.equals {
  font-size: 40px;
  font-weight: 700;
  color: var(--game-success);
  line-height: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

/* 答案框 - 粘土风内凹效果 */
.answer {
  font-family: 'Alimama ShuHeiTi', 'Noto Sans SC', sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: var(--game-text);
  line-height: 1;
  min-width: 64px;
  text-align: center;
  padding: 10px 14px;
  background: linear-gradient(145deg, #e8e8e0 0%, #f0f0e8 100%);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    inset 4px 4px 8px rgba(0, 0, 0, 0.08),
    inset -4px -4px 8px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.answer.placeholder {
  color: var(--game-text-muted);
  background: linear-gradient(145deg, #f0f0e8 0%, #f8f8f0 100%);
  border: 2px dashed var(--game-border);
  box-shadow: none;
}

.answer.correct {
  color: var(--game-success);
  background: linear-gradient(145deg, rgba(82, 196, 26, 0.15) 0%, rgba(82, 196, 26, 0.08) 100%);
  border: 2px solid var(--game-success);
  box-shadow:
    inset 4px 4px 8px rgba(82, 196, 26, 0.1),
    inset -4px -4px 8px rgba(255, 255, 255, 0.9),
    0 0 15px rgba(82, 196, 26, 0.3);
}

.answer.wrong {
  color: var(--game-error);
  background: linear-gradient(145deg, rgba(207, 74, 74, 0.15) 0%, rgba(207, 74, 74, 0.08) 100%);
  border: 2px solid var(--game-error);
  box-shadow:
    inset 4px 4px 8px rgba(207, 74, 74, 0.1),
    inset -4px -4px 8px rgba(255, 255, 255, 0.9),
    0 0 15px rgba(207, 74, 74, 0.3);
}

/* 响应式 */
@media (min-width: 768px) {
  .question-card {
    padding: 24px 28px;
    gap: 16px;
    max-width: 480px;
    border-radius: 28px;
  }

  .number {
    font-size: 56px;
  }

  .operator,
  .equals {
    font-size: 52px;
  }

  .answer {
    font-size: 60px;
    min-width: 80px;
    padding: 12px 18px;
    border-radius: 18px;
  }

  .question-counter {
    font-size: 20px;
  }

  .timer-badge {
    font-size: 16px;
    padding: 8px 14px;
  }
}
</style>
