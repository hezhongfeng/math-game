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
    class="question-card p-4 md:p-6 rounded-cute-2xl shadow-cute-lg border-2 transition-all duration-300 animate-card-entrance"
    :class="{
      'bg-white border-peppa-green': isCorrect,
      'bg-white border-peppa-orange': isIncorrect,
      'bg-white border-peppa-blue/30': !isCorrect && !isIncorrect
    }"
  >
    <!-- 题目内容 -->
    <div class="text-center">
      <div class="bg-peppa-blue/10 rounded-cute-lg p-4 md:p-6 mb-3 border-2 border-peppa-blue/20">
        <div class="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
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
    </div>
  </div>
</template>

<style scoped>
.question-card {
  min-width: 300px;
  max-width: 95vw;
  width: 100%;
  touch-action: manipulation;
  animation: cardBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cardBounce {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  60% {
    transform: scale(1.05) translateY(-5px);
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
