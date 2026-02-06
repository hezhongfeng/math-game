<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, Play, Star, Calculator } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { DIFFICULTY_GROUPS } from '../config/difficulty'

const router = useRouter()
const { getAllBestScores } = useStorage()
const { playSound, forceInitializeAudioContext } = useSound()

const bestScores = getAllBestScores()
const completedCount = Object.keys(bestScores).length

function startGame() {
  playSound('click')
  router.push('/difficulty')
}

function viewAchievements() {
  playSound('click')
  router.push('/difficulty')
}

// iOS Safari 兼容性修复
onMounted(() => {
  forceInitializeAudioContext().catch(() => {})
})
</script>

<template>
  <div class="home-page">
    <!-- 主内容区 -->
    <div class="content">
      <!-- 标题区 -->
      <div class="hero-section animate-slide-up" style="animation-delay: 0ms">
        <div class="app-icon">
          <Calculator :size="40" stroke-width="2" />
        </div>
        <h1 class="title">数学挑战</h1>
        <p class="subtitle">训练思维，挑战自我</p>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stagger-1" style="animation: card-enter var(--duration-macro) var(--ease-decelerate) 100ms forwards; opacity: 0">
          <div class="stat-icon bg-blue">
            <Trophy :size="22" stroke-width="2.5" />
          </div>
          <p class="stat-value">{{ completedCount }}</p>
          <p class="stat-label">已完成</p>
        </div>

        <div class="stat-card stagger-2" style="animation: card-enter var(--duration-macro) var(--ease-decelerate) 150ms forwards; opacity: 0">
          <div class="stat-icon bg-yellow">
            <Star :size="22" stroke-width="2.5" />
          </div>
          <p class="stat-value">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="stat-label">总关卡</p>
        </div>
      </div>

      <!-- 主按钮 -->
      <div class="actions">
        <button
          class="btn-primary action-btn"
          style="animation: card-enter var(--duration-macro) var(--ease-decelerate) 200ms forwards; opacity: 0"
          @click="startGame"
        >
          <Play :size="22" stroke-width="2.5" />
          <span>开始挑战</span>
        </button>

        <button
          class="btn-secondary action-btn"
          style="animation: card-enter var(--duration-macro) var(--ease-decelerate) 250ms forwards; opacity: 0"
          @click="viewAchievements"
        >
          <Trophy :size="22" stroke-width="2.5" />
          <span>查看成就</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  background: linear-gradient(135deg, #F5F7FA 0%, #E8ECF1 100%);
  overflow-x: hidden;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.content {
  width: 100%;
  max-width: 340px;
}

/* 标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
}

.app-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--ios-blue) 0%, var(--ios-blue-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 
    0 4px 16px rgba(0, 122, 255, 0.3),
    0 8px 32px rgba(0, 122, 255, 0.15);
  animation: float-subtle 4s ease-in-out infinite;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: var(--ios-text-primary);
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 17px;
  color: var(--ios-gray-1);
  font-weight: 400;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  padding: 20px 16px;
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: all var(--duration-micro) var(--ease-standard);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: white;
}

.stat-icon.bg-blue {
  background: var(--ios-blue);
}

.stat-icon.bg-yellow {
  background: var(--ios-yellow);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--ios-text-primary);
  margin-bottom: 2px;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 13px;
  color: var(--ios-gray-1);
  font-weight: 500;
}

/* 按钮区域 */
.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.action-btn svg {
  flex-shrink: 0;
}

/* 响应式 */
@media (min-width: 768px) {
  .content {
    max-width: 400px;
  }
  
  .app-icon {
    width: 96px;
    height: 96px;
  }
  
  .title {
    font-size: 36px;
  }
  
  .stats-grid {
    gap: 16px;
  }
  
  .stat-card {
    padding: 24px 20px;
  }
  
  .stat-icon {
    width: 52px;
    height: 52px;
  }
  
  .stat-value {
    font-size: 32px;
  }
}
</style>
