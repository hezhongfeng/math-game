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
.question-card {
  background: white;
  border-radius: 20px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  touch-action: manipulation;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 成功反馈 - 仅样式，无动画 */
.success {
  border: 2px solid var(--game-success);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3), 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 错误反馈 - 仅样式，无动画 */
.error {
  border: 2px solid var(--game-accent);
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.3), 0 4px 12px rgba(0, 0, 0, 0.08);
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

.timer-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--game-bg);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--game-text-secondary);
}

/* 算式区域 */
.math-expression {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 6px 0;
}

.number {
  font-family: 'Alimama ShuHeiTi', 'Noto Sans SC', sans-serif;
  font-size: 44px;
  font-weight: 700;
  color: var(--game-text);
  line-height: 1;
}

.operator {
  font-size: 40px;
  font-weight: 700;
  color: var(--game-primary);
  line-height: 1;
}

.equals {
  font-size: 40px;
  font-weight: 700;
  color: var(--game-success);
  line-height: 1;
}

.answer {
  font-family: 'Alimama ShuHeiTi', 'Noto Sans SC', sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: var(--game-text);
  line-height: 1;
  min-width: 64px;
  text-align: center;
  padding: 8px 12px;
  background: var(--game-bg);
  border-radius: 12px;
  border: 2px solid var(--game-border);
}

.answer.placeholder {
  color: var(--game-text-muted);
  background: transparent;
  border-style: dashed;
}

.answer.correct {
  color: var(--game-success);
  border-color: var(--game-success);
  background: rgba(34, 197, 94, 0.1);
}

.answer.wrong {
  color: var(--game-accent);
  border-color: var(--game-accent);
  background: rgba(249, 115, 22, 0.1);
}

/* 响应式 */
@media (min-width: 768px) {
  .question-card {
    padding: 20px 24px;
    gap: 16px;
    max-width: 480px;
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
    padding: 10px 16px;
  }

  .question-counter {
    font-size: 20px;
  }

  .timer-badge {
    font-size: 16px;
  }
}
</style>
