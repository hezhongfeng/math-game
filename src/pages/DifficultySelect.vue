<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy, Star } from 'lucide-vue-next'
import { DIFFICULTY_GROUPS, getDifficultyById } from '../config/difficulty'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import DifficultyCard from '../components/DifficultyCard.vue'
import TouchOptimizedButton from '../components/TouchOptimizedButton.vue'

const router = useRouter()
const { getBestScore, getCompletedDifficulties, getAllBestScores } = useStorage()
const { playSound } = useSound()

const completedDifficulties = getCompletedDifficulties()
const allBestScores = getAllBestScores()
const completedCount = computed(() => Object.keys(allBestScores).length)

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
  return !completedDifficulties.includes(previousId)
}

// 获取阶段图标
function getStageIcon(stageName) {
  const icons = {
    '入门': '🌱',
    '初级': '🌿',
    '中级': '🌲',
    '进级': '🏔️',
    '高级': '⭐'
  }
  return icons[stageName] || '🎯'
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="page">
    <!-- 装饰星星 - 更多更活泼 -->
    <div class="stars">
      <span class="star star-1">✨</span>
      <span class="star star-2">⭐</span>
      <span class="star star-3">✨</span>
      <span class="star star-4">⭐</span>
      <span class="star star-5">🌟</span>
      <span class="star star-6">✨</span>
      <span class="float-heart">💖</span>
      <span class="float-lightning">⚡</span>
    </div>

    <!-- 顶部导航 - 毛玻璃效果 -->
    <header class="header">
      <TouchOptimizedButton
        size="small"
        variant="secondary"
        :icon="ArrowLeft"
        :icon-size="20"
        @click="goBack"
      >
        返回
      </TouchOptimizedButton>

      <h1 class="title font-child-friendly">
        <span class="title-icon">🎮</span>
        选择关卡
      </h1>

      <!-- 进度环徽章 -->
      <div class="progress-badge">
        <div class="progress-ring">
          <svg viewBox="0 0 36 36">
            <path
              class="progress-ring-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="progress-ring-fill"
              :stroke-dasharray="`${(completedCount / (DIFFICULTY_GROUPS.length * 3)) * 100}, 100`"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="progress-text">
            <Trophy :size="14" />
            <span>{{ completedCount }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main-content">
      <div v-for="(group, groupIndex) in DIFFICULTY_GROUPS" :key="group.name" class="section">
        <!-- 阶段标题 - 彩色胶囊 -->
        <div class="section-header animate-fade-in-up" :style="{ animationDelay: `${groupIndex * 100}ms` }">
          <div class="section-badge" :class="`badge-${group.color}`">
            <span class="section-icon">{{ getStageIcon(group.name) }}</span>
            <h2 class="section-title">{{ group.name }}阶段</h2>
          </div>
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

    <!-- 底部提示 - 更活泼 -->
    <footer class="footer">
      <div class="footer-content font-child-friendly">
        <span class="footer-icon">💡</span>
        <p>从第一关开始，依次解锁更高难度</p>
        <span class="footer-rocket">🚀</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  position: relative;
  padding: 12px 12px 80px;
  background: linear-gradient(180deg, #FFF8E1 0%, #E0F7FA 40%, #F3E5F5 70%, #FFF8E1 100%);
  touch-action: manipulation;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: max(80px, calc(60px + env(safe-area-inset-bottom)));
}

/* 装饰星星 - 更多动画 */
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.star {
  position: absolute;
  font-size: 24px;
  opacity: 0.6;
  animation: floatStar 3s ease-in-out infinite;
}

.star-1 {
  top: 3%;
  left: 3%;
  animation-delay: 0s;
}

.star-2 {
  top: 6%;
  right: 5%;
  font-size: 20px;
  animation-delay: 0.5s;
}

.star-3 {
  top: 15%;
  left: 8%;
  animation-delay: 1s;
}

.star-4 {
  top: 12%;
  right: 12%;
  font-size: 28px;
  animation-delay: 1.5s;
}

.star-5 {
  top: 25%;
  left: 2%;
  font-size: 32px;
  animation-delay: 0.8s;
}

.star-6 {
  top: 30%;
  right: 3%;
  animation-delay: 1.2s;
}

.float-heart {
  position: absolute;
  font-size: 28px;
  bottom: 20%;
  left: 5%;
  animation: heartbeat 1.5s ease-in-out infinite;
}

.float-lightning {
  position: absolute;
  font-size: 24px;
  bottom: 30%;
  right: 8%;
  animation: wiggle 2s ease-in-out infinite;
}

@keyframes floatStar {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-15px) rotate(15deg) scale(1.15);
    opacity: 0.9;
  }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.2); }
  28% { transform: scale(1); }
  42% { transform: scale(1.2); }
  70% { transform: scale(1); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

/* 顶部导航 - 毛玻璃效果 */
.header {
  position: sticky;
  top: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow:
    0 4px 0 0 rgba(0, 0, 0, 0.05),
    0 8px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.5);
  margin: 0 8px 20px;
  padding-top: max(12px, env(safe-area-inset-top));
}

.title {
  font-size: 20px;
  font-weight: 800;
  color: #37474F;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 24px;
}

/* 进度环徽章 */
.progress-badge {
  position: relative;
}

.progress-ring {
  width: 48px;
  height: 48px;
  position: relative;
}

.progress-ring svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.progress-ring-bg {
  fill: none;
  stroke: #E3F2FD;
  stroke-width: 3;
}

.progress-ring-fill {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}

.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #FF8F00;
}

.progress-text svg {
  color: #FFB300;
  margin-bottom: -2px;
}

.main-content {
  padding: 16px;
  padding-bottom: 40px;
}

.section {
  margin-bottom: 32px;
}

/* 阶段标题 - 彩色胶囊 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 3px 0 0 rgba(0, 0, 0, 0.06),
    0 6px 20px rgba(0, 0, 0, 0.06);
}

.section-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 16px;
  font-weight: 700;
}

.section-icon {
  font-size: 24px;
}

.section-title {
  font-size: 17px;
  color: #37474F;
}

/* 各阶段颜色 */
.badge-green {
  background: linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%);
  color: #2E7D32;
}

.badge-blue {
  background: linear-gradient(135deg, #B3E5FC 0%, #81D4FA 100%);
  color: #0277BD;
}

.badge-yellow {
  background: linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%);
  color: #F57F17;
}

.badge-orange {
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
  color: #E65100;
}

.badge-red {
  background: linear-gradient(135deg, #FFCDD2 0%, #EF9A9A 100%);
  color: #C62828;
}

.section-count {
  font-size: 14px;
  color: #78909C;
  font-weight: 600;
  background: #F5F5F5;
  padding: 6px 14px;
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 底部提示 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-top: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  padding-bottom: max(14px, env(safe-area-inset-bottom));
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.footer-icon {
  font-size: 18px;
  animation: twinkle 2s ease-in-out infinite;
}

.footer p {
  font-size: 15px;
  color: #5a7a9a;
  font-weight: 500;
}

.footer-rocket {
  font-size: 18px;
  animation: float-gentle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}

@keyframes float-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style>
