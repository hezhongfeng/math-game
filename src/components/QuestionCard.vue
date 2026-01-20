<script setup>
import { computed } from 'vue'
import { Check, X, Sparkles } from 'lucide-vue-next'

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
const shouldShowFeedback = computed(() => props.showAnswer && (isCorrect.value || isIncorrect.value) && props.question.userAnswer !== null)
</script>

<template>
  <div
    class="question-card p-5 rounded-cute-xl shadow-cute border-2 transition-all duration-300"
    :class="{
      'bg-white border-peppa-green': isCorrect,
      'bg-white border-peppa-orange': isIncorrect,
      'bg-white border-peppa-blue/30': !isCorrect && !isIncorrect
    }"
  >
    <!-- 题目内容 -->
    <div class="text-center">
      <div class="bg-peppa-blue/10 rounded-cute-lg p-4 mb-4 border-2 border-peppa-blue/20">
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
            class="text-5xl md:text-7xl font-bold font-rounded min-w-[3ch] text-center inline-block transition-all duration-300"
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

      <!-- 答案输入提示 -->
      <Transition name="fade" mode="out-in">
        <div v-if="!shouldShowFeedback" key="input" class="mt-3">
          <p class="text-sm text-peppa-blue-dark/70 font-rounded font-medium">输入答案，点击确认提交</p>
        </div>

        <!-- 正确反馈 -->
        <div v-else-if="isCorrect" key="correct" class="mt-4">
          <div class="flex justify-center mb-3">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-peppa-green to-peppa-green-dark flex items-center justify-center shadow-cute">
              <Check :size="32" class="text-white" />
            </div>
          </div>
          <p class="text-xl font-bold text-peppa-green font-rounded flex items-center justify-center gap-2">
            <Sparkles :size="20" class="animate-spin-slow" />
            太棒了！
            <Sparkles :size="20" class="animate-spin-slow" style="animation-delay: 0.3s" />
          </p>
        </div>

        <!-- 错误反馈 -->
        <div v-else key="wrong" class="mt-4">
          <div class="flex justify-center mb-3">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-peppa-orange to-peppa-orange-dark flex items-center justify-center shadow-cute">
              <X :size="32" class="text-white" />
            </div>
          </div>
          <p class="text-lg font-bold text-peppa-orange font-rounded">
            再接再厉！
          </p>
          <p class="text-sm text-gray-600 mt-1 font-rounded">
            正确答案是：<span class="text-peppa-blue-dark font-bold">{{ question.answer }}</span>
          </p>
        </div>
      </Transition>

      <!-- 快速确认按钮 -->
      <Transition name="fade" mode="out-in">
        <div v-if="!shouldShowFeedback" key="button" class="mt-4">
          <button
            @click="$emit('submit')"
            class="btn-success w-full py-4 px-6 rounded-cute-lg flex items-center justify-center gap-2 font-rounded text-lg"
          >
            <Check :size="22" />
            确认答案
          </button>
        </div>
      </Transition>
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
