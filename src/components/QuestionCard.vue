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
    <!-- 题目内容 -->
    <div class="question-content">
      <span class="text-5xl md:text-7xl font-bold text-peppa-blue-dark font-rounded">
        {{ question.operand1 }}
      </span>
      <span class="text-4xl md:text-6xl font-bold text-peppa-blue-dark/70 font-rounded">
        {{ question.operator }}
      </span>
      <span class="text-5xl md:text-7xl font-bold text-peppa-blue-dark font-rounded">
        {{ question.operand2 }}
      </span>
      <span class="text-4xl md:text-6xl font-bold text-peppa-blue-dark/70 font-rounded">
        =
      </span>
      <span
        class="text-5xl md:text-7xl font-bold font-rounded min-w-[4ch] text-center inline-block transition-all duration-300"
        :class="{
          'text-peppa-cyan animate-pulse-gentle': !shouldShowFeedback,
          'text-peppa-green animate-answer-pop': shouldShowFeedback && isCorrect,
          'text-peppa-orange animate-answer-shake': shouldShowFeedback && isIncorrect
        }"
      >
        {{ shouldShowFeedback ? question.answer : (userAnswer || '?') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  padding: 20px 24px;
  min-width: 280px;
  max-width: 95vw;
  width: 100%;
  touch-action: manipulation;
}

.question-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px 16px;
  flex-wrap: wrap;
}

@keyframes cardBounce {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  60% {
    transform: scale(1.02) translateY(-3px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes answerPop {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.25); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes answerShake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-12px); }
  30% { transform: translateX(12px); }
  45% { transform: translateX(-8px); }
  60% { transform: translateX(8px); }
  75% { transform: translateX(-4px); }
}

.animate-answer-pop {
  animation: answerPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-answer-shake {
  animation: answerShake 0.6s ease-in-out;
}
</style>
