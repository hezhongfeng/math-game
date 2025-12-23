<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { DIFFICULTY_LEVELS, DIFFICULTY_GROUPS } from '../config/difficulty'
import { useStorage } from '../composables/useStorage'
import DifficultyCard from '../components/DifficultyCard.vue'

const router = useRouter()
const { getBestScore, getCompletedDifficulties } = useStorage()

const completedDifficulties = computed(() => getCompletedDifficulties())

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

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="min-h-screen p-4 md:p-6 pb-20">
    <!-- 顶部导航 -->
    <div class="max-w-6xl mx-auto mb-8">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
      >
        <ArrowLeft :size="24" />
        返回主页
      </button>
      
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mt-4">选择难度</h1>
      <p class="text-gray-600 mt-2">选择一个难度开始挑战</p>
    </div>
    
    <!-- 难度列表 -->
    <div class="max-w-6xl mx-auto space-y-8">
      <div v-for="group in DIFFICULTY_GROUPS" :key="group.name" class="difficulty-group">
        <h2 class="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full" :class="`bg-${group.color}-500`"></span>
          {{ group.name }}阶段
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
  </div>
</template>

<style scoped>
.difficulty-group {
  animation: slideIn 0.5s ease-out;
}

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
