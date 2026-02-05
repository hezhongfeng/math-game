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
          <Calculator :size="48" />
        </div>
        <h1 class="title text-child-3xl">数学挑战</h1>
        <p class="subtitle text-child-lg">训练思维，挑战自我</p>
      </div>

      <!-- 统计卡片 -->
      <div class="stats">
        <div
          class="stat-card stat-card-primary animate-card-entrance"
          style="animation-delay: 100ms"
        >
          <div class="stat-icon-wrapper icon-primary">
            <Trophy :size="24" class="stat-icon" />
          </div>
          <p class="stat-value text-child-2xl">{{ completedCount }}</p>
          <p class="stat-label text-child-sm">已完成</p>
        </div>

        <div
          class="stat-card stat-card-secondary animate-card-entrance"
          style="animation-delay: 200ms"
        >
          <div class="stat-icon-wrapper icon-secondary">
            <Star :size="24" class="stat-icon" />
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
/* ============================================
   Claymorphism 粘土风首页
   ============================================ */

.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  background: linear-gradient(180deg, #F0F0E8 0%, #E5E5D8 50%, #DADAC8 100%);
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

/* 标题图标 - 粘土风3D效果 */
.title-icon {
  width: 88px;
  height: 88px;
  border-radius: 28px;
  background: linear-gradient(145deg, var(--game-primary-light) 0%, var(--game-primary) 50%, var(--game-primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 0 0 var(--game-primary-dark),
    0 12px 24px rgba(74, 124, 89, 0.4),
    inset 0 3px 6px rgba(255, 255, 255, 0.3);
  /* 只播放3次，避免干扰用户 */
  animation: iconFloat 3s ease-in-out 3;
}

/* 悬停时再次触发动画 */
.title-icon:hover {
  animation: iconFloat 2s ease-in-out;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.title {
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--game-text);
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

/* 统计卡片 - 粘土风 */
.stat-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f8f0 100%);
  border-radius: 24px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  padding: 24px 16px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow:
    12px 12px 24px rgba(0, 0, 0, 0.12),
    -12px -12px 24px rgba(255, 255, 255, 0.9),
    inset 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.stat-card-primary {
  background: linear-gradient(145deg, #ffffff 0%, rgba(74, 124, 89, 0.08) 100%);
}

.stat-card-secondary {
  background: linear-gradient(145deg, #ffffff 0%, rgba(244, 208, 63, 0.08) 100%);
}

/* 统计图标 - 粘土风 */
.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  border: 3px solid rgba(255, 255, 255, 0.4);
}

.icon-primary {
  background: linear-gradient(145deg, var(--game-primary-light) 0%, var(--game-primary) 100%);
  color: white;
  box-shadow:
    0 5px 0 0 var(--game-primary-dark),
    0 8px 16px rgba(74, 124, 89, 0.35),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.icon-secondary {
  background: linear-gradient(145deg, var(--game-accent) 0%, var(--game-accent-dark) 100%);
  color: white;
  box-shadow:
    0 5px 0 0 #B7950B,
    0 8px 16px rgba(212, 172, 13, 0.35),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
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
  gap: 16px;
}

/* 主按钮 - 粘土风 */
.btn-primary {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 20px 28px;
  font-weight: 700;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: linear-gradient(180deg, var(--game-primary-light) 0%, var(--game-primary) 50%, var(--game-primary-dark) 100%);
  color: white;
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 6px 0 0 var(--game-primary-dark),
    0 10px 24px rgba(74, 124, 89, 0.35),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow:
    0 9px 0 0 var(--game-primary-dark),
    0 14px 32px rgba(74, 124, 89, 0.45),
    inset 0 2px 4px rgba(255, 255, 255, 0.4);
}

.btn-primary:active {
  transform: translateY(3px) scale(0.98);
  box-shadow:
    0 3px 0 0 var(--game-primary-dark),
    0 6px 16px rgba(74, 124, 89, 0.3),
    inset 0 3px 6px rgba(0, 0, 0, 0.15);
}

/* 次按钮 - 粘土风 */
.btn-secondary {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 20px 28px;
  font-weight: 700;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f0 100%);
  color: var(--game-primary-dark);
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    0 5px 0 0 var(--game-border),
    0 8px 20px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.btn-secondary:hover {
  transform: translateY(-3px);
  border-color: var(--game-primary-light);
  box-shadow:
    0 8px 0 0 var(--game-border),
    0 12px 28px rgba(0, 0, 0, 0.12),
    inset 0 2px 4px rgba(255, 255, 255, 0.9);
}

.btn-secondary:active {
  transform: translateY(2px) scale(0.98);
  box-shadow:
    0 2px 0 0 var(--game-border),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 3px 6px rgba(0, 0, 0, 0.08);
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
