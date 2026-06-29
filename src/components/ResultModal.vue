<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { Award, Clock3, Home, RotateCcw, Sparkles, Star, Target, TrendingUp } from 'lucide-vue-next'
import { GAME_CONFIG } from '../config/constants'
import { formatPreciseTime } from '../utils/format'
import { getRatingText, getStarCount } from '../utils/stars'
import { useStorage } from '../composables/useStorage'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  result: {
    type: Object,
    required: true
  },
  isNewBest: {
    type: Boolean,
    default: false
  },
  difficultyId: {
    type: [Number, String],
    required: true
  },
  leaderboard: {
    type: Array,
    default: () => []
  },
  leaderboardRank: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['retry', 'retry-mistakes', 'home'])

const { stats } = useStorage()
const stars = computed(() => getStarCount(props.result.accuracy))
const incorrectQuestions = computed(() => props.result.incorrectQuestions || [])
const hasIncorrectQuestions = computed(() => incorrectQuestions.value.length > 0)
const isReviewRound = computed(() => props.result.isReviewRound === true)
const showMistakesPanel = ref(false)
const dialogRef = ref(null)
const minCorrectCount = computed(() => Math.ceil((props.result.totalCount || 0) * GAME_CONFIG.PASS_ACCURACY / 100))
const didPass = computed(() => props.result.accuracy >= GAME_CONFIG.PASS_ACCURACY)
const remainingToPass = computed(() => Math.max(0, minCorrectCount.value - (props.result.correctCount || 0)))

// 计算成长洞察
const growthInsight = computed(() => {
  if (!props.show) return null

  // 1. 检查是否有高频错题（在这局也错了）
  const ledger = stats.value.mistakeLedger
  const currentMistakeKeys = incorrectQuestions.value.map(q => `${q.operand1}${q.operator}${q.operand2}`)
  
  const persistentMistake = currentMistakeKeys
    .map(key => ({ key, count: ledger[key]?.count || 0 }))
    .filter(m => m.count >= 3)
    .sort((a, b) => b.count - a.count)[0]

  if (persistentMistake) {
    const displayKey = persistentMistake.key.replace('+', ' + ').replace('-', ' - ')
    return {
      type: 'warning',
      icon: Award,
      text: `“${displayKey}”再练一遍，就会更熟。`
    }
  }

  // 2. 检查速度是否明显进步
  const dStats = stats.value.difficultyStats[props.difficultyId]
  if (dStats && dStats.totalPlayed >= 3 && props.result.correctCount > 0) {
    const currentAvg = props.result.duration / props.result.totalCount
    if (currentAvg < dStats.avgTime * 0.85) {
      return {
        type: 'success',
        icon: TrendingUp,
        text: '这次平均每题用时更短了！'
      }
    }
  }

  // 3. 累计成就提醒
  if (stats.value.totalCorrect > 0 && stats.value.totalCorrect % 100 === 0) {
    return {
      type: 'milestone',
      icon: Sparkles,
      text: `你已经累计答对 ${stats.value.totalCorrect} 题啦！`
    }
  }

  return null
})

const subtitleText = computed(() => {
  if (isReviewRound.value) {
    return hasIncorrectQuestions.value
      ? `还有${incorrectQuestions.value.length}题需要再练。`
      : '错题都答对啦。'
  }

  if (!didPass.value) {
    return `再答对${remainingToPass.value}题就能过关。`
  }

  if (!hasIncorrectQuestions.value) {
    return '这一关全部答对啦。'
  }

  if (props.isNewBest) {
    return '刷新最好成绩啦。'
  }

  return '已经过关，错题再练一遍会更熟。'
})

const resultChipText = computed(() => {
  if (isReviewRound.value) return '错题复习'
  return didPass.value ? '过关啦' : '完成啦'
})

const resultTitle = computed(() => {
  if (isReviewRound.value) return '复习完成'
  return getRatingText(props.result.accuracy)
})

const showLeaderboardRank = computed(() => didPass.value && props.leaderboardRank)

let previousActiveElement = null
let previousBodyOverflow = ''
let appWasInert = false
let dialogIsActive = false

function getFocusableElements() {
  if (!dialogRef.value) return []

  return Array.from(dialogRef.value.querySelectorAll(
    'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
  ))
}

