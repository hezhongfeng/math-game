<script setup>
import { computed } from 'vue'
import { Star, Heart } from 'lucide-vue-next'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  showAnswer: {
    type: Boolean,
    default: false
  }
})

const isCorrect = computed(() => props.question.isCorrect === true)
const isIncorrect = computed(() => props.question.isCorrect === false)
</script>

<template>
  <div
    class="question-card p-6 md:p-8 rounded-cute-xl shadow-cute-lg animate-scaleIn border-4"
    :class="{
      'bg-white border-peppa-green': isCorrect,
      'bg-white border-peppa-orange': isIncorrect,
      'bg-white border-peppa-blue-dark': !isCorrect && !isIncorrect
    }"
  >
    <!-- 题目内容 -->
    <div class="text-center">
      <!-- 装饰 -->
      <div class="flex justify-center gap-4 mb-4">
        <span class="text-3xl animate-wiggle" style="animation-delay: 0s">⚽</span>
        <span class="text-3xl animate-float">⭐</span>
        <span class="text-3xl animate-wiggle" style="animation-delay: 0.2s">⚽</span>
      </div>

      <div class="bg-peppa-blue-light/30 rounded-cute-lg p-4 mb-4">
        <div class="flex items-center justify-center gap-3 md:gap-4">
          <span
            class="text-5xl md:text-7xl font-bold text-peppa-blue-dark font-rounded"
          >
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
          <span class="text-5xl md:text-7xl font-bold text-peppa-cyan font-rounded animate-wiggle">
            ?
          </span>
        </div>
      </div>
    </div>

<!-- 答案显示 -->
    <div
      v-if="showAnswer && (isCorrect || isIncorrect)"
      class="mt-6 text-center"
    >
      <p
        class="text-2xl md:text-3xl font-bold animate-slideIn font-rounded flex items-center justify-center gap-2"
        :class="isCorrect ? 'text-peppa-green' : 'text-peppa-orange'"
      >
        <Star v-if="isCorrect" :size="24" class="animate-spin-slow" />
        {{ isCorrect ? '答对了！太棒了！' : '答错了' }}
        <Heart v-if="isCorrect" :size="24" class="animate-wiggle" />
      </p>
      <p
        v-if="isIncorrect"
        class="text-xl md:text-2xl text-gray-600 mt-2 animate-slideIn font-rounded"
      >
        正确答案是：<span class="text-peppa-blue-dark font-bold">{{ question.answer }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(255, 183, 197, 0.3);
  min-width: 320px;
  max-width: 500px;
  width: 100%;
}

.question-card .text-5xl,
.question-card .text-6xl,
.question-card .text-7xl {
  min-height: 1em;
}
</style>
