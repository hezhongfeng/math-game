<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Play, Sparkles, Target, Trophy } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { TOTAL_LEVELS } from '../config/difficulty'

const router = useRouter()
const { bestScores } = useStorage()
const { playSound, forceInitializeAudioContext } = useSound()
const isReady = ref(false)

const completedCount = computed(() => Object.keys(bestScores.value).length)
const progress = computed(() => Math.round((completedCount.value / TOTAL_LEVELS) * 100))

function startGame() {
  playSound('click')
  router.push('/difficulty')
}

function viewProgress() {
  playSound('click')
  router.push('/difficulty')
}

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true
  })

  forceInitializeAudioContext().catch((error) => {
    console.error('Failed to initialize audio context:', error)
  })
})
</script>

<template>
  <div class="home-page">
    <div class="home-shell" :class="{ 'is-ready': isReady }">
      <section class="hero-panel">
        <div class="hero-topline">
          <span class="mission-chip">
            <Sparkles :size="16" />
            <span>任务舱已就绪</span>
          </span>
          <span class="mission-note">10 分钟心算</span>
        </div>

        <div class="hero-copy">
          <p class="eyebrow">Math Mission</p>
          <h1 class="title">数学大冒险</h1>
          <p class="subtitle">专注做题，快速推进，每次训练都更稳一点。</p>
        </div>

        <div class="mission-progress">
          <div class="progress-header">
            <span>总进度</span>
            <strong>{{ progress }}%</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>

        <div class="stats-grid">
          <article class="stat-card">
            <div class="stat-icon primary">
              <Trophy :size="20" />
            </div>
            <div>
              <p class="stat-value">{{ completedCount }}</p>
              <p class="stat-label">已完成关卡</p>
            </div>
          </article>

          <article class="stat-card">
            <div class="stat-icon success">
              <Target :size="20" />
            </div>
            <div>
              <p class="stat-value">{{ TOTAL_LEVELS }}</p>
              <p class="stat-label">总关卡</p>
            </div>
          </article>
        </div>
      </section>

      <section class="action-panel">
        <button class="btn-main" @click="startGame">
          <Play :size="22" />
          <span>开始挑战</span>
          <ArrowRight :size="20" />
        </button>

        <button class="btn-secondary" @click="viewProgress">
          查看进度
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
}

.home-shell {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-panel,
.action-panel {
  border: 1px solid rgba(255, 255, 255, 0.65);
  background: var(--bg-panel);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-panel);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out);
}

.home-shell .hero-panel {
  transition-delay: 40ms;
}

.home-shell .action-panel {
  transition-delay: 90ms;
}

.home-shell.is-ready .hero-panel,
.home-shell.is-ready .action-panel {
  opacity: 1;
  transform: translateY(0);
}

.hero-panel {
  border-radius: var(--radius-xl);
  padding: 22px;
}

.hero-topline,
.progress-header,
.stat-card,
.btn-main {
  display: flex;
  align-items: center;
}

.hero-topline,
.progress-header {
  justify-content: space-between;
}

.hero-topline {
  margin-bottom: 24px;
}

.mission-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-full);
  background: var(--hero-blue-soft);
  color: var(--hero-blue-dark);
  font-size: var(--font-sm);
  font-weight: 700;
}

.mission-note {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 600;
}

.hero-copy {
  margin-bottom: 28px;
}

.eyebrow {
  margin-bottom: 10px;
  color: var(--hero-blue);
  font-size: var(--font-sm);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.title {
  margin-bottom: 10px;
  color: var(--text-primary);
  font-size: clamp(38px, 10vw, 52px);
  line-height: 1.08;
  font-weight: 800;
}

.subtitle {
  color: var(--text-secondary);
  font-size: var(--font-md);
  line-height: 1.7;
}

.mission-progress {
  margin-bottom: 22px;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--border-light);
}

.progress-header {
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 700;
}

.progress-header strong {
  color: var(--text-primary);
}

.progress-track {
  height: 10px;
  border-radius: var(--radius-full);
  background: #dfe8f4;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--hero-blue), var(--win-green));
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  gap: 12px;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--border-light);
}

.stat-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

.stat-icon.primary {
  background: var(--hero-blue-soft);
  color: var(--hero-blue-dark);
}

.stat-icon.success {
  background: var(--win-green-soft);
  color: var(--win-green-dark);
}

.stat-value {
  color: var(--text-primary);
  font-size: 30px;
  line-height: 1.1;
  font-weight: 800;
}

.stat-label {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 600;
}

.action-panel {
  border-radius: var(--radius-lg);
  padding: 16px;
}

.btn-main,
.btn-secondary {
  width: 100%;
  border: none;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard);
}

.btn-main {
  justify-content: center;
  gap: 12px;
  height: 64px;
  margin-bottom: 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--hero-blue) 0%, var(--hero-blue-dark) 100%);
  color: white;
  box-shadow: var(--shadow-md), var(--glow-blue);
  font-size: var(--font-lg);
  font-weight: 800;
}

.btn-secondary {
  height: 52px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  color: var(--text-secondary);
  font-size: var(--font-base);
  font-weight: 700;
}

.btn-main:active,
.btn-secondary:active {
  transform: scale(0.98);
}

@media (hover: hover) {
  .stat-card:hover {
    border-color: var(--border-strong);
  }

  .btn-main:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg), var(--glow-blue);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.92);
    color: var(--text-primary);
  }
}

@media (max-width: 959px), (max-height: 860px) {
  .hero-panel,
  .action-panel {
    transition-duration: var(--duration-fast);
    transition-delay: 0ms;
  }

  .btn-main:hover {
    transform: none;
    box-shadow: var(--shadow-md);
  }
}

@media (min-width: 768px) {
  .home-shell {
    max-width: 500px;
  }

  .hero-panel {
    padding: 28px;
  }
}

@media (max-width: 420px) {
  .home-page {
    padding: 16px 12px;
  }

  .home-shell {
    gap: 14px;
  }

  .hero-panel,
  .action-panel {
    border-radius: 24px;
  }

  .hero-panel {
    padding: 18px;
  }

  .hero-topline {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 18px;
  }

  .hero-copy {
    margin-bottom: 20px;
  }

  .title {
    font-size: 34px;
  }

  .subtitle {
    font-size: var(--font-base);
    line-height: 1.6;
  }

  .mission-progress {
    margin-bottom: 16px;
    padding: 14px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 14px;
  }

  .stat-value {
    font-size: 26px;
  }

  .action-panel {
    padding: 12px;
  }

  .btn-main {
    height: 58px;
    font-size: var(--font-base);
  }

  .btn-secondary {
    height: 48px;
  }
}
</style>
