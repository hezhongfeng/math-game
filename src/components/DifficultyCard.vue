<script setup>
import { computed } from 'vue'
import { Lock, Star, Trophy } from 'lucide-vue-next'

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

const stars = computed(() => {
  if (!props.bestScore) return []
  const accuracy = props.bestScore.accuracy
  if (accuracy === 100) return [1, 2, 3]
  if (accuracy >= 80) return [1, 2]
  if (accuracy >= 60) return [1]
  return []
})
</script>

<template>
  <div 
    class="difficulty-card relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl"
    :class="[
      difficulty.color,
      isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 hover:-translate-y-1',
      isCompleted ? 'ring-4 ring-yellow-400' : ''
    ]"
    @click="!isLocked && $emit('select', difficulty)"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 opacity-20">
      <div 
        class="absolute -right-8 -top-8 w-24 h-24 bg-white rounded-full"
        v-for="i in 3"
        :key="i"
        :style="{ transform: `translate(${i * 20}px, ${i * 20}px)` }"
      ></div>
    </div>
    
    <!-- 内容 -->
    <div class="relative p-6">
      <!-- 标题 -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-2xl font-bold text-white drop-shadow-lg">{{ difficulty.name }}</h3>
          <p class="text-white/80 text-sm">{{ difficulty.level }}</p>
        </div>
        <div v-if="isLocked" class="p-2 bg-white/20 rounded-full">
          <Lock :size="24" class="text-white" />
        </div>
      </div>
      
      <!-- 描述 -->
      <p class="text-white font-medium text-lg mb-4">{{ difficulty.description }}</p>
      
      <!-- 题目数量 -->
      <div class="flex items-center gap-2 text-white/90 text-sm mb-4">
        <Trophy :size="16" />
        <span>{{ difficulty.questionCount }} 道题目</span>
      </div>
      
      <!-- 星级评分 -->
      <div v-if="isCompleted && stars.length > 0" class="flex items-center gap-1">
        <Star 
          v-for="n in 3" 
          :key="n"
          :size="20"
          :fill="n <= stars.length ? 'currentColor' : 'none'"
          class="text-yellow-300"
        />
      </div>
      
      <!-- 最佳成绩 -->
      <div v-if="bestScore" class="mt-3 pt-3 border-t border-white/30">
        <div class="flex items-center justify-between text-white/90 text-sm">
          <span>最佳成绩</span>
          <span class="font-bold">{{ bestScore.correctCount }}/{{ bestScore.totalCount }}</span>
        </div>
        <div class="flex items-center justify-between text-white/90 text-sm">
          <span>正确率</span>
          <span class="font-bold">{{ bestScore.accuracy }}%</span>
        </div>
      </div>
      
      <!-- 锁定提示 -->
      <div v-if="isLocked" class="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
        <span class="text-white font-bold text-xl">完成上一关解锁</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.difficulty-card {
  transform-style: preserve-3d;
  perspective: 1000px;
}

.difficulty-card:hover:not(.opacity-50) {
  animation: float 0.6s ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1.05);
  }
  50% {
    transform: translateY(-5px) scale(1.05);
  }
}
</style>
