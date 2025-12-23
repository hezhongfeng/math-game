<script setup>
import { computed } from 'vue'
import { Target, Clock, CheckCircle, TrendingUp } from 'lucide-vue-next'

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
  <div class="score-board bg-white rounded-2xl shadow-lg p-4 md:p-6">
    <!-- 顶部：进度条和统计 -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-600">进度</span>
        <span class="text-sm font-bold text-indigo-600">{{ currentIndex }} / {{ totalQuestions }}</span>
      </div>
      <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
    
    <!-- 数据统计网格 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- 得分 -->
      <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 text-center">
        <Target :size="24" class="text-indigo-500 mx-auto mb-2" />
        <p class="text-2xl md:text-3xl font-bold text-indigo-600">{{ score }}</p>
        <p class="text-xs text-gray-500 mt-1">得分</p>
      </div>
      
      <!-- 正确数 -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center">
        <CheckCircle :size="24" class="text-green-500 mx-auto mb-2" />
        <p class="text-2xl md:text-3xl font-bold text-green-600">{{ correctCount }}</p>
        <p class="text-xs text-gray-500 mt-1">正确</p>
      </div>
      
      <!-- 用时 -->
      <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 text-center">
        <Clock :size="24" class="text-blue-500 mx-auto mb-2" />
        <p class="text-xl md:text-2xl font-bold text-blue-600">{{ formatTime }}</p>
        <p class="text-xs text-gray-500 mt-1">用时</p>
      </div>
      
      <!-- 正确率 -->
      <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 text-center">
        <TrendingUp :size="24" class="text-orange-500 mx-auto mb-2" />
        <p class="text-2xl md:text-3xl font-bold text-orange-600">{{ accuracy }}%</p>
        <p class="text-xs text-gray-500 mt-1">正确率</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}
</style>