async function activateDialog() {
  if (dialogIsActive) return

  dialogIsActive = true
  previousActiveElement = document.activeElement
  previousBodyOverflow = document.body.style.overflow

  const app = document.querySelector('#app')
  appWasInert = app?.inert || false
  if (app) app.inert = true
  document.body.style.overflow = 'hidden'

  await nextTick()
  const initialFocus = dialogRef.value?.querySelector('[data-dialog-initial-focus]')
  initialFocus?.focus()
  if (!initialFocus) dialogRef.value?.focus()
}

function deactivateDialog() {
  if (!dialogIsActive) return

  dialogIsActive = false
  const app = document.querySelector('#app')
  if (app) app.inert = appWasInert
  document.body.style.overflow = previousBodyOverflow

  if (previousActiveElement?.isConnected) {
    previousActiveElement.focus()
  }
  previousActiveElement = null
}

watch(() => props.show, async (visible) => {
  if (visible) {
    showMistakesPanel.value = false
    await activateDialog()
    return
  }

  deactivateDialog()
}, { immediate: true })

onUnmounted(() => {
  deactivateDialog()
})

function handleRetry() {
  emit('retry')
}

function handleHome() {
  emit('home')
}

function handleRetryMistakes() {
  emit('retry-mistakes')
}

async function focusInitialDialogAction() {
  await nextTick()
  dialogRef.value?.querySelector('[data-dialog-initial-focus]')?.focus()
}

async function openMistakesPanel() {
  showMistakesPanel.value = true
  await focusInitialDialogAction()
}

async function closeMistakesPanel() {
  showMistakesPanel.value = false
  await focusInitialDialogAction()
}

function handleDialogKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    if (showMistakesPanel.value) {
      closeMistakesPanel()
      return
    }

    handleHome()
    return
  }

  if (event.key !== 'Tab') return

  const focusableElements = getFocusableElements()
  if (!focusableElements.length) {
    event.preventDefault()
    dialogRef.value?.focus()
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="result-overlay">
        <div
          ref="dialogRef"
          class="result-card"
          data-testid="result-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-dialog-title"
          :aria-describedby="showMistakesPanel ? undefined : 'result-dialog-subtitle'"
          tabindex="-1"
          @click.stop
          @keydown="handleDialogKeydown"
        >
          <template v-if="!showMistakesPanel">
            <div class="topline">
              <span class="result-chip">
                <Target :size="16" aria-hidden="true" />
                <span>{{ resultChipText }}</span>
              </span>
              <span v-if="isNewBest" class="record-chip">
                <Sparkles :size="14" aria-hidden="true" />
                <span>新纪录</span>
              </span>
            </div>

            <h2 id="result-dialog-title" class="result-title">{{ resultTitle }}</h2>
            <p id="result-dialog-subtitle" class="result-subtitle">{{ subtitleText }}</p>

            <div class="star-rating">
              <Star
                v-for="n in 5"
                :key="n"
                :size="24"
                :class="['star-icon', n <= stars ? 'star-active' : 'star-inactive']"
                fill="currentColor"
                aria-hidden="true"
              />
            </div>

            <Transition name="insight">
              <div v-if="growthInsight" class="insight-card" :class="`is-${growthInsight.type}`">
                <component :is="growthInsight.icon" :size="18" class="insight-icon" aria-hidden="true" />
                <p class="insight-text">{{ growthInsight.text }}</p>
              </div>
            </Transition>

            <section v-if="!isReviewRound" class="leaderboard-panel">
              <div class="leaderboard-head">
                <div class="leaderboard-title-wrap">
                  <Clock3 :size="16" aria-hidden="true" />
                  <strong>本关计时榜</strong>
                </div>
                <span v-if="showLeaderboardRank" class="leaderboard-rank">第 {{ leaderboardRank }} 名</span>
              </div>

              <div v-if="leaderboard.length" class="leaderboard-list">
                <div
                  v-for="(item, index) in leaderboard"
                  :key="`${item.completedAt}-${item.durationMs}-${index}`"
                  class="leaderboard-item"
                  :class="{ 'is-current': leaderboardRank === index + 1 }"
                >
                  <span class="leaderboard-position">{{ index + 1 }}</span>
                  <span class="leaderboard-time">{{ formatPreciseTime(item.durationMs) }}</span>
                </div>
              </div>

              <p v-else class="leaderboard-empty">过关后，最快用时会记录在这里。</p>
            </section>

            <p v-if="hasIncorrectQuestions" class="mistake-note">本次错题 {{ incorrectQuestions.length }} 题</p>

            <div class="actions">
              <button
                v-if="hasIncorrectQuestions"
                class="btn-secondary"
                type="button"
                @click="openMistakesPanel"
              >
                <span>查看错题</span>
              </button>

              <button
                v-if="hasIncorrectQuestions"
                class="btn-primary"
                data-testid="result-retry-mistakes-btn"
                data-dialog-initial-focus
                @click="handleRetryMistakes"
              >
                <span class="btn-icon">
                  <RotateCcw :size="18" aria-hidden="true" />
                </span>
                <span>重练错题</span>
              </button>

              <button
                v-else
                class="btn-primary"
                data-testid="result-retry-btn"
                data-dialog-initial-focus
                @click="handleRetry"
              >
                <span class="btn-icon">
                  <RotateCcw :size="18" aria-hidden="true" />
                </span>
                <span>再练本关</span>
              </button>

              <button class="btn-secondary ghost" data-testid="result-home-btn" @click="handleHome">
                <span class="btn-icon">
                  <Home :size="18" aria-hidden="true" />
                </span>
                <span>选择关卡</span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="mistakes-headline">
              <div>
                <p class="mistakes-kicker">错题</p>
                <h2 id="result-dialog-title" class="result-title">本次错题</h2>
              </div>
              <span class="mistakes-count">{{ incorrectQuestions.length }}题</span>
            </div>

            <section class="mistakes-section">
              <div class="mistakes-list">
                <article
                  v-for="item in incorrectQuestions"
                  :key="`${item.operand1}-${item.operator}-${item.operand2}-${item.missingPart}-${item.userAnswer}`"
                  class="mistake-card"
                >
                  <div class="mistake-expression">
                    <span>{{ item.missingPart === 'operand1' ? '?' : item.operand1 }}</span>
                    <span
                      class="mistake-symbol"
                      :class="item.operator === '+' ? 'mistake-operator-plus' : 'mistake-operator-minus'"
                    >
                      {{ item.operator }}
                    </span>
                    <span>{{ item.missingPart === 'operand2' ? '?' : item.operand2 }}</span>
                    <span class="mistake-symbol mistake-equals">=</span>
                    <strong>{{ item.missingPart === 'answer' ? item.correctAnswer : item.result }}</strong>
                  </div>
                  <p class="mistake-answer">
                    你写：<span>{{ item.userAnswer }}</span>
                  </p>
                </article>
              </div>
            </section>

            <div class="actions">
              <button
                class="btn-primary"
                data-testid="result-retry-mistakes-btn"
                data-dialog-initial-focus
                @click="handleRetryMistakes"
              >
                <span class="btn-icon">
                  <RotateCcw :size="18" aria-hidden="true" />
                </span>
                <span>重练错题</span>
              </button>

              <button class="btn-secondary" type="button" @click="closeMistakesPanel">
                <span>返回结算</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.result-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(18, 30, 49, 0.28);
}

