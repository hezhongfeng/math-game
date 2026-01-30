<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy } from 'lucide-vue-next'
import { DIFFICULTY_GROUPS, getDifficultyById } from '../config/difficulty'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import DifficultyCard from '../components/DifficultyCard.vue'

const router = useRouter()
const { getBestScore, getCompletedDifficulties, completedCount } = useStorage()
const { playSound } = useSound()

// 使用 ref 存储完成状态，确保响应式更新
const completedDifficulties = ref(getCompletedDifficulties())

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

// 使用计算属性缓存锁定状态计算
const lockedStatusMap = computed(() => {
  const map = new Map()
  const completed = completedDifficulties.value
  
  DIFFICULTY_GROUPS.forEach(group => {
    group.levels.forEach(id => {
      if (id === 1) {
        map.set(id, false)
      } else {
        map.set(id, !completed.includes(id - 1))
      }
    })
  })
  
  return map
})

function isDifficultyLocked(difficulty) {
  return lockedStatusMap.value.get(difficulty.id) ?? false
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
    <!-- 装饰元素 - Candy Style -->
    <div class="decorations">
      <div class="deco-blob blob-1"></div>
      <div class="deco-blob blob-2"></div>
      <div class="deco-blob blob-3"></div>
      <div class="deco-circle circle-1"></div>
      <div class="deco-circle circle-2"></div>
    </div>

    <!-- 顶部导航 - Candy Claymorphism -->
    <header class="header-candy">
      <button
        class="btn-candy-back"
        @click="goBack"
      >
        <ArrowLeft :size="20" />
        <span>返回</span>
      </button>

      <h1 class="title-candy">
        <span class="title-dot dot-1"></span>
        选择关卡
        <span class="title-dot dot-2"></span>
      </h1>

      <!-- 进度环徽章 -->
      <div class="progress-badge-candy">
        <div class="progress-ring-candy">
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

    <!-- 底部提示 - Candy Style -->
    <footer class="footer-candy">
      <div class="footer-content">
        <div class="footer-bulb"></div>
        <p>从第一关开始，依次解锁更高难度</p>
        <div class="footer-star"></div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  position: relative;
  padding: 12px 12px 80px;
  background: linear-gradient(180deg, #FFFBF5 0%, #F0F9FF 40%, #FFF8E7 70%, #FFFBF5 100%);
  touch-action: manipulation;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: max(80px, calc(60px + env(safe-area-inset-bottom)));
}

/* 装饰元素 - Candy Style */
.decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.deco-blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(1px);
}

.blob-1 {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #FF8FA3, #FFB3C1);
  top: 5%;
  left: -30px;
  animation: floatClay 5s ease-in-out infinite;
}

.blob-2 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #98FF98, #B8FFB8);
  top: 20%;
  right: -20px;
  animation: floatClay 4s ease-in-out infinite reverse;
}

.blob-3 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FFE66D, #FFF5A0);
  bottom: 30%;
  left: 5%;
  animation: floatClay 6s ease-in-out infinite;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  border: 3px solid;
  opacity: 0.2;
}

.circle-1 {
  width: 40px;
  height: 40px;
  border-color: #4FC3F7;
  top: 15%;
  right: 10%;
  animation: float-gentle 4s ease-in-out infinite;
}

.circle-2 {
  width: 30px;
  height: 30px;
  border-color: #CE93D8;
  bottom: 25%;
  right: 5%;
  animation: float-gentle 5s ease-in-out infinite reverse;
}

@keyframes floatClay {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-8px) rotate(2deg); }
  66% { transform: translateY(-4px) rotate(-1deg); }
}

@keyframes float-gentle {
  0%, 100% { transform: translateY(0); opacity: 0.2; }
  50% { transform: translateY(-10px); opacity: 0.4; }
}

/* 顶部导航 - Candy Claymorphism */
.header-candy {
  position: sticky;
  top: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 251, 245, 0.95) 100%);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  margin: 0 8px 20px;
  padding-top: max(12px, env(safe-area-inset-top));
  box-shadow:
    6px 6px 16px rgba(0, 0, 0, 0.08),
    -3px -3px 10px rgba(255, 255, 255, 0.9),
    inset -2px -2px 6px rgba(0, 0, 0, 0.03),
    inset 2px 2px 6px rgba(255, 255, 255, 0.9);
}

/* 返回按钮 */
.btn-candy-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #7A6A5A;
  background: linear-gradient(180deg, #ffffff 0%, #FFFBF5 100%);
  border: 2px solid white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    3px 3px 8px rgba(0, 0, 0, 0.06),
    -2px -2px 6px rgba(255, 255, 255, 1),
    inset -1px -1px 3px rgba(0, 0, 0, 0.02),
    inset 1px 1px 3px rgba(255, 255, 255, 0.9);
}

