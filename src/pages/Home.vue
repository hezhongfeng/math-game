<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Play, Sparkles } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { TOTAL_LEVELS } from '../config/difficulty'

const router = useRouter()
const { completedCount } = useStorage()
const { playClick } = useSound()
const isReady = ref(false)
const isLeaving = ref(false)
const NAVIGATION_DELAY = 180

function startGame(event) {
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
    router.push('/difficulty')
  }, NAVIGATION_DELAY)
}

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true
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
            <span>来玩吧</span>
          </span>
          <span class="mission-note">{{ TOTAL_LEVELS }}关</span>
        </div>

        <div class="hero-copy">
          <p class="eyebrow">一起算</p>
          <h1 class="title">算一算</h1>
          <p class="subtitle">点开始就能玩。</p>
          <p class="tiny-note">已过 {{ completedCount }} / {{ TOTAL_LEVELS }}</p>
        </div>
      </section>

      <section class="action-panel">
        <button class="btn-main" data-testid="start-challenge-btn" @click="startGame($event)">
          <span class="btn-main-icon">
            <Play :size="24" />
          </span>
          <span>开始</span>
          <ArrowRight :size="22" />
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
  border: 1px solid var(--border-light);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--shadow-sm);
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
.btn-main {
  display: flex;
  align-items: center;
}

.hero-topline {
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
  background: rgba(49, 120, 246, 0.08);
  color: var(--candy-pink-dark);
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
  color: var(--candy-pink-dark);
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

.tiny-note {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: var(--font-sm);
  font-weight: 700;
}

.action-panel {
  border-radius: var(--radius-lg);
  padding: 16px;
}

.btn-main {
  width: 100%;
  border: none;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard);
  justify-content: center;
  gap: 12px;
  height: 64px;
  border-radius: var(--radius-lg);
  background: var(--candy-pink-dark);
  color: white;
  box-shadow: var(--shadow-sm);
  font-size: var(--font-lg);
  font-weight: 800;
}

.btn-main-icon {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}

.btn-main:active {
  transform: scale(0.98);
}

.btn-main.is-leaving {
  opacity: 0.6;
  transform: scale(0.94);
  box-shadow: var(--shadow-sm);
  background: #295fcb;
  transition: all var(--duration-normal) var(--ease-out);
}

@media (hover: hover) {
  .btn-main:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
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

  .action-panel {
    padding: 12px;
  }

  .btn-main {
    height: 58px;
    font-size: var(--font-base);
  }
}
</style>
