<script setup>
import { computed, ref, watch } from 'vue'
import { Award, Home, RotateCcw, Sparkles, Star, Target, TrendingUp } from 'lucide-vue-next'
import { GAME_CONFIG } from '../config/constants'
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
  }
})

const emit = defineEmits(['retry', 'retry-mistakes', 'home'])

const { stats } = useStorage()
const stars = computed(() => getStarCount(props.result.accuracy))
const incorrectQuestions = computed(() => props.result.incorrectQuestions || [])
const hasIncorrectQuestions = computed(() => incorrectQuestions.value.length > 0)
const showMistakesPanel = ref(false)
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
      text: `"${displayKey}" 已经错了 ${persistentMistake.count} 次啦，再多练练它！`
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
        text: '算得越来越快了，反应力大提升！'
      }
    }
  }

  // 3. 累计成就提醒
  if (stats.value.totalCorrect > 0 && stats.value.totalCorrect % 100 === 0) {
    return {
      type: 'milestone',
      icon: Sparkles,
      text: `哇！你已经累计答对了 ${stats.value.totalCorrect} 道题啦！`
    }
  }

  return null
})

const subtitleText = computed(() => {
  if (!didPass.value) {
    return `还差${remainingToPass.value}题。`
  }

  if (!hasIncorrectQuestions.value) {
    return '全对啦。'
  }

  if (props.isNewBest) {
    return '这次更棒。'
  }

  return '过关啦。'
})

watch(() => props.show, (visible) => {
  if (visible) {
    showMistakesPanel.value = false
  }
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

function openMistakesPanel() {
  showMistakesPanel.value = true
}

function closeMistakesPanel() {
  showMistakesPanel.value = false
}

function handleOverlayClick() {
  if (showMistakesPanel.value) {
    closeMistakesPanel()
    return
  }

  handleHome()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="result-overlay" @click="handleOverlayClick">
        <div class="result-card" data-testid="result-modal" @click.stop>
          <template v-if="!showMistakesPanel">
            <div class="topline">
              <span class="result-chip">
                <Target :size="16" />
                <span>{{ didPass ? '过关啦' : '做完啦' }}</span>
              </span>
              <span v-if="isNewBest" class="record-chip">
                <Sparkles :size="14" />
                <span>新纪录</span>
              </span>
            </div>

            <h2 class="result-title">{{ getRatingText(result.accuracy) }}</h2>
            <p class="result-subtitle">{{ subtitleText }}</p>

            <div class="star-rating">
              <Star
                v-for="n in 5"
                :key="n"
                :size="24"
                :class="['star-icon', n <= stars ? 'star-active' : 'star-inactive']"
                fill="currentColor"
              />
            </div>

            <Transition name="insight">
              <div v-if="growthInsight" class="insight-card" :class="`is-${growthInsight.type}`">
                <component :is="growthInsight.icon" :size="18" class="insight-icon" />
                <p class="insight-text">{{ growthInsight.text }}</p>
              </div>
            </Transition>

            <p v-if="hasIncorrectQuestions" class="mistake-note">错了 {{ incorrectQuestions.length }} 题</p>

            <div class="actions">
              <button
                v-if="hasIncorrectQuestions"
                class="btn-secondary"
                type="button"
                @click="openMistakesPanel"
              >
                <span>看错的</span>
              </button>

              <button
                v-if="hasIncorrectQuestions"
                class="btn-primary"
                data-testid="result-retry-mistakes-btn"
                @click="handleRetryMistakes"
              >
                <span class="btn-icon">
                  <RotateCcw :size="18" />
                </span>
                <span>练错的</span>
              </button>

              <button
                v-else
                class="btn-primary"
                data-testid="result-retry-btn"
                @click="handleRetry"
              >
                <span class="btn-icon">
                  <RotateCcw :size="18" />
                </span>
                <span>再来</span>
              </button>

              <button class="btn-secondary ghost" data-testid="result-home-btn" @click="handleHome">
                <span class="btn-icon">
                  <Home :size="18" />
                </span>
                <span>选关</span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="mistakes-headline">
              <div>
                <p class="mistakes-kicker">错题</p>
                <h2 class="result-title">错了这些</h2>
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
                @click="handleRetryMistakes"
              >
                <span class="btn-icon">
                  <RotateCcw :size="18" />
                </span>
                <span>再练</span>
              </button>

              <button class="btn-secondary" type="button" @click="closeMistakesPanel">
                <span>返回</span>
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
  padding: 22px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);
  animation: resultCardIn var(--duration-normal) var(--ease-out);
}

.topline,
.result-chip,
.record-chip,
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
  margin-bottom: 18px;
}

.result-chip,
.record-chip {
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: 800;
}

.result-chip {
  color: var(--candy-pink-dark);
  background: rgba(49, 120, 246, 0.08);
}

.record-chip {
  color: var(--candy-yellow-dark);
  background: var(--candy-yellow-soft);
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
  gap: 10px;
  margin: 18px 0 20px;
}

.star-active {
  color: var(--candy-yellow);
  animation: starCelebrate var(--duration-fast) var(--ease-out) both;
}

.star-icon:nth-child(2) {
  animation-delay: 40ms;
}

.star-icon:nth-child(3) {
  animation-delay: 80ms;
}

.star-icon:nth-child(4) {
  animation-delay: 120ms;
}

.star-icon:nth-child(5) {
  animation-delay: 160ms;
}

.star-inactive {
  color: #ffe8e0;
}

.insight-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: #f8fafc;
  border: 1px solid #e2e8f0;
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
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(242, 140, 82, 0.14);
}

.mistake-expression {
  gap: 8px;
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
  min-width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
}

.mistake-operator-plus,
.mistake-operator-minus {
  background: rgba(49, 120, 246, 0.12);
  border-color: rgba(49, 120, 246, 0.24);
}

.mistake-operator-plus {
  color: #0F3D91;
}

.mistake-operator-minus {
  color: #0D6B57;
  background: rgba(46, 196, 182, 0.14);
  border-color: rgba(46, 196, 182, 0.26);
}

.mistake-equals {
  color: #8A5A00;
  background: rgba(245, 201, 74, 0.16);
  border-color: rgba(245, 201, 74, 0.26);
  min-width: 28px;
  height: 28px;
  font-size: 18px;
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
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 52px;
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  font-weight: 800;
}

.btn-icon {
  width: 28px;
  height: 28px;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
}

.btn-primary {
  border: none;
  color: white;
  background: var(--candy-pink-dark);
}

.btn-secondary {
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.92);
}

.btn-secondary.ghost {
  color: var(--text-secondary);
}

.btn-secondary .btn-icon {
  background: rgba(49, 120, 246, 0.08);
}

.btn-primary:active,
.btn-secondary:active {
  transform: scale(0.98);
}

@media (hover: hover) {
  .btn-primary:hover {
    background: #295fcb;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.98);
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
