<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy } from 'lucide-vue-next'
import { DIFFICULTY_GROUPS, getDifficultyById, TOTAL_LEVELS } from '../config/difficulty'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import DifficultyCard from '../components/DifficultyCard.vue'

const router = useRouter()
const { getBestScore, completedIds, getLeaderboard } = useStorage()
const { playClick, playBack } = useSound()

const isLeaving = ref(false)
const BACK_NAVIGATION_DELAY = 180
const SCROLL_STORAGE_KEY = 'math-game-difficulty-scroll-y'

const completedCount = computed(() => completedIds.value.length)
const progressPercent = computed(() => Math.round((completedCount.value / TOTAL_LEVELS) * 100))

function getSavedScrollY() {
  try {
    return Number(sessionStorage.getItem(SCROLL_STORAGE_KEY))
  } catch (error) {
    console.error('读取关卡页滚动位置失败:', error)
    return 0
  }
}

function saveScrollY() {
  try {
    sessionStorage.setItem(SCROLL_STORAGE_KEY, String(window.scrollY))
  } catch (error) {
    console.error('保存关卡页滚动位置失败:', error)
  }
}

function clearSavedScrollY() {
  try {
    sessionStorage.removeItem(SCROLL_STORAGE_KEY)
  } catch (error) {
    console.error('清理关卡页滚动位置失败:', error)
  }
}

onMounted(async () => {
  const savedScrollY = getSavedScrollY()

  if (!Number.isFinite(savedScrollY) || savedScrollY <= 0) {
    window.scrollTo(0, 0)
    return
  }

  await nextTick()
  requestAnimationFrame(() => {
    window.scrollTo(0, savedScrollY)
    clearSavedScrollY()
  })
})

function goBack(event) {
  if (isLeaving.value) {
    return
  }

  isLeaving.value = true
  clearSavedScrollY()
  playBack()
  const btn = event?.currentTarget
  if (btn) {
    btn.classList.add('is-leaving')
  }
  setTimeout(() => {
    router.push('/')
  }, BACK_NAVIGATION_DELAY)
}

function selectDifficulty(event, difficulty) {
  if (isLeaving.value) {
    return
  }

  isLeaving.value = true
  saveScrollY()
  playClick()
  const card = event?.currentTarget?.closest('.difficulty-card')
  if (card) {
    card.classList.add('is-leaving')
  }
  router.push(`/game/${difficulty.id}`)
}

function getDifficultyBestScore(difficultyId) {
  return getBestScore(difficultyId)
}

function getDifficultyLeaderboard(difficultyId) {
  const difficulty = getDifficultyById(difficultyId)
  return getLeaderboard(difficultyId, difficulty.questionCount)
}

const lockedStatusMap = computed(() => {
  const map = new Map()
  const completed = completedIds.value

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
        <button class="back-btn" aria-label="返回首页" @click="goBack($event)">
          <ArrowLeft :size="18" aria-hidden="true" />
        </button>
        <div class="header-badge">
          <Trophy :size="16" aria-hidden="true" />
          <span>{{ completedCount }}/{{ TOTAL_LEVELS }}</span>
        </div>
      </div>

      <div class="headline-row">
        <div>
          <p class="eyebrow">选择关卡</p>
          <h1 class="title text-child-2xl">选一关开始</h1>
          <p class="subtitle text-child-sm">答对 85% 就能过关，过关后解锁下一关。</p>
        </div>
      </div>

      <div class="progress-panel">
        <div class="progress-copy">
          <span>已过关</span>
          <strong>{{ progressPercent }}%</strong>
        </div>
        <div
          class="progress-track"
          role="progressbar"
          aria-label="关卡完成进度"
          aria-valuemin="0"
          :aria-valuemax="TOTAL_LEVELS"
          :aria-valuenow="completedCount"
        >
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
        </div>
      </div>
    </header>

    <main id="main-content" class="main-content">
      <section
        v-for="group in DIFFICULTY_GROUPS"
        :key="group.name"
        class="section"
      >
        <div class="section-header">
          <h2 class="section-badge" :class="`badge-${group.color}`">{{ group.name }}</h2>
        </div>

        <div class="card-list">
          <DifficultyCard
            v-for="id in group.levels"
            :key="id"
            :difficulty="getDifficultyById(id)"
            :is-locked="isDifficultyLocked(getDifficultyById(id))"
            :is-completed="completedIds.includes(id)"
            :best-score="getDifficultyBestScore(id)"
            :leaderboard="getDifficultyLeaderboard(id)"
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
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 18px) 14px 36px;
}

.header-panel {
  position: sticky;
  top: calc(env(safe-area-inset-top, 0px) + 10px);
  z-index: 10;
  margin-bottom: 18px;
  padding: 18px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
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
  border-radius: 14px;
  font-weight: 700;
}

.back-btn {
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border-light);
}

.header-badge {
  gap: 8px;
}

.back-btn:active {
  transform: scale(0.98);
}

.back-btn.is-leaving {
  opacity: 0.7;
  transform: scale(0.96);
  transition: opacity var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out);
}

@media (hover: hover) {
  .back-btn:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.9);
  }
}

.header-badge {
  padding: 10px 12px;
  color: var(--candy-blue-dark);
  background: rgba(49, 120, 246, 0.08);
}

.headline-row {
  margin-bottom: 18px;
}

.eyebrow {
  margin-bottom: 8px;
  color: var(--candy-blue-dark);
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
  background: rgba(255, 255, 255, 0.9);
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
  background: rgba(49, 120, 246, 0.12);
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--candy-blue), var(--candy-mint));
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
  margin-bottom: 8px;
  padding: 4px 2px;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 0;
  font-weight: 800;
  padding: 0;
  color: var(--text-muted);
  font-size: 12px;
}

.badge-mint {
  background: var(--candy-mint-soft);
  color: var(--candy-mint-dark);
}

.badge-pink {
  background: var(--candy-blue-soft);
  color: var(--candy-blue-dark);
}

.badge-yellow {
  background: var(--candy-yellow-soft);
  color: var(--candy-yellow-dark);
}

.badge-peach {
  background: var(--candy-peach-soft);
  color: var(--candy-peach-dark);
}

.badge-lavender {
  background: var(--candy-lavender-soft);
  color: var(--candy-lavender-dark);
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
    padding: 2px 2px 0;
  }
}
</style>
