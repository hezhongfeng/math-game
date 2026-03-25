<script setup>
import { computed, ref, watch } from 'vue'
import { CheckCircle, Clock, Home, RotateCcw, Sparkles, Star, Target } from 'lucide-vue-next'
import { formatTime } from '../utils/format'
import { getRatingText, getStarCount } from '../utils/stars'

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
  }
})

const emit = defineEmits(['retry', 'retry-mistakes', 'home'])

const stars = computed(() => getStarCount(props.result.accuracy))
const incorrectQuestions = computed(() => props.result.incorrectQuestions || [])
const hasIncorrectQuestions = computed(() => incorrectQuestions.value.length > 0)
const showMistakesPanel = ref(false)

const subtitleText = computed(() => {
  if (!hasIncorrectQuestions.value) {
    return '这一轮全对。'
  }

  if (props.isNewBest) {
    return '这次最好，先看错题。'
  }

  return '先看错题，再练一轮。'
})

const summaryText = computed(() => {
  if (!hasIncorrectQuestions.value) {
    return '都答对了。'
  }

  return `有 ${incorrectQuestions.value.length} 题答错了。`
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
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="result-overlay">
        <div class="result-card" data-testid="result-modal">
          <template v-if="!showMistakesPanel">
            <div class="topline">
              <span class="result-chip">
                <Target :size="16" />
                <span>完成了</span>
              </span>
              <span v-if="isNewBest" class="record-chip">
                <Sparkles :size="14" />
                <span>最好成绩</span>
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

            <section class="summary-section">
              <div class="section-head">
                <h3 class="section-title">本轮表现</h3>
                <p class="section-note">{{ summaryText }}</p>
              </div>

              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon score">
                    <Target :size="18" />
                  </div>
                  <div>
                    <p class="stat-label">得分</p>
                    <p class="stat-value">{{ result.score }}</p>
                  </div>
                </div>

                <div class="stat-card">
                  <div class="stat-icon correct">
                    <CheckCircle :size="18" />
                  </div>
                  <div>
                    <p class="stat-label">正确</p>
                    <p class="stat-value">{{ result.correctCount }}/{{ result.totalCount }}</p>
                  </div>
                </div>

                <div class="stat-card">
                  <div class="stat-icon accuracy">
                    <Star :size="18" />
                  </div>
                  <div>
                    <p class="stat-label">正确率</p>
                    <p class="stat-value">{{ result.accuracy }}%</p>
                  </div>
                </div>

                <div class="stat-card">
                  <div class="stat-icon time">
                    <Clock :size="18" />
                  </div>
                  <div>
                    <p class="stat-label">用时</p>
                    <p class="stat-value">{{ formatTime(result.duration) }}</p>
                  </div>
                </div>
              </div>
            </section>

            <div class="actions">
              <button
                v-if="hasIncorrectQuestions"
                class="btn-secondary"
                type="button"
                @click="openMistakesPanel"
              >
                <span>看错题</span>
              </button>

              <button
                v-if="hasIncorrectQuestions"
                class="btn-primary"
                data-testid="result-retry-mistakes-btn"
                @click="handleRetryMistakes"
              >
                <RotateCcw :size="18" />
                <span>练错题</span>
              </button>

              <button
                v-else
                class="btn-primary"
                data-testid="result-retry-btn"
                @click="handleRetry"
              >
                <RotateCcw :size="18" />
                <span>再玩一次</span>
              </button>

              <button class="btn-secondary ghost" data-testid="result-home-btn" @click="handleHome">
                <Home :size="18" />
                <span>回到选关</span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="mistakes-headline">
              <div>
                <p class="mistakes-kicker">错题</p>
                <h2 class="result-title">看看哪题错了</h2>
              </div>
              <span class="mistakes-count">{{ incorrectQuestions.length }} 题</span>
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
                    <span>{{ item.operator }}</span>
                    <span>{{ item.missingPart === 'operand2' ? '?' : item.operand2 }}</span>
                    <span>=</span>
                    <strong>{{ item.missingPart === 'answer' ? item.correctAnswer : item.result }}</strong>
                  </div>
                  <p class="mistake-answer">
                    我写的是：<span>{{ item.userAnswer }}</span>
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
                <RotateCcw :size="18" />
                <span>开始练习</span>
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

.summary-section,
.mistakes-section {
  margin-bottom: 18px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--border-light);
}

.section-head {
  margin-bottom: 10px;
}

.section-title {
  color: var(--text-primary);
  font-size: var(--font-base);
  font-weight: 800;
}

.section-note {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border-light);
}

.stat-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xs);
}

.stat-icon.score {
  color: var(--candy-pink-dark);
  background: var(--candy-pink-soft);
}

.stat-icon.correct {
  color: var(--candy-mint-dark);
  background: var(--candy-mint-soft);
}

.stat-icon.accuracy {
  color: var(--candy-yellow-dark);
  background: var(--candy-yellow-soft);
}

.stat-icon.time {
  color: var(--candy-peach-dark);
  background: var(--candy-peach-soft);
}

.stat-label {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 600;
}

.stat-value {
  color: var(--text-primary);
  font-size: var(--font-lg);
  font-weight: 800;
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