.btn-candy-back:hover {
  transform: translateY(-2px);
  box-shadow:
    5px 5px 12px rgba(0, 0, 0, 0.08),
    -3px -3px 8px rgba(255, 255, 255, 1),
    inset -1px -1px 3px rgba(0, 0, 0, 0.02),
    inset 1px 1px 3px rgba(255, 255, 255, 0.9);
}

.btn-candy-back:active {
  transform: scale(0.95);
  box-shadow:
    2px 2px 5px rgba(0, 0, 0, 0.06),
    -1px -1px 4px rgba(255, 255, 255, 1),
    inset -2px -2px 5px rgba(0, 0, 0, 0.06),
    inset 2px 2px 5px rgba(255, 255, 255, 0.7);
}

.title-candy {
  font-size: 20px;
  font-weight: 800;
  color: #5D4E37;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-1 {
  background: #FF8FA3;
  box-shadow: 0 0 8px rgba(255, 143, 163, 0.6);
  animation: glow-clay 2s ease-in-out infinite;
}

.dot-2 {
  background: #4FC3F7;
  box-shadow: 0 0 8px rgba(79, 195, 247, 0.6);
  animation: glow-clay 2s ease-in-out infinite 1s;
}

/* 进度环徽章 - Candy Style */
.progress-badge-candy {
  position: relative;
}

.progress-ring-candy {
  width: 48px;
  height: 48px;
  position: relative;
  background: white;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow:
    3px 3px 8px rgba(0, 0, 0, 0.08),
    -2px -2px 6px rgba(255, 255, 255, 1),
    inset -1px -1px 3px rgba(0, 0, 0, 0.03),
    inset 1px 1px 3px rgba(255, 255, 255, 0.9);
}

.progress-ring-candy svg {
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
  stroke: linear-gradient(135deg, #FF8FA3 0%, #4FC3F7 100%);
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
  color: #FF8FA3;
}

.progress-text svg {
  color: #FFE66D;
  margin-bottom: -2px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.main-content {
  padding: 16px;
  padding-bottom: 40px;
}

.section {
  margin-bottom: 32px;
}

/* 阶段标题 - Candy Claymorphism */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 10px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 251, 245, 0.95) 100%);
  border-radius: 20px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    4px 4px 12px rgba(0, 0, 0, 0.06),
    -2px -2px 8px rgba(255, 255, 255, 0.9),
    inset -2px -2px 6px rgba(0, 0, 0, 0.02),
    inset 2px 2px 6px rgba(255, 255, 255, 0.9);
}

.section-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 16px;
  font-weight: 700;
  border: 2px solid white;
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.05),
    -1px -1px 4px rgba(255, 255, 255, 1),
    inset -1px -1px 3px rgba(0, 0, 0, 0.02),
    inset 1px 1px 3px rgba(255, 255, 255, 0.9);
}

.section-icon {
  font-size: 24px;
}

.section-title {
  font-size: 17px;
  color: #5D4E37;
}

/* 各阶段颜色 - Candy Style */
.badge-green {
  background: linear-gradient(135deg, #D4FFD4 0%, #98FF98 100%);
  color: #4CAF50;
}

.badge-blue {
  background: linear-gradient(135deg, #E1F5FE 0%, #81D4FA 100%);
  color: #29B6F6;
}

.badge-yellow {
  background: linear-gradient(135deg, #FFFDE7 0%, #FFF59D 100%);
  color: #F9A825;
}

.badge-orange {
  background: linear-gradient(135deg, #FFE4D6 0%, #FFCCBC 100%);
  color: #FF8A65;
}

.badge-red {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
  color: #EF5350;
}

.section-count {
  font-size: 14px;
  color: #7A6A5A;
  font-weight: 600;
  background: linear-gradient(135deg, #ffffff 0%, #FFFBF5 100%);
  padding: 6px 14px;
  border-radius: 12px;
  border: 2px solid white;
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.03),
    inset -1px -1px 3px rgba(255, 255, 255, 0.8);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 底部提示 - Candy Style */
.footer-candy {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 251, 245, 0.98) 100%);
  backdrop-filter: blur(8px);
  border-top: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    0 -4px 20px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.9);
  padding-bottom: max(14px, env(safe-area-inset-bottom));
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.footer-bulb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFE66D 0%, #FFF59D 100%);
  box-shadow: 0 0 10px rgba(255, 230, 109, 0.5);
  animation: glow-clay 2s ease-in-out infinite;
}

.footer-star {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #FF8FA3 0%, #FFB3C1 100%);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: float-gentle 2s ease-in-out infinite;
}

.footer p {
  font-size: 15px;
  color: #7A6A5A;
  font-weight: 500;
}

@keyframes glow-clay {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 230, 109, 0.4); }
  50% { box-shadow: 0 0 15px rgba(255, 230, 109, 0.8); }
}

@keyframes float-gentle {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(10deg); }
}
</style>
