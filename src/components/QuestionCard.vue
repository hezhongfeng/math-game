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
  }
})

const shouldShowFeedback = computed(() => props.showAnswer && props.question.userAnswer !== null)
const isCorrect = computed(() => props.question.isCorrect === true)
const isIncorrect = computed(() => props.question.isCorrect === false)
</script>

<template>
  <div
    class="question-card rounded-cute-2xl shadow-cute-lg border-2 transition-all duration-300"
    :class="{
      'bg-peppa-green/10 border-peppa-green': isCorrect,
      'bg-peppa-orange/10 border-peppa-orange': isIncorrect,
      'bg-peppa-blue/10 border-peppa-blue/30': !isCorrect && !isIncorrect
    }"
  >
    <!-- 题目区域 -->
    <div class="question-section">
      <div class="expression">
        <span class="number operand1">{{ question.operand1 }}</span>
        <span class="operator">{{ question.operator }}</span>
        <span class="number operand2">{{ question.operand2 }}</span>
      </div>
    </div>
    
    <!-- 等号和答案区域 -->
    <div class="answer-section">
      <div class="equals-answer">
        <span class="equals">=</span>
        <span
          class="answer"
          :class="{
            'placeholder': !shouldShowFeedback,
            'correct': shouldShowFeedback && isCorrect,
            'incorrect': shouldShowFeedback && isIncorrect
          }"
        >
          {{ shouldShowFeedback ? question.answer : (userAnswer || '?') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  padding: 24px 28px;
  min-width: 300px;
  max-width: 95vw;
  width: 100%;
  touch-action: manipulation;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 题目区域 */
.question-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.expression {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.number {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1e3a5f;
  font-family: inherit;
  line-height: 1;
  min-width: 3ch;
  text-align: center;
}

.operand1, .operand2 {
  color: #1e3a5f; /* peppa-blue-dark */
}

.operator {
  font-size: 2.5rem;
  font-weight: 700;
  color: #5a7a9a; /* peppa-blue-dark/70 */
  font-family: inherit;
  line-height: 1;
}

/* 等号和答案区域 */
.answer-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.equals-answer {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 1px 4px rgba(0, 0, 0, 0.02);
}

.equals {
  font-size: 2.5rem;
  font-weight: 700;
  color: #5a7a9a; /* peppa-blue-dark/70 */
  font-family: inherit;
  line-height: 1;
}

.answer {
  font-size: 3.5rem;
  font-weight: 800;
  font-family: inherit;
  line-height: 1;
  min-width: 4ch;
  text-align: center;
  transition: all 0.3s ease;
}

/* 答案状态 */
.answer.placeholder {
  color: #06b6d4; /* peppa-cyan */
  animation: pulse-gentle 2s ease-in-out infinite;
}

.answer.correct {
  color: #059669; /* peppa-green */
  animation: answer-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.answer.incorrect {
  color: #ea580c; /* peppa-orange */
  animation: answer-shake 0.6s ease-in-out;
}

/* 动画 */
@keyframes answer-pop {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.25); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes answer-shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-12px); }
  30% { transform: translateX(12px); }
  45% { transform: translateX(-8px); }
  60% { transform: translateX(8px); }
  75% { transform: translateX(-4px); }
}

@keyframes pulse-gentle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* 响应式设计 */
@media (min-width: 768px) {
  .question-card {
    padding: 32px 40px;
    gap: 24px;
  }
  
  .number {
    font-size: 4.5rem;
  }
  
  .operator {
    font-size: 3rem;
  }
  
  .equals {
    font-size: 3rem;
  }
  
  .answer {
    font-size: 4.5rem;
  }
  
  .equals-answer {
    gap: 24px;
    padding: 16px 32px;
  }
}
</style>