.result-card {
  width: min(100%, 420px);
  max-height: min(88vh, 720px);
  overflow: auto;
  overscroll-behavior: contain;
  padding: 24px;
  border-radius: var(--radius-xl);
  background: var(--bg-panel-strong);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-lg);
  animation: pop var(--duration-normal) var(--ease-standard);
}

.topline,
.result-chip,
.record-chip,
.leaderboard-head,
.leaderboard-title-wrap,
.leaderboard-item,
.actions,
.btn-primary,
.btn-secondary,
.btn-icon,
.mistakes-headline,
.mistake-expression {
  display: flex;
  align-items: center;
}

.topline {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.result-chip,
.record-chip {
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: 800;
}

.result-chip {
  color: var(--brand-primary);
  background: var(--brand-primary-soft);
}

.record-chip {
  color: var(--brand-warning-dark);
  background: var(--brand-warning-soft);
}

.result-title {
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: var(--font-h1);
  font-weight: 800;
}

.result-subtitle {
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.7;
}

.star-rating {
  display: flex;
  gap: 12px;
  margin: 20px 0 24px;
}

.star-active {
  color: var(--brand-reward);
  animation: success-jump var(--duration-slow) var(--ease-standard) both;
}

.star-icon:nth-child(1) { animation-delay: 50ms; }
.star-icon:nth-child(2) { animation-delay: 150ms; }
.star-icon:nth-child(3) { animation-delay: 250ms; }
.star-icon:nth-child(4) { animation-delay: 350ms; }
.star-icon:nth-child(5) { animation-delay: 450ms; }

.star-inactive {
  color: var(--border-light);
}

.insight-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--card-gray-bg);
  border: 1px solid var(--card-gray-border);
}

