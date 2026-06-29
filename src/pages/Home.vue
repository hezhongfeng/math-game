<script setup>
import { RouterLink } from 'vue-router'
import { ArrowRight, Binary, Play, Sparkles } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { TOTAL_LEVELS } from '../config/difficulty'

const { completedCount, stats } = useStorage()
const { playClick } = useSound()
</script>

<template>
  <div class="home-page">
    <main id="main-content" class="home-shell">
      <header class="logo-area">
        <div class="logo-circle" aria-hidden="true">
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
            <Sparkles :size="14" aria-hidden="true" />
            <span>启蒙数学</span>
          </span>
          <span class="mission-note">{{ TOTAL_LEVELS }}关卡</span>
        </div>

        <div class="hero-copy">
          <h1 class="title">算一算</h1>
          <p class="subtitle">从简单加减法开始，一关一关练熟。</p>
        </div>

        <div v-if="completedCount > 0 || (stats.totalCorrect || 0) > 0" class="stats-grid">
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
        <div v-else class="welcome-hint">
          <Sparkles :size="20" class="welcome-sparkle" aria-hidden="true" />
          <span>开始你的第一关吧！</span>
        </div>
      </section>

      <section class="action-panel">
        <RouterLink class="btn-main" data-testid="start-challenge-btn" to="/difficulty" @click="playClick">
          <span class="btn-main-icon">
            <Play :size="24" aria-hidden="true" />
          </span>
          <span class="btn-text">开始闯关</span>
          <ArrowRight :size="20" class="btn-arrow" aria-hidden="true" />
        </RouterLink>
        <RouterLink class="btn-main btn-explore" data-testid="explore-btn" to="/explore" @click="playClick">
          <span class="btn-main-icon">
            <Binary :size="24" aria-hidden="true" />
          </span>
          <span class="btn-text">数字探索</span>
          <ArrowRight :size="20" class="btn-arrow" aria-hidden="true" />
        </RouterLink>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:
    calc(env(safe-area-inset-top, 0px) + 24px)
    calc(env(safe-area-inset-right, 0px) + 18px)
    calc(env(safe-area-inset-bottom, 0px) + 24px)
    calc(env(safe-area-inset-left, 0px) + 18px);
  background: radial-gradient(circle at top left, #f8faff 0%, #eef4ff 100%);
  position: relative;
  overflow: hidden;
}

.home-shell {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
  animation: home-enter 220ms var(--ease-out) both;
}

@keyframes home-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Logo 区域 */
.logo-area {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
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

.logo-plus { color: var(--candy-blue-dark); }
.logo-minus { color: var(--candy-mint-dark); }

.logo-sparkle {
  position: absolute;
  top: -12px;
  right: -12px;
  color: var(--candy-yellow-dark);
}

/* 面板通用样式 */
.hero-panel,
.action-panel {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

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
  color: var(--text-blue);
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
  text-wrap: balance;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
  text-wrap: pretty;
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

/* 首次用户欢迎提示 */
.welcome-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.welcome-sparkle {
  color: var(--candy-yellow-dark);
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
  border: 1px solid transparent;
  border-radius: 22px;
  background: var(--candy-blue-dark);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 18px;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(49, 120, 246, 0.2);
  text-decoration: none;
  transition: background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
  cursor: pointer;
}

.btn-explore {
  background: var(--bg-white);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
  color: var(--text-blue-dark);
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

.btn-explore .btn-main-icon {
  background: var(--candy-blue-soft);
  color: var(--text-blue);
}

.btn-text {
  letter-spacing: 0.02em;
}

.btn-arrow {
  transition: transform var(--duration-fast) var(--ease-out);
}

.btn-main:active {
  transform: scale(0.96);
  background: var(--brand-primary-dark);
}

.btn-explore:active {
  background: var(--candy-blue-soft);
  color: var(--text-blue-dark);
}

@media (hover: hover) {
  .btn-main:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(49, 120, 246, 0.3);
  }

  .btn-explore:hover {
    background: var(--candy-blue-soft);
    border-color: var(--brand-primary-light);
    box-shadow: var(--shadow-md);
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

@media (max-height: 640px) {
  .home-page {
    align-items: flex-start;
    padding-top: calc(env(safe-area-inset-top, 0px) + 16px);
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
  }

  .home-shell {
    gap: 12px;
  }

  .logo-area {
    margin-bottom: 0;
  }

  .logo-circle {
    width: 64px;
    height: 64px;
  }

  .hero-panel {
    padding: 18px;
  }

  .hero-topline {
    margin-bottom: 16px;
  }

  .hero-copy {
    margin-bottom: 20px;
  }
}
</style>
