<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy } from 'lucide-vue-next'
import { DIFFICULTY_GROUPS, getDifficultyById, TOTAL_LEVELS } from '../config/difficulty'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import DifficultyCard from '../components/DifficultyCard.vue'

const router = useRouter()
const { getBestScore, getCompletedDifficulties } = useStorage()
const { playSound } = useSound()

// 使用 ref 存储完成状态，确保响应式更新
const completedDifficulties = ref(getCompletedDifficulties())
const isReady = ref(false)

// 计算完成的关卡数量（响应式）
const completedCount = computed(() => completedDifficulties.value.length)

// 页面加载动画
onMounted(() => {
  window.scrollTo(0, 0)
  // 短暂延迟触发入场动画
  requestAnimationFrame(() => {
    isReady.value = true
  })
})

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
</script>

<template>
  <div class="page">
    <!-- 顶部导航 -->
    <header class="header">
      <button class="btn-back text-child-sm" @click="goBack">
        <ArrowLeft :size="20" />
        <span>返回</span>
      </button>

      <h1 class="title text-child-xl">选择关卡</h1>

      <!-- 进度徽章 -->
      <div class="progress-badge">
        <div class="progress-ring">
          <svg class="progress-svg" viewBox="0 0 44 44">
            <!-- 背景圆环 -->
            <circle
              class="progress-ring-bg"
              cx="22"
              cy="22"
              r="18"
              fill="none"
            />
            <!-- 进度圆环 -->
            <circle
              class="progress-ring-fill"
              cx="22"
              cy="22"
              r="18"
              fill="none"
              :stroke-dasharray="`${113}, 113`"
              :stroke-dashoffset="`${113 - (completedCount / Math.max(TOTAL_LEVELS, 1)) * 113}`"
            />
          </svg>
          <div class="progress-icon-center">
            <Trophy :size="22" />
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main-content">
      <div 
        v-for="(group, groupIndex) in DIFFICULTY_GROUPS" 
        :key="group.name" 
        class="section"
        :class="{ 'section-visible': isReady }"
        :style="{ transitionDelay: `${groupIndex * 100}ms` }"
      >
        <!-- 阶段标题 -->
        <div class="section-header" :style="{ animationDelay: `${groupIndex * 100}ms` }">
          <div class="section-badge text-child-sm" :class="`badge-${group.color}`">
            <h2 class="section-title">{{ group.name }}</h2>
          </div>
          <span class="section-count text-child-sm">{{ group.levels.length }}关</span>
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
      <p class="text-child-sm">依次完成关卡，解锁更高难度</p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  position: relative;
  padding: 12px 12px 60px;
  background: linear-gradient(180deg, var(--game-bg-light) 0%, var(--game-bg) 50%, var(--game-bg-dark) 100%);
  touch-action: manipulation;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: max(60px, calc(50px + env(safe-area-inset-bottom)));
}

/* 顶部导航 */
.header {
  position: sticky;
  top: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  margin: 0 4px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 返回按钮 */
.btn-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-weight: 600;
  color: var(--game-text-secondary);
  background: var(--game-bg-light);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.btn-back:hover {
  background: var(--game-bg);
  color: var(--game-primary-dark);
}

.btn-back:active {
  transform: scale(0.95);
}

.title {
  font-weight: 700;
  color: var(--game-text);
  letter-spacing: 1px;
  text-align: center;
  flex: 1;
}

/* 进度徽章 - 环形设计 */
.progress-badge {
  position: relative;
  min-width: 80px;
  display: flex;
  justify-content: flex-end;
}

.progress-ring {
  width: 48px;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring-bg {
  stroke: var(--game-border);
  stroke-width: 4;
}

.progress-ring-fill {
  stroke: var(--game-success);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.progress-icon-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--game-warning-dark);
}

.progress-icon-center svg {
  width: 20px;
  height: 20px;
}

.main-content {
  padding: 8px;
  padding-bottom: 40px;
}

.section {
  margin-bottom: 28px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.section-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 阶段标题 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 10px 14px;
  background: white;
  border-radius: 14px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.06);
}

.section-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 10px;
  font-weight: 700;
}

.section-title {
  font-size: inherit;
}

/* 各阶段颜色 - 男童科技风 */
.badge-green {
  background: rgba(34, 197, 94, 0.15);
  color: var(--game-success-dark);
}

.badge-blue {
  background: rgba(79, 70, 229, 0.15);
  color: var(--game-primary-dark);
}

.badge-yellow {
  background: rgba(234, 179, 8, 0.15);
  color: var(--game-warning-dark);
}

.badge-orange {
  background: rgba(249, 115, 22, 0.15);
  color: var(--game-accent-dark);
}

.badge-red {
  background: rgba(239, 68, 68, 0.15);
  color: var(--game-error-dark);
}

.section-count {
  color: var(--game-text-secondary);
  font-weight: 600;
  background: var(--game-bg-light);
  padding: 5px 12px;
  border-radius: 10px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 底部提示 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border-top: 1px solid var(--game-border);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.04);
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}

.footer p {
  color: var(--game-text-secondary);
  font-weight: 500;
  text-align: center;
}

/* 平板端双列布局 */
@media (min-width: 768px) {
  .card-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .section-header {
    padding: 12px 18px;
  }

  .section-badge {
    padding: 8px 16px;
  }
}

/* 桌面端优化 */
@media (min-width: 1024px) {
  .page {
    max-width: 1024px;
    margin: 0 auto;
  }

  .header {
    padding: 16px 24px;
  }

  .title {
    font-size: 28px;
  }

  .main-content {
    padding: 16px 24px;
  }

  .section {
    margin-bottom: 32px;
  }
}
</style>
