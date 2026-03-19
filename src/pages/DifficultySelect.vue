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
const { playClick, playBack } = useSound()

const completedDifficulties = ref(getCompletedDifficulties())

const completedCount = computed(() => completedDifficulties.value.length)
const progressPercent = computed(() => Math.round((completedCount.value / TOTAL_LEVELS) * 100))

onMounted(() => {
  window.scrollTo(0, 0)
})

function goBack() {
  playBack()
  router.push('/')
}

function selectDifficulty(difficulty) {
  playClick()
  router.push(`/game/${difficulty.id}`)
}

function getDifficultyBestScore(difficultyId) {
  return getBestScore(difficultyId)
}

const lockedStatusMap = computed(() => {
  const map = new Map()
  const completed = completedDifficulties.value

  DIFFICULTY_GROUPS.forEach((group) => {
    group.levels.forEach((id) => {
      if (id === 1) {
        map.set(id, false)
        return
      }

      map.set(id, !completed.includes(id - 1))
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
    <header class="header-panel">
      <div class="nav-row">
        <button class="back-btn text-child-sm" @click="goBack">
          <ArrowLeft :size="18" />
          <span>返回</span>
        </button>
        <div class="header-badge">
          <Trophy :size="16" />
          <span>{{ completedCount }}/{{ TOTAL_LEVELS }}</span>
        </div>
      </div>

      <div class="headline-row">
        <div>
          <p class="eyebrow">Mission Levels</p>
          <h1 class="title text-child-2xl">选择关卡</h1>
          <p class="subtitle text-child-sm">按顺序通关，逐步解锁更高难度。</p>
        </div>
      </div>

      <div class="progress-panel">
        <div class="progress-copy">
          <span>总进度</span>
          <strong>{{ progressPercent }}%</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <section
        v-for="group in DIFFICULTY_GROUPS"
        :key="group.name"
        class="section"
      >
        <div class="section-header">
          <div class="section-copy">
            <span class="section-badge" :class="`badge-${group.color}`">{{ group.name }}</span>
            <p class="section-note">完成本组后解锁下一阶段</p>
          </div>
          <span class="section-count text-child-sm">{{ group.levels.length }} 关</span>
        </div>

        <div class="card-list">
          <DifficultyCard
            v-for="id in group.levels"
            :key="id"
            :difficulty="getDifficultyById(id)"
            :is-locked="isDifficultyLocked(getDifficultyById(id))"
            :is-completed="completedDifficulties.includes(id)"
            :best-score="getDifficultyBestScore(id)"
            @select="selectDifficulty"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 18px 14px 36px;
}

.header-panel {
  position: sticky;
  top: 10px;
  z-index: 10;
  margin-bottom: 18px;
  padding: 18px;
  border-radius: var(--radius-xl);
  background: var(--bg-panel);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(18px);
}

.nav-row,
.progress-copy,
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-row {
  margin-bottom: 18px;
}

.back-btn,
.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 14px;
  font-weight: 700;
}

.back-btn {
  padding: 10px 14px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--border-light);
}

.back-btn:active {
  transform: scale(0.98);
}

@media (hover: hover) {
  .back-btn:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.9);
  }
}

.header-badge {
  padding: 10px 12px;
  color: var(--hero-blue-dark);
  background: var(--hero-blue-soft);
}

.headline-row {
  margin-bottom: 18px;
}

.eyebrow {
  margin-bottom: 8px;
  color: var(--hero-blue);
  font-size: var(--font-sm);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.title {
  color: var(--text-primary);
  font-weight: 800;
}

.subtitle {
  margin-top: 8px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.progress-panel {
  padding: 16px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--border-light);
}

.progress-copy {
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 700;
}

.progress-copy strong {
  color: var(--text-primary);
}

.progress-track {
  height: 10px;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: #dfe8f4;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--hero-blue), var(--win-green));
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section {
  opacity: 1;
  transform: none;
}

.section-header {
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px 14px;
}

.section-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-badge,
.section-count {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: var(--radius-full);
  font-weight: 800;
}

.section-badge {
  padding: 7px 12px;
  font-size: var(--font-sm);
}

.section-note {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 600;
}

.section-count {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
}

.badge-green {
  background: var(--win-green-soft);
  color: var(--win-green-dark);
}

.badge-blue {
  background: var(--hero-blue-soft);
  color: var(--hero-blue-dark);
}

.badge-yellow {
  background: var(--energy-yellow-soft);
  color: var(--energy-yellow-dark);
}

.badge-orange {
  background: rgba(255, 122, 69, 0.12);
  color: var(--warning-orange-dark);
}

.badge-purple {
  background: var(--master-purple-soft);
  color: var(--master-purple-dark);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 768px) {
  .page {
    max-width: 980px;
    margin: 0 auto;
    padding: 24px 20px 40px;
  }

  .card-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .page {
    padding: 12px 10px 28px;
  }

  .header-panel {
    top: 8px;
    margin-bottom: 14px;
    padding: 14px;
    border-radius: 24px;
  }

  .nav-row {
    margin-bottom: 14px;
  }

  .back-btn,
  .header-badge {
    padding: 9px 10px;
  }

  .title {
    font-size: 26px;
    line-height: 1.2;
  }

  .subtitle {
    margin-top: 6px;
    line-height: 1.55;
  }

  .progress-panel {
    padding: 14px;
  }

  .section-header {
    align-items: flex-start;
    padding: 6px 2px 2px;
  }

  .section-count {
    padding: 7px 10px;
  }
}
</style>
