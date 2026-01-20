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
  <div class="min-h-screen p-4 md:p-6 pb-20">
    <!-- 顶部导航 -->
    <div class="max-w-6xl mx-auto mb-8">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-peppa-blue-dark hover:text-peppa-blue font-medium transition-colors font-rounded px-4 py-2 bg-white/80 backdrop-blur-sm rounded-cute-lg shadow-cute hover:shadow-cute-lg active:scale-95 transition-all"
      >
        <ArrowLeft :size="24" />
        返回主页
      </button>

      <div class="mt-6 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-peppa-blue-dark font-rounded">选择难度</h1>
        <p class="text-peppa-blue-dark/80 mt-2 font-rounded">选择一个难度开始挑战吧！</p>
      </div>
    </div>

    <!-- 难度列表 -->
    <div class="max-w-6xl mx-auto space-y-8">
      <div v-for="group in DIFFICULTY_GROUPS" :key="group.name" class="difficulty-group">
        <h2 class="text-2xl font-bold text-peppa-blue-dark mb-4 flex items-center gap-2 font-rounded">
          <span class="inline-block w-4 h-4 rounded-cute"
                :style="{ backgroundColor: group.color }"></span>
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
  animation: slideIn 0.3s ease-out;
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
