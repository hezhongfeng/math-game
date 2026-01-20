<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { DIFFICULTY_LEVELS, DIFFICULTY_GROUPS } from '../config/difficulty'
import { DECORATIONS, CUTE_EMOJIS } from '../config/constants'
import { useStorage } from '../composables/useStorage'
import DifficultyCard from '../components/DifficultyCard.vue'

const router = useRouter()
const { getBestScore, getCompletedDifficulties } = useStorage()

const completedDifficulties = computed(() => getCompletedDifficulties())

function getDifficultyById(id) {
  return DIFFICULTY_LEVELS.find(d => d.id === id)
}

function goBack() {
  router.push('/')
}

function selectDifficulty(difficulty) {
  router.push(`/game/${difficulty.id}`)
}

function getDifficultyBestScore(difficultyId) {
  return getBestScore(difficultyId)
}

function isDifficultyLocked(difficulty) {
  // 第一关不锁定
  if (difficulty.id === 1) return false
  // 检查前一关是否完成
  const previousId = difficulty.id - 1
  return !completedDifficulties.value.includes(previousId)
}

const decorations = DECORATIONS.difficulty
const cuteEmojis = CUTE_EMOJIS

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="min-h-screen relative overflow-hidden p-4 md:p-6 pb-20">
    <!-- 装饰背景元素 -->
    <div v-for="(deco, index) in decorations" :key="index"
         :class="['absolute decoration', deco.class]"
         :style="{ fontSize: `${deco.size}px`, animationDelay: `${index * 0.3}s` }">
      {{ deco.emoji }}
    </div>

    <!-- 顶部导航 -->
    <div class="max-w-6xl mx-auto mb-8 relative z-10">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-peppa-blue-dark hover:text-peppa-blue font-medium transition-colors font-rounded px-4 py-2 bg-white/60 backdrop-blur-sm rounded-cute-lg shadow-cute hover:shadow-cute-lg hover:scale-105 transition-all"
      >
        <ArrowLeft :size="24" />
        返回主页
      </button>

      <div class="mt-6 text-center">
        <div class="inline-block mb-3">
          <span class="text-5xl animate-float">⚽</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-peppa-blue-dark font-rounded">选择难度</h1>
        <p class="text-peppa-blue-dark/80 mt-2 font-rounded">选择一个难度开始挑战吧！</p>
      </div>
    </div>
    
    <!-- 难度列表 -->
    <div class="max-w-6xl mx-auto space-y-8 relative z-10">
      <div v-for="(group, groupIndex) in DIFFICULTY_GROUPS" :key="group.name" class="difficulty-group">
        <h2 class="text-2xl font-bold text-peppa-blue-dark mb-4 flex items-center gap-2 font-rounded">
          <span class="inline-block w-4 h-4 rounded-cute"
                :style="{ backgroundColor: group.color }"></span>
          {{ group.name }}阶段
          <span class="text-3xl ml-2 animate-wiggle" style="animation-delay: 0.2s">⚽</span>
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DifficultyCard
            v-for="id in group.levels"
            :key="id"
            :difficulty="getDifficultyById(id)"
            :is-locked="isDifficultyLocked(getDifficultyById(id))"
            :is-completed="completedDifficulties.includes(id)"
            :best-score="getDifficultyBestScore(id)"
            @select="selectDifficulty"
          />
        </div>
      </div>
    </div>

    <!-- 底部小猪脚印装饰 -->
    <div class="absolute bottom-0 left-0 right-0 h-16 flex justify-around items-end opacity-30 pointer-events-none">
      <span class="text-2xl">⚽</span>
      <span class="text-2xl">⚽</span>
      <span class="text-2xl">⚽</span>
      <span class="text-2xl">⚽</span>
      <span class="text-2xl">⚽</span>
      <span class="text-2xl">⚽</span>
    </div>
  </div>
</template>

<style scoped>
.decoration {
  z-index: 0;
  opacity: 0.6;
}

.difficulty-group {
  animation: slideIn 0.5s ease-out;
}

.difficulty-group:nth-child(1) { animation-delay: 0.1s; }
.difficulty-group:nth-child(2) { animation-delay: 0.2s; }
.difficulty-group:nth-child(3) { animation-delay: 0.3s; }

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
