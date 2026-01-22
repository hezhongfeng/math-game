<script setup>
import { computed } from 'vue'
import { Clock, CheckCircle, TrendingUp, Star } from 'lucide-vue-next'

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
  <div class="score-board bg-white rounded-cute-xl shadow-cute p-4 border-2 border-peppa-blue/20 animate-fade-in-up">
    <!-- 顶部：进度条和统计 -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold text-peppa-blue-dark font-rounded">进度</span>
        <span class="text-sm font-bold text-peppa-blue-dark font-rounded">{{ currentIndex }} / {{ totalQuestions }}</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- 数据统计网格 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <!-- 得分 -->
      <div class="stat-card bg-gradient-to-br from-peppa-blue/10 to-peppa-blue-dark/10 border-peppa-blue/30 hover:shadow-cute-lg transition-shadow">
        <Star :size="22" class="text-peppa-blue mx-auto mb-1 animate-float" />
        <p class="text-2xl font-bold text-peppa-blue-dark font-rounded">{{ score }}</p>
        <p class="text-xs text-gray-600 font-rounded">得分</p>
      </div>

      <!-- 正确数 -->
      <div class="stat-card bg-gradient-to-br from-peppa-green/10 to-peppa-green-dark/10 border-peppa-green/30 hover:shadow-cute-lg transition-shadow">
        <CheckCircle :size="22" class="text-peppa-green mx-auto mb-1 animate-float" style="animation-delay: 0.1s" />
        <p class="text-2xl font-bold text-peppa-green-dark font-rounded">{{ correctCount }}</p>
        <p class="text-xs text-gray-600 font-rounded">正确</p>
      </div>

      <!-- 用时 -->
      <div class="stat-card bg-gradient-to-br from-peppa-cyan/10 to-peppa-cyan-dark/10 border-peppa-cyan/30 hover:shadow-cute-lg transition-shadow">
        <Clock :size="22" class="text-peppa-cyan mx-auto mb-1 animate-float" style="animation-delay: 0.2s" />
        <p class="text-xl font-bold text-peppa-cyan-dark font-rounded">{{ formatTime }}</p>
        <p class="text-xs text-gray-600 font-rounded">用时</p>
      </div>

      <!-- 正确率 -->
      <div class="stat-card bg-gradient-to-br from-peppa-yellow/20 to-peppa-yellow-dark/20 border-peppa-yellow/30 hover:shadow-cute-lg transition-shadow">
        <TrendingUp :size="22" class="text-peppa-yellow-dark mx-auto mb-1 animate-float" style="animation-delay: 0.3s" />
        <p class="text-2xl font-bold text-peppa-yellow-dark font-rounded">{{ accuracy }}%</p>
        <p class="text-xs text-gray-600 font-rounded">正确率</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  background: linear-gradient(135deg, #ffffff 0%, #F5F9FF 100%);
  box-shadow: 
    0 6px 20px rgba(74, 144, 226, 0.12),
    0 3px 10px rgba(74, 144, 226, 0.08);
}

.stat-card {
  @apply rounded-cute-lg p-3 text-center border-2 transition-all duration-300;
}

.stat-card:hover {
  transform: translateY(-2px);
}
</style>

