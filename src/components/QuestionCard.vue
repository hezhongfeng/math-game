<script setup>
import { computed } from 'vue'
import { Star, Heart, Check } from 'lucide-vue-next'

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

defineEmits(['submit'])

const isCorrect = computed(() => props.question.isCorrect === true)
const isIncorrect = computed(() => props.question.isCorrect === false)
const shouldShowInput = computed(() => !props.showAnswer && !isCorrect.value && !isIncorrect.value)
</script>

<template>
  <div
    class="question-card p-6 md:p-8 rounded-cute-xl shadow-cute-lg border-4"
    :class="{
      'bg-white border-peppa-green': isCorrect,
      'bg-white border-peppa-orange': isIncorrect,
      'bg-white border-peppa-blue-dark': !isCorrect && !isIncorrect
    }"
  >
    <!-- 题目内容 -->
    <div class="text-center">
      <div class="bg-peppa-blue-light/30 rounded-cute-lg p-6 mb-4">
        <div class="flex items-center justify-center gap-3 md:gap-4">
          <span class="text-6xl md:text-8xl font-bold text-peppa-blue-dark font-rounded">
            {{ question.operand1 }}
          </span>
          <span class="text-5xl md:text-7xl font-bold text-peppa-blue-dark/70 font-rounded">
            {{ question.operator }}
          </span>
          <span class="text-6xl md:text-8xl font-bold text-peppa-blue-dark font-rounded">
            {{ question.operand2 }}
          </span>
          <span class="text-5xl md:text-7xl font-bold text-peppa-blue-dark/70 font-rounded">
            =
          </span>
          <span
            class="text-6xl md:text-8xl font-bold font-rounded min-w-[3ch] text-center inline-block"
            :class="shouldShowInput ? 'text-peppa-cyan' : (isCorrect ? 'text-peppa-green' : isIncorrect ? 'text-peppa-orange' : 'text-peppa-cyan')"
          >
            {{ shouldShowInput ? (userAnswer || '?') : (showAnswer ? question.answer : '?') }}
          </span>
        </div>
      </div>

      <!-- 答案输入提示 -->
      <div v-if="shouldShowInput" class="mt-4">
        <p class="text-sm text-peppa-blue-dark/60 font-rounded">输入答案，点击确认按钮提交</p>
      </div>

      <!-- 快速确认按钮 -->
      <div v-if="shouldShowInput" class="mt-4">
        <button
          @click="$emit('submit')"
          class="w-full bg-gradient-to-r from-peppa-green to-[#388E3C] hover:from-[#66BB6A] hover:to-[#388E3C] text-white font-bold py-4 px-6 rounded-cute-lg shadow-cute hover:shadow-cute-lg active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 font-rounded text-lg"
        >
          <Check :size="24" />
          确认答案
        </button>
      </div>
    </div>

 <!-- 答案反馈 -->
    <div
      v-if="showAnswer && (isCorrect || isIncorrect)"
      class="mt-6 text-center"
    >
      <p
        class="text-2xl md:text-3xl font-bold font-rounded flex items-center justify-center gap-2"
        :class="isCorrect ? 'text-peppa-green' : 'text-peppa-orange'"
      >
        <Star v-if="isCorrect" :size="24" />
        {{ isCorrect ? '答对了！太棒了！' : '答错了' }}
        <Heart v-if="isCorrect" :size="24" />
      </p>
      <p
        v-if="isIncorrect"
        class="text-xl md:text-2xl text-gray-600 mt-2 font-rounded"
      >
        正确答案是：<span class="text-peppa-blue-dark font-bold">{{ question.answer }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  background: #ffffff;
  min-width: 300px;
  max-width: 600px;
  width: 100%;
}
</style>

