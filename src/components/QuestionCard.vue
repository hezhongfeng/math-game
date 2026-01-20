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
    class="question-card p-4 rounded-cute-xl shadow-cute border-2 transition-all duration-300"
    :class="{
      'bg-white border-peppa-green': isCorrect,
      'bg-white border-peppa-orange': isIncorrect,
      'bg-white border-peppa-blue/30': !isCorrect && !isIncorrect
    }"
  >
    <!-- 题目内容 -->
    <div class="text-center">
      <div class="bg-peppa-blue/10 rounded-cute-lg p-3 mb-3 border-2 border-peppa-blue/20">
        <div class="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          <span class="text-4xl md:text-6xl font-bold text-peppa-blue-dark font-rounded">
            {{ question.operand1 }}
          </span>
          <span class="text-3xl md:text-5xl font-bold text-peppa-blue-dark/70 font-rounded">
            {{ question.operator }}
          </span>
          <span class="text-4xl md:text-6xl font-bold text-peppa-blue-dark font-rounded">
            {{ question.operand2 }}
          </span>
          <span class="text-3xl md:text-5xl font-bold text-peppa-blue-dark/70 font-rounded">
            =
          </span>
          <span
            class="text-4xl md:text-6xl font-bold font-rounded min-w-[3ch] text-center inline-block transition-all duration-300"
            :class="{
              'text-peppa-cyan': !shouldShowFeedback,
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
  min-width: 260px;
  max-width: 95vw;
  width: 100%;
}

@keyframes answerPop {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes answerShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.animate-answer-pop {
  animation: answerPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-answer-shake {
  animation: answerShake 0.5s ease-in-out;
}
</style>