.insight-card.is-warning {
  background: rgba(255, 107, 107, 0.06);
  border-color: rgba(255, 107, 107, 0.14);
}

.insight-card.is-warning .insight-icon {
  color: var(--candy-red-dark);
}

.insight-card.is-success {
  background: rgba(46, 196, 182, 0.08);
  border-color: rgba(46, 196, 182, 0.16);
}

.insight-card.is-success .insight-icon {
  color: var(--candy-mint-dark);
}

.insight-card.is-milestone {
  background: rgba(245, 201, 74, 0.12);
  border-color: rgba(245, 201, 74, 0.22);
}

.insight-card.is-milestone .insight-icon {
  color: var(--candy-yellow-dark);
}

.insight-icon {
  flex-shrink: 0;
}

.insight-text {
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: 700;
  line-height: 1.5;
}

.insight-enter-active,
.insight-leave-active {
  transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
}

.insight-enter-from,
.insight-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.leaderboard-panel {
  margin: 0 0 20px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid var(--border-light);
}

.leaderboard-head {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.leaderboard-title-wrap {
  gap: 8px;
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: 800;
}

.leaderboard-rank {
  color: var(--brand-primary);
  font-size: var(--font-sm);
  font-weight: 800;
}

.leaderboard-list {
  display: grid;
  gap: 8px;
}

.leaderboard-item {
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-xs);
  background: var(--bg-white);
  border: 1px solid var(--border-light);
}

.leaderboard-item.is-current {
  border-color: rgba(49, 120, 246, 0.24);
  background: var(--brand-primary-soft);
}

.leaderboard-position {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 700;
}

.leaderboard-time {
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: 800;
}

.leaderboard-empty {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 700;
  line-height: 1.6;
}

.mistakes-section {
  margin-bottom: 18px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--border-light);
}

.mistake-note {
  margin-bottom: 18px;
  color: var(--text-secondary);
  text-align: center;
  font-size: var(--font-base);
  font-weight: 700;
}

.mistakes-headline {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.mistakes-kicker {
  margin-bottom: 6px;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 700;
}

.mistakes-count {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 700;
}

.mistakes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 320px;
  overflow: auto;
}

.mistake-card {
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

.mistake-expression {
  gap: 10px;
  flex-wrap: wrap;
  color: var(--text-primary);
  font-size: var(--font-lg);
  font-weight: 800;
  line-height: 1.4;
}

.mistake-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  border-radius: var(--radius-xs);
  border: none;
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
}

.mistake-operator-plus {
  color: var(--operator-add);
  background: var(--brand-primary-soft);
}

.mistake-operator-minus {
  color: var(--operator-subtract);
  background: var(--brand-success-soft);
}

.mistake-equals {
  color: var(--operator-equals);
  background: var(--brand-reward-soft);
}

.mistake-expression strong {
  color: var(--candy-mint-dark);
}

.mistake-answer {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 700;
}

.mistake-answer span {
  color: var(--candy-red-dark);
}

.actions {
  flex-direction: column;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  border-radius: var(--radius-md);
  font-size: var(--font-md);
  font-weight: 800;
  transition: background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard);
}

.btn-icon {
  width: 32px;
  height: 32px;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  flex-shrink: 0;
}

.btn-primary {
  border: none;
  color: white;
  background: var(--brand-primary);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(-1px) scale(0.97);
  box-shadow: var(--shadow-sm);
}

.btn-secondary {
  border: 2px solid var(--border-light);
  color: var(--brand-primary);
  background: var(--bg-white);
}

.btn-secondary .btn-icon {
  background: var(--brand-primary-soft);
}

.btn-secondary.ghost {
  color: var(--text-secondary);
}

.btn-secondary.ghost .btn-icon {
  background: var(--border-light);
}

@media (hover: hover) {
  .btn-primary:hover {
    background: var(--brand-primary);
    box-shadow: var(--brand-primary-glow), var(--shadow-lg);
    transform: translateY(-2px);
  }

  .btn-secondary:hover {
    border-color: var(--brand-primary);
    background: var(--brand-primary-soft);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes resultCardIn {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.985);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes starCelebrate {
  0% {
    transform: scale(0.85);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .result-card,
  .star-active {
    animation: none;
  }
}

@media (max-width: 420px) {
  .result-card {
    padding: 18px;
    border-radius: var(--radius-lg);
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
