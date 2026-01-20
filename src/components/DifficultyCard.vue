<script setup>
import { computed } from 'vue'
import { Lock, Star, Trophy, Play } from 'lucide-vue-next'
import { CUTE_EMOJIS } from '../config/constants'
import { useSound } from '../composables/useSound'

const props = defineProps({
  difficulty: {
    type: Object,
    required: true
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  bestScore: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select'])
const { playSound } = useSound()

const stars = computed(() => {
  if (!props.bestScore) return []
  const accuracy = props.bestScore.accuracy
  if (accuracy === 100) return [1, 2, 3]
  if (accuracy >= 80) return [1, 2]
  if (accuracy >= 60) return [1]
  return []
})

const cuteEmoji = computed(() => CUTE_EMOJIS[props.difficulty.id % CUTE_EMOJIS.length])

function handleSelect() {
  if (!props.isLocked) {
    playSound('click')
    emit('select', props.difficulty)
  }
}
</script>

<template>
  <div
    class="difficulty-card relative overflow-hidden rounded-cute-2xl cursor-pointer transition-all duration-300 shadow-cute border-4"
    :class="[
      isLocked ? 'opacity-60 cursor-not-allowed grayscale bg-gray-50' : 'hover:scale-[1.02] hover:-translate-y-1 hover:shadow-cute-xl bg-white',
      isCompleted ? 'ring-4 ring-peppa-yellow' : ''
    ]"
    :style="{
      borderColor: isLocked ? undefined : `${difficulty.color}40`,
      background: isLocked ? 'linear-gradient(135deg, #fafafa, #f0f0f0)' : `linear-gradient(135deg, ${difficulty.color}08, white)`
    }"
    @click="handleSelect"
  >
    <!-- 顶部装饰条 -->
    <div 
      class="h-1.5 w-full"
      :style="{ backgroundColor: isLocked ? '#ccc' : difficulty.color }"
    ></div>

    <!-- 内容 -->
    <div class="relative p-4">
      <!-- 标题行 -->
      <div class="flex items-center gap-3 mb-3">
        <div class="w-12 h-12 rounded-cute-xl flex items-center justify-center text-2xl shadow-cute"
             :style="{ backgroundColor: isLocked ? '#e8e8e8' : `${difficulty.color}20` }">
          {{ cuteEmoji }}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold font-rounded truncate"
              :style="{ color: isLocked ? '#999' : difficulty.color }">
            {{ difficulty.name }}
          </h3>
          <p class="text-gray-500 text-xs font-rounded truncate">{{ difficulty.level }}</p>
        </div>
        <div v-if="isLocked" class="w-9 h-9 bg-gray-200 rounded-cute-full flex items-center justify-center flex-shrink-0 shadow-cute">
          <Lock :size="18" class="text-gray-500" />
        </div>
        <div v-else-if="isCompleted" class="w-9 h-9 rounded-cute-full flex items-center justify-center flex-shrink-0 shadow-cute"
             :style="{ backgroundColor: '#FFF9C4' }">
          <Trophy :size="18" class="text-peppa-yellow" />
        </div>
      </div>

      <!-- 描述 -->
      <p class="text-gray-700 font-medium font-rounded text-sm mb-3 line-clamp-2">{{ difficulty.description }}</p>

      <!-- 标签行 -->
      <div class="flex flex-wrap items-center gap-2 mb-3">
        <span class="px-2.5 py-1 rounded-cute-full text-xs font-medium"
              :style="{ backgroundColor: `${difficulty.color}20`, color: difficulty.color }">
          {{ difficulty.questionCount }}题
        </span>
        <span v-if="isCompleted && stars.length > 0" class="flex items-center gap-1 px-2.5 py-1 rounded-cute-full text-xs font-medium bg-peppa-yellow/20 text-peppa-yellow-dark">
          <Star :size="12" :fill="stars.length === 3 ? 'currentColor' : 'none'" />
          {{ stars.length }}星
        </span>
      </div>

      <!-- 成绩/状态 -->
      <div v-if="bestScore" class="pt-2.5 border-t-2 border-dashed rounded-b-cute-lg -mx-4 px-4 pb-1"
           :style="{ borderColor: `${difficulty.color}30`, backgroundColor: `${difficulty.color}08` }">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-gray-600 text-xs font-rounded">最佳成绩</span>
            <div class="text-gray-500 text-xs">{{ bestScore.correctCount }}/{{ bestScore.totalCount }}</div>
          </div>
          <div class="text-right">
            <span class="text-gray-600 text-xs font-rounded">正确率</span>
            <div class="font-bold text-lg leading-none"
                 :style="{ color: difficulty.color }">
              {{ bestScore.accuracy }}%
            </div>
          </div>
        </div>
        <!-- 进度条 -->
        <div class="mt-2 h-1.5 bg-gray-200 rounded-cute-full overflow-hidden">
          <div 
            class="h-full rounded-cute-full transition-all duration-500"
            :style="{ 
              width: `${bestScore.accuracy}%`,
              backgroundColor: bestScore.accuracy >= 80 ? '#4CAF50' : bestScore.accuracy >= 60 ? '#FFC107' : '#FF9800'
            }"
          ></div>
        </div>
      </div>

      <!-- 未挑战状态 -->
      <div v-else-if="!isLocked" class="pt-2.5 border-t-2 border-dashed rounded-b-cute-lg -mx-4 px-4 pb-1"
           :style="{ borderColor: `${difficulty.color}30` }">
        <div class="flex items-center justify-center gap-1.5 text-gray-400">
          <Play :size="14" />
          <span class="font-rounded text-xs">还没挑战过</span>
        </div>
      </div>
    </div>

    <!-- 完成徽章 -->
    <div v-if="isCompleted && !isLocked" 
         class="absolute top-1.5 right-1.5 w-7 h-7 bg-peppa-yellow rounded-cute-full flex items-center justify-center shadow-cute text-sm"
         :style="{ transform: 'rotate(12deg)' }">
      ✓
    </div>
  </div>
</template>

<style scoped>
.difficulty-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

