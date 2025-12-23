<script setup>
import { computed } from 'vue'
import { Volume2 } from 'lucide-vue-next'

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

const emit = defineEmits(['speak'])

const isCorrect = computed(() => props.question.isCorrect === true)
const isIncorrect = computed(() => props.question.isCorrect === false)

function handleSpeak() {
  emit('speak', props.question)
}
</script>

<template>
  <div 
    class="question-card p-8 bg-white rounded-3xl shadow-lg animate-scaleIn"
    :class="{
      'border-4 border-green-400': isCorrect,
      'border-4 border-red-400': isIncorrect,
      'border-4 border-transparent': !isCorrect && !isIncorrect
    }"
  >
    <!-- 题目内容 -->
    <div class="text-center">
      <div class="flex items-center justify-center gap-4 mb-4">
        <span 
          class="text-6xl md:text-8xl font-bold text-indigo-600"
          :class="{ 'animate-bounce': !question.isCorrect }"
        >
          {{ question.operand1 }}
        </span>
        <span class="text-5xl md:text-7xl font-bold text-gray-600">
          {{ question.operator }}
        </span>
        <span class="text-6xl md:text-8xl font-bold text-indigo-600">
          {{ question.operand2 }}
        </span>
        <span class="text-5xl md:text-7xl font-bold text-gray-600">
          =
        </span>
        <span class="text-6xl md:text-8xl font-bold text-gray-400">
          ?
        </span>
      </div>
      
      <!-- 语音按钮 -->
      <button 
        @click="handleSpeak"
        class="mt-4 p-3 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-all active:scale-95"
        :class="{ 'animate-pulse': showAnswer }"
      >
        <Volume2 :size="28" />
      </button>
    </div>
    
    <!-- 答案显示 -->
    <div 
      v-if="showAnswer && (isCorrect || isIncorrect)"
      class="mt-6 text-center"
    >
      <p 
        class="text-3xl font-bold animate-slideIn"
        :class="isCorrect ? 'text-green-500' : 'text-red-500'"
      >
        {{ isCorrect ? '答对了！' : '答错了' }}
      </p>
      <p 
        v-if="isIncorrect"
        class="text-2xl text-gray-600 mt-2 animate-slideIn"
      >
        正确答案是：{{ question.answer }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}
</style>
