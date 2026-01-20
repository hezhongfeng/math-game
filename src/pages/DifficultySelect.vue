<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy, Star } from 'lucide-vue-next'
import { DIFFICULTY_LEVELS, DIFFICULTY_GROUPS } from '../config/difficulty'
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

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="page-container">
    <!-- 顶部导航 -->
    <header class="header">
      <button @click="goBack" class="back-btn">
        <ArrowLeft :size="24" />
        <span>返回</span>
      </button>
      
      <h1 class="title">选择难度</h1>
      
      <div class="progress-badge">
        <Trophy :size="18" />
        <span>{{ completedCount }}/{{ DIFFICULTY_GROUPS.length * 3 }}</span>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main-content">
      <div v-for="group in DIFFICULTY_GROUPS" :key="group.name" class="section">
        <!-- 阶段标题 -->
        <div class="section-header">
          <span class="section-indicator" :style="{ backgroundColor: group.color }"></span>
          <h2 class="section-title">{{ group.name }}阶段</h2>
          <span class="section-count">{{ group.levels.length }}关</span>
        </div>

        <!-- 难度卡片列表 -->
        <div class="card-list">
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
    </main>

    <!-- 底部提示 -->
    <footer class="footer">
      <p>💡 从第一关开始，依次解锁更高难度</p>
    </footer>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f0f7ff;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #4A90E2;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.back-btn:active {
  background: #f0f7ff;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  font-family: inherit;
}

.progress-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #d97706;
  background: #fef3c7;
  border-radius: 20px;
}

.main-content {
  padding: 18px;
  padding-bottom: 100px;
}

.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.section-indicator {
  width: 4px;
  height: 22px;
  border-radius: 2px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  font-family: inherit;
}

.section-count {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 18px;
  background: white;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.footer p {
  font-size: 13px;
  color: #94a3b8;
  font-family: inherit;
}
</style>
