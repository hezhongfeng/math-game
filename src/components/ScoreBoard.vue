<script setup>
import { computed } from 'vue'
import { Target, Clock, CheckCircle, TrendingUp, Star } from 'lucide-vue-next'

const props = defineProps({
  score: {
    type: Number,
    default: 0
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  correctCount: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  }
})

const progress = computed(() => {
  if (props.totalQuestions === 0) return 0
  return Math.round((props.currentIndex / props.totalQuestions) * 100)
})

const formatTime = computed(() => {
  const minutes = Math.floor(props.duration / 60)
  const seconds = props.duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <div class="score-board bg-white rounded-cute-2xl shadow-cute-lg p-5 md:p-6 border-2 md:border-3 border-peppa-blue-light/40">
    <!-- 顶部：进度条和统计 -->
    <div class="mb-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-base font-semibold text-peppa-blue-dark font-rounded">进度</span>
        <span class="text-base font-bold text-peppa-blue-dark font-rounded">{{ currentIndex }} / {{ totalQuestions }}</span>
      </div>
      <div class="h-4 bg-peppa-blue-light/30 rounded-cute-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-peppa-blue to-peppa-blue-dark rounded-cute-full transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- 数据统计网格 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- 得分 -->
      <div class="bg-gradient-to-br from-peppa-blue/20 to-peppa-blue-dark/20 rounded-cute-xl p-4 text-center border-2 border-peppa-blue-light/40">
        <Star :size="24" class="text-peppa-blue mx-auto mb-2" />
        <p class="text-2xl md:text-3xl font-bold text-peppa-blue-dark font-rounded">{{ score }}</p>
        <p class="text-sm text-gray-600 mt-1 font-semibold font-rounded">得分</p>
      </div>

      <!-- 正确数 -->
      <div class="bg-gradient-to-br from-peppa-green/20 to-[#388E3C]/20 rounded-cute-xl p-4 text-center border-2 border-peppa-green/40">
        <CheckCircle :size="24" class="text-peppa-green mx-auto mb-2" />
        <p class="text-2xl md:text-3xl font-bold text-peppa-green-dark font-rounded">{{ correctCount }}</p>
        <p class="text-sm text-gray-600 mt-1 font-semibold font-rounded">正确</p>
      </div>

      <!-- 用时 -->
      <div class="bg-gradient-to-br from-peppa-cyan/20 to-[#0097A7]/20 rounded-cute-xl p-4 text-center border-2 border-peppa-cyan/40">
        <Clock :size="24" class="text-peppa-cyan mx-auto mb-2" />
        <p class="text-xl md:text-2xl font-bold text-peppa-cyan-dark font-rounded">{{ formatTime }}</p>
        <p class="text-sm text-gray-600 mt-1 font-semibold font-rounded">用时</p>
      </div>

      <!-- 正确率 -->
      <div class="bg-gradient-to-br from-peppa-yellow/20 to-peppa-yellow-dark/20 rounded-cute-xl p-4 text-center border-2 border-peppa-yellow/40">
        <TrendingUp :size="24" class="text-peppa-yellow-dark mx-auto mb-2" />
        <p class="text-2xl md:text-3xl font-bold text-peppa-yellow-dark font-rounded">{{ accuracy }}%</p>
        <p class="text-sm text-gray-600 mt-1 font-semibold font-rounded">正确率</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  background: linear-gradient(135deg, #ffffff 0%, #E3F2FD 100%);
}
</style>

