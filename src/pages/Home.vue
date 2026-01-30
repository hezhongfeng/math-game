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
  <div class="page">
    <!-- 主内容区 -->
    <div class="content">
      <!-- 标题区 -->
      <div class="header animate-fade-in-up">
        <div class="title-icon">
          <Calculator :size="44" />
        </div>
        <h1 class="title text-child-3xl md:text-child-4xl">数学挑战</h1>
        <p class="subtitle text-child-base">训练思维，挑战自我</p>
      </div>

      <!-- 统计卡片 -->
      <div class="stats">
        <div
          class="stat-card stat-card-primary animate-card-entrance"
          style="animation-delay: 100ms"
        >
          <div class="stat-icon-wrapper icon-primary">
            <Trophy :size="28" class="stat-icon" />
          </div>
          <p class="stat-value text-child-2xl">{{ completedCount }}</p>
          <p class="stat-label text-child-sm">已完成</p>
        </div>

        <div
          class="stat-card stat-card-secondary animate-card-entrance"
          style="animation-delay: 200ms"
        >
          <div class="stat-icon-wrapper icon-secondary">
            <Star :size="28" class="stat-icon" />
          </div>
          <p class="stat-value text-child-2xl">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="stat-label text-child-sm">总关卡</p>
        </div>
      </div>

      <!-- 主按钮 -->
      <div class="buttons">
        <button
          class="btn-primary animate-button-entrance text-child-base"
          style="animation-delay: 300ms"
          @click="startGame"
        >
          <Play :size="24" />
          <span>开始挑战</span>
        </button>

        <button
          class="btn-secondary animate-button-entrance text-child-base"
          style="animation-delay: 400ms"
          @click="viewAchievements"
        >
          <Trophy :size="24" />
          <span>查看成就</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  background: linear-gradient(180deg, var(--game-bg-light) 0%, var(--game-bg) 50%, var(--game-bg-dark) 100%);
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.content {
  width: 100%;
  max-width: 360px;
  position: relative;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, var(--game-primary) 0%, var(--game-primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow:
    0 8px 16px rgba(79, 70, 229, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--game-text);
  letter-spacing: 2px;
}

.subtitle {
  color: var(--game-text-secondary);
  font-weight: 500;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;
}

/* 统计卡片 */
.stat-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-card-primary {
  background: linear-gradient(135deg, #ffffff 0%, rgba(79, 70, 229, 0.1) 100%);
}

.stat-card-secondary {
  background: linear-gradient(135deg, #ffffff 0%, rgba(249, 115, 22, 0.1) 100%);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.icon-primary {
  background: linear-gradient(135deg, var(--game-primary-light) 0%, var(--game-primary) 100%);
  color: white;
  box-shadow: 0 4px 8px rgba(79, 70, 229, 0.4);
}

.icon-secondary {
  background: linear-gradient(135deg, var(--game-accent) 0%, var(--game-accent-dark) 100%);
  color: white;
  box-shadow: 0 4px 8px rgba(249, 115, 22, 0.4);
}

.stat-value {
  font-weight: 800;
  margin-bottom: 4px;
  color: var(--game-text);
}

.stat-card-primary .stat-value {
  color: var(--game-primary-dark);
}

.stat-card-secondary .stat-value {
  color: var(--game-accent-dark);
}

.stat-label {
  color: var(--game-text-secondary);
  font-weight: 500;
}

/* 按钮区域 */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 主按钮 - 靛蓝 */
.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 18px 24px;
  font-weight: 700;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  background: linear-gradient(180deg, var(--game-primary-light) 0%, var(--game-primary-dark) 100%);
  color: white;
  border: none;
  box-shadow:
    0 4px 0 0 #312E81,
    0 6px 12px rgba(79, 70, 229, 0.4);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow:
    0 5px 0 0 #312E81,
    0 8px 16px rgba(79, 70, 229, 0.5);
}

.btn-primary:active {
  transform: translateY(2px) scale(0.98);
  box-shadow:
    0 2px 0 0 #312E81,
    0 3px 6px rgba(79, 70, 229, 0.4);
}

/* 次按钮 - 白色 */
.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 18px 24px;
  font-weight: 700;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  background: #ffffff;
  color: var(--game-primary-dark);
  border: 2px solid var(--game-border);
  box-shadow:
    0 3px 0 0 var(--game-border),
    0 4px 8px rgba(0, 0, 0, 0.06);
}

.btn-secondary:hover {
  transform: translateY(-1px);
  background: var(--game-bg-light);
  border-color: var(--game-primary);
  box-shadow:
    0 4px 0 0 var(--game-border),
    0 6px 12px rgba(0, 0, 0, 0.08);
}

.btn-secondary:active {
  transform: translateY(2px) scale(0.98);
  box-shadow:
    0 1px 0 0 var(--game-border),
    0 2px 4px rgba(0, 0, 0, 0.06);
}

/* 动画 */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out both;
}

.animate-card-entrance {
  animation: cardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.animate-button-entrance {
  animation: buttonEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: translateY(25px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes buttonEntrance {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
