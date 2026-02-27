<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, Play, Star, Calculator } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { DIFFICULTY_GROUPS, TOTAL_LEVELS } from '../config/difficulty'

const router = useRouter()
const { bestScores } = useStorage()
const { playSound, forceInitializeAudioContext } = useSound()

const completedCount = computed(() => Object.keys(bestScores.value).length)

function startGame() {
  playSound('click')
  router.push('/difficulty')
}

function viewAchievements() {
  playSound('click')
  router.push('/difficulty')
}

onMounted(() => {
  forceInitializeAudioContext().catch(() => {})
})
</script>

<template>
  <div class="home-page">
    <div class="content">
      <div class="hero">
        <div class="logo">
          <Calculator :size="48" />
        </div>
        <h1 class="title">数学大冒险</h1>
        <p class="subtitle">🐴 马年大吉 · 马到成功 🐴</p>
      </div>

      <div class="stats">
        <div class="stat-card" style="animation-delay: 100ms">
          <div class="stat-icon coral">
            <Trophy :size="32" />
          </div>
          <p class="stat-value">{{ completedCount }}</p>
          <p class="stat-label">已完成</p>
        </div>

        <div class="stat-card" style="animation-delay: 200ms">
          <div class="stat-icon mint">
            <Star :size="32" />
          </div>
          <p class="stat-value">{{ TOTAL_LEVELS }}</p>
          <p class="stat-label">总关卡</p>
        </div>
      </div>

      <div class="actions">
        <button class="btn-main" @click="startGame">
          <Play :size="28" />
          <span>开始游戏</span>
        </button>

        <button class="btn-secondary" @click="viewAchievements">
          <Trophy :size="24" />
          <span>查看进度</span>
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
  background: linear-gradient(180deg, #FFF9F5 0%, #FFF5F0 100%);
}

.content {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.hero {
  margin-bottom: 48px;
}

.logo {
  width: 100px;
  height: 100px;
  background: linear-gradient(145deg, var(--coral-light) 0%, var(--coral) 100%);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
  color: white;
  box-shadow: var(--shadow-md);
  animation: bounce 2s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title {
  font-size: var(--font-hero);
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 12px;
}

.subtitle {
  font-size: var(--font-lg);
  color: var(--text-gray);
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 48px;
}

.stat-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 28px 20px;
  box-shadow: var(--shadow-md);
  animation: slideUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
}

.stat-icon.coral {
  background: var(--coral);
}

.stat-icon.mint {
  background: var(--mint);
}

.stat-value {
  font-size: var(--font-h1);
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.stat-label {
  font-size: var(--font-md);
  color: var(--text-gray);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-main {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--coral);
  color: white;
  font-size: var(--font-h3);
  font-weight: 700;
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-main:hover {
  background: var(--coral-dark);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.btn-main:active {
  transform: scale(0.98);
}

.btn-secondary {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--white);
  color: var(--coral);
  font-size: var(--font-lg);
  font-weight: 700;
  border: 3px solid var(--coral);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--coral);
  color: white;
  transform: translateY(-3px);
}

@media (min-width: 768px) {
  .content {
    max-width: 480px;
  }

  .logo {
    width: 120px;
    height: 120px;
  }

  .title {
    font-size: 56px;
  }

  .stat-value {
    font-size: 42px;
  }
}
</style>
