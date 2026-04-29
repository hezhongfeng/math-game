<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Binary, Play, Sparkles } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { TOTAL_LEVELS } from '../config/difficulty'

const router = useRouter()
const { completedCount, stats } = useStorage()
const { playClick } = useSound()
const isReady = ref(false)
const isLeaving = ref(false)
const NAVIGATION_DELAY = 180

const floatingSymbols = ['+', '-', '=', '?', '1', '2', '3']

function navigateTo(route, event) {
  if (isLeaving.value) {
    return
  }

  isLeaving.value = true
  playClick()
  const btn = event?.currentTarget
  if (btn) {
    btn.classList.add('is-leaving')
  }
  setTimeout(() => {
    router.push(route)
  }, NAVIGATION_DELAY)
}

function startGame(event) {
  navigateTo('/difficulty', event)
}

function goToExplore(event) {
  navigateTo('/explore', event)
}

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true
  })
})
</script>

<template>
  <div class="home-page">
    <!-- 动态背景 -->
    <div class="bg-decorations">
      <span 
        v-for="(sym, i) in floatingSymbols" 
        :key="i" 
        class="float-item"
        :style="{ '--delay': `${i * 1.5}s`, '--left': `${10 + i * 15}%`, '--top': `${20 + (i % 3) * 20}%` }"
      >
        {{ sym }}
      </span>
    </div>

    <div class="home-shell" :class="{ 'is-ready': isReady }">
      <header class="logo-area">
        <div class="logo-circle">
          <Sparkles :size="32" class="logo-sparkle" />
          <div class="logo-inner">
            <span class="logo-plus">+</span>
            <span class="logo-minus">-</span>
          </div>
        </div>
      </header>

      <section class="hero-panel">
        <div class="hero-topline">
          <span class="mission-chip">
            <Sparkles :size="14" />
            <span>启蒙数学</span>
          </span>
          <span class="mission-note">{{ TOTAL_LEVELS }}关卡</span>
        </div>

        <div class="hero-copy">
          <h1 class="title">算一算</h1>
          <p class="subtitle">有趣又好玩的数学游戏。</p>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ completedCount }}</span>
            <span class="stat-label">已通关</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.totalCorrect || 0 }}</span>
            <span class="stat-label">累计答对</span>
          </div>
        </div>
      </section>

      <section class="action-panel">
        <button class="btn-main" data-testid="start-challenge-btn" @click="startGame($event)">
          <span class="btn-main-icon">
            <Play :size="24" />
          </span>
          <span class="btn-text">开始挑战</span>
          <ArrowRight :size="20" class="btn-arrow" />
        </button>
        <button class="btn-main btn-explore" data-testid="explore-btn" @click="goToExplore($event)">
          <span class="btn-main-icon">
            <Binary :size="24" />
          </span>
          <span class="btn-text">数字探索</span>
          <ArrowRight :size="20" class="btn-arrow" />
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 18px;
  background: radial-gradient(circle at top left, #f8faff 0%, #eef4ff 100%);
  position: relative;
  overflow: hidden;
}

/* 动态背景装饰 */
.bg-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.float-item {
  position: absolute;
  left: var(--left);
  top: var(--top);
  font-size: 28px;
  font-weight: 900;
  color: rgba(49, 120, 246, 0.04);
  animation: float 6s ease-in-out infinite;
  animation-delay: var(--delay);
  user-select: none;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

.home-shell {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

/* Logo 区域 */
.logo-area {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.6s var(--ease-out);
}

.is-ready .logo-area {
  opacity: 1;
  transform: scale(1);
}

.logo-circle {
  width: 84px;
  height: 84px;
  border-radius: 30px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 8px 32px rgba(49, 120, 246, 0.12), inset 0 2px 4px white;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.logo-inner {
  display: flex;
  gap: 4px;
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.logo-plus { color: var(--candy-pink-dark); }
.logo-minus { color: var(--candy-mint-dark); }

.logo-sparkle {
  position: absolute;
  top: -12px;
  right: -12px;
  color: var(--candy-yellow-dark);
  filter: drop-shadow(0 0 8px rgba(245, 201, 74, 0.4));
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* 面板通用样式 */
.hero-panel,
.action-panel {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.04);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}

.is-ready .hero-panel { transition-delay: 150ms; opacity: 1; transform: translateY(0); }
.is-ready .action-panel { transition-delay: 250ms; opacity: 1; transform: translateY(0); }

.hero-panel {
  border-radius: 32px;
  padding: 24px;
  text-align: center;
}

.hero-topline {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.mission-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(49, 120, 246, 0.06);
  color: var(--text-link);
  font-size: 13px;
  font-weight: 700;
}

.mission-note {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.hero-copy {
  margin-bottom: 28px;
}

.title {
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
}

/* 统计网格 */
.stats-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(0, 0, 0, 0.06);
}

/* 操作区域 */
.action-panel {
  border-radius: 28px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-main {
  width: 100%;
  height: 64px;
  border: none;
  border-radius: 22px;
  background: var(--candy-pink-dark);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 18px;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(49, 120, 246, 0.2);
  transition: all 0.3s var(--ease-out);
  cursor: pointer;
}

.btn-main-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  letter-spacing: 0.02em;
}

.btn-arrow {
  transition: transform 0.3s var(--ease-out);
}

.btn-main:active {
  transform: scale(0.96);
  background: var(--brand-primary-dark);
}

.btn-main.is-leaving {
  opacity: 0.5;
  transform: scale(0.9) translateY(4px);
  filter: blur(2px);
}

@media (hover: hover) {
  .btn-main:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(49, 120, 246, 0.3);
  }
  
  .btn-main:hover .btn-arrow {
    transform: translateX(4px);
  }
}

@media (max-width: 420px) {
  .home-shell { gap: 16px; }
  .title { font-size: 36px; }
  .hero-panel { padding: 20px; }
  .stats-grid { gap: 12px; padding: 12px; }
  .stat-value { font-size: 20px; }
  .logo-circle { width: 72px; height: 72px; border-radius: 24px; }
  .logo-inner { font-size: 30px; }
}
</style>
