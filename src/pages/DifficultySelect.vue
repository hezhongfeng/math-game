<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy, Star } from 'lucide-vue-next'
import { DIFFICULTY_LEVELS, DIFFICULTY_GROUPS } from '../config/difficulty'
import { CUTE_EMOJIS } from '../config/constants'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import DifficultyCard from '../components/DifficultyCard.vue'

const router = useRouter()
const { getBestScore, getCompletedDifficulties, getAllBestScores } = useStorage()
const { playSound } = useSound()

const completedDifficulties = computed(() => getCompletedDifficulties())
const allBestScores = computed(() => getAllBestScores())
const completedCount = computed(() => Object.keys(allBestScores.value).length)

function getDifficultyById(id) {
  return DIFFICULTY_LEVELS.find(d => d.id === id)
}

function goBack() {
  playSound('click')
  router.push('/')
}

function selectDifficulty(difficulty) {
  playSound('click')
  router.push(`/game/${difficulty.id}`)
}

function getDifficultyBestScore(difficultyId) {
  return getBestScore(difficultyId)
}

function isDifficultyLocked(difficulty) {
  if (difficulty.id === 1) return false
  const previousId = difficulty.id - 1
  return !completedDifficulties.value.includes(previousId)
}

const cuteEmojis = CUTE_EMOJIS

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-peppa-bg via-white to-peppa-bg">
    <!-- 顶部栏 -->
    <div class="sticky top-0 z-20 bg-white border-b border-peppa-blue/10 shadow-sm">
      <div class="flex items-center justify-between px-4 py-3">
        <button
          @click="goBack"
          class="flex items-center gap-1.5 text-peppa-blue-dark hover:text-peppa-blue font-medium font-rounded text-sm active:scale-95 transition-transform"
        >
          <ArrowLeft :size="20" />
          返回
        </button>
        
        <h1 class="text-lg font-bold font-rounded" style="color: #4A90E2;">选择难度</h1>
        
        <div class="flex items-center gap-1.5 text-peppa-yellow">
          <Trophy :size="18" />
          <span class="text-sm font-bold">{{ completedCount }}/{{ DIFFICULTY_GROUPS.length * 3 }}</span>
        </div>
      </div>
    </div>

    <!-- 难度列表 -->
    <div class="px-3 py-4 space-y-5">
      <div v-for="(group, groupIndex) in DIFFICULTY_GROUPS" :key="group.name">
        <!-- 阶段标题 -->
        <div class="flex items-center gap-2 mb-2">
          <span 
            class="w-1.5 h-6 rounded-full shadow-sm"
            :style="{ backgroundColor: group.color }"
          ></span>
          <h2 
            class="text-lg font-bold font-rounded"
            :style="{ color: group.color }"
          >
            {{ group.name }}阶段
          </h2>
          <span class="text-xs text-gray-400 font-rounded">({{ group.levels.length }}关)</span>
        </div>

        <!-- 难度卡片列表 -->
        <div class="space-y-2">
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

    <!-- 底部提示 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-peppa-blue/10 px-4 py-3 safe-area-bottom">
      <p class="text-center text-xs text-gray-400 font-rounded">
        从第一关开始，依次解锁更高难度
      </p>
    </div>
  </div>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
