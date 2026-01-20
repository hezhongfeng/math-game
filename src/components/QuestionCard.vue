<script setup>
import { computed } from 'vue'
import { Star, Check, X, Sparkles } from 'lucide-vue-next'

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
const shouldShowInput = computed(() => !shouldShowFeedback.value)
</script>

<template>
  <div
    class="question-card p-8 md:p-10 rounded-cute-2xl shadow-cute-xl border-5 transition-all duration-300"
    :class="{
      'bg-white border-peppa-green animate-correct-glow': isCorrect,
      'bg-white border-peppa-orange animate-wrong-glow': isIncorrect,
      'bg-white border-peppa-blue-dark': !isCorrect && !isIncorrect
    }"
  >
    <!-- 题目内容 -->
    <div class="text-center">
      <div class="bg-peppa-blue-light/40 rounded-cute-2xl p-8 mb-6 border-3 border-peppa-blue-light/50">
        <div class="flex items-center justify-center gap-4 md:gap-6">
          <span class="text-7xl md:text-9xl font-bold text-peppa-blue-dark font-rounded">
            {{ question.operand1 }}
          </span>
          <span class="text-6xl md:text-8xl font-bold text-peppa-blue-dark/80 font-rounded">
            {{ question.operator }}
          </span>
          <span class="text-7xl md:text-9xl font-bold text-peppa-blue-dark font-rounded">
            {{ question.operand2 }}
          </span>
          <span class="text-6xl md:text-8xl font-bold text-peppa-blue-dark/80 font-rounded">
            =
          </span>
          <span
            class="text-7xl md:text-9xl font-bold font-rounded min-w-[4ch] text-center inline-block transition-all duration-300 px-4"
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
        <div v-if="!shouldShowFeedback" key="input" class="mt-6">
          <p class="text-base text-peppa-blue-dark/70 font-rounded font-medium">输入答案，点击确认按钮提交</p>
        </div>

        <!-- 正确反馈 -->
        <div v-else-if="isCorrect" key="correct" class="mt-8">
          <!-- 正确图标和星星特效 -->
          <div class="flex justify-center mb-6 relative">
            <!-- 星星特效 -->
            <div class="absolute inset-0 overflow-hidden">
              <Star v-for="i in 5" :key="i" :size="28" class="text-peppa-yellow absolute animate-star-pulse" :style="{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.2}s`
              }" />
            </div>

            <!-- 主图标 -->
            <div class="relative z-10">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-36 h-36 rounded-full bg-peppa-green/20 animate-ping"></div>
              </div>
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-peppa-green to-[#388E3C] flex items-center justify-center shadow-xl animate-scale-in">
                <Check :size="48" class="text-white" />
              </div>
            </div>
          </div>

          <!-- 庆祝文字 -->
          <p class="text-4xl md:text-5xl font-bold text-peppa-green font-rounded animate-slide-up flex items-center justify-center gap-3">
            <Sparkles :size="32" class="animate-spin-slow" />
            太棒了！答对了！
            <Sparkles :size="32" class="animate-spin-slow" style="animation-delay: 0.5s" />
          </p>
        </div>

        <!-- 错误反馈 -->
        <div v-else key="wrong" class="mt-8">
          <!-- 错误图标 -->
          <div class="flex justify-center mb-6">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-peppa-orange to-[#E65100] flex items-center justify-center shadow-xl animate-scale-in">
              <X :size="48" class="text-white" />
            </div>
          </div>

          <!-- 错误文字 -->
          <p class="text-3xl md:text-4xl font-bold text-peppa-orange font-rounded animate-slide-up">
            答错了，继续努力！
          </p>
          <p class="text-xl text-gray-600 mt-3 font-rounded">
            正确答案是：<span class="text-peppa-blue-dark font-bold text-2xl">{{ question.answer }}</span>
          </p>
        </div>
      </Transition>

      <!-- 快速确认按钮 -->
      <Transition name="fade" mode="out-in">
        <div v-if="!shouldShowFeedback" key="button" class="mt-6">
          <button
            @click="$emit('submit')"
            class="w-full bg-gradient-to-r from-peppa-green to-[#388E3C] hover:from-[#66BB6A] hover:to-[#388E3C] text-white font-bold py-5 px-8 rounded-cute-2xl shadow-cute hover:shadow-cute-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 font-rounded text-xl"
          >
            <Check :size="28" />
            确认答案
          </button>
        </div>
      </Transition>
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

/* 正确答案发光动画 */
@keyframes correctGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(76, 175, 80, 0.8), 0 0 80px rgba(76, 175, 80, 0.4);
  }
}

/* 错误答案闪烁动画 */
@keyframes wrongGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 152, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 152, 0, 0.8), 0 0 80px rgba(255, 152, 0, 0.4);
  }
}

/* 答案弹出动画 */
@keyframes answerPop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 答案震动动画 */
@keyframes answerShake {
  0%, 100% {
    transform: translateX(0) scale(1);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-8px) scale(1.1);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(8px) scale(1.1);
  }
}

/* 脉冲动画 */
@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 星星脉冲动画 */
@keyframes starPulse {
  0%, 100% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 1;
  }
}

/* 从下滑入动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 缩放进入动画 */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 应用动画类 */
.animate-correct-glow {
  animation: correctGlow 1s ease-in-out;
}

.animate-wrong-glow {
  animation: wrongGlow 0.5s ease-in-out;
}

.animate-answer-pop {
  animation: answerPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-answer-shake {
  animation: answerShake 0.6s ease-in-out;
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

.animate-star-pulse {
  animation: starPulse 1.5s ease-in-out infinite;
}
</style>
