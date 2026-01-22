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
  <div class="page">
    <!-- 装饰星星 -->
    <div class="stars">
      <span class="star star-1">✨</span>
      <span class="star star-2">⭐</span>
      <span class="star star-3">✨</span>
      <span class="star star-4">⭐</span>
    </div>

    <!-- 顶部导航 -->
    <header class="header">
      <button @click="goBack" class="back-btn">
        <ArrowLeft :size="24" />
        <span>返回</span>
      </button>
      
      <h1 class="title bg-gradient-to-r from-peppa-blue to-peppa-blue-dark bg-clip-text text-transparent">
        选择难度
      </h1>
      
      <div class="progress-badge">
        <Trophy :size="18" />
        <span>{{ completedCount }}/{{ DIFFICULTY_GROUPS.length * 3 }}</span>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main-content">
      <div v-for="(group, groupIndex) in DIFFICULTY_GROUPS" :key="group.name" class="section">
        <!-- 阶段标题 -->
        <div class="section-header animate-fade-in-up" :style="{ animationDelay: `${groupIndex * 100}ms` }">
          <span class="section-indicator" :style="{ backgroundColor: group.color }"></span>
          <h2 class="section-title">{{ group.name }}阶段</h2>
          <span class="section-count">{{ group.levels.length }}关</span>
        </div>

        <!-- 难度卡片列表 -->
        <div class="card-list">
          <DifficultyCard
            v-for="(id, cardIndex) in group.levels"
            :key="id"
            :difficulty="getDifficultyById(id)"
            :is-locked="isDifficultyLocked(getDifficultyById(id))"
            :is-completed="completedDifficulties.includes(id)"
            :best-score="getDifficultyBestScore(id)"
            :style="{ animationDelay: `${groupIndex * 100 + cardIndex * 50}ms` }"
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
.page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 装饰星星 */
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  font-size: 24px;
  opacity: 0.5;
  animation: floatStar 4s ease-in-out infinite;
}

.star-1 {
  top: 5%;
  left: 5%;
  animation-delay: 0s;
}

.star-2 {
  top: 8%;
  right: 8%;
  font-size: 20px;
  animation-delay: 1s;
}

.star-3 {
  bottom: 15%;
  left: 5%;
  animation-delay: 2s;
}

.star-4 {
  bottom: 20%;
  right: 8%;
  font-size: 28px;
  animation-delay: 1.5s;
}

@keyframes floatStar {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) rotate(10deg) scale(1.1);
    opacity: 0.7;
  }
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
  border-bottom: 1px solid rgba(74, 144, 226, 0.1);
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.1);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: 600;
  color: #4A90E2;
  background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:active {
  transform: scale(0.95);
  background: #e0efff;
}

.title {
  font-size: 20px;
  font-weight: 800;
  font-family: inherit;
  filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.2));
}

.progress-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 700;
  color: #FF8F00;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  border-radius: 20px;
  border: 2px solid #FFD54F;
}

.progress-badge svg {
  color: #FFB300;
}

.main-content {
  padding: 20px;
  padding-bottom: 100px;
}

.section {
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 249, 255, 0.9) 100%);
  border-radius: 14px;
  border: 2px solid rgba(74, 144, 226, 0.15);
}

.section-indicator {
  width: 5px;
  height: 24px;
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e3a5f;
  font-family: inherit;
  flex: 1;
}

.section-count {
  font-size: 13px;
  color: #5a7a9a;
  font-weight: 600;
  background: rgba(74, 144, 226, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 249, 255, 0.95) 100%);
  border-top: 2px solid rgba(74, 144, 226, 0.1);
  box-shadow: 0 -4px 20px rgba(74, 144, 226, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-align: center;
}

.footer p {
  font-size: 14px;
  color: #5a7a9a;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
