<script setup>
import { computed } from 'vue'
import { CheckCircle, Clock, Home, RotateCcw, Sparkles, Star, Target } from 'lucide-vue-next'
import { useSound } from '../composables/useSound'
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

const emit = defineEmits(['retry', 'home'])
const { playSound } = useSound()

const stars = computed(() => getStarCount(props.result.accuracy))

function handleRetry() {
  playSound('click')
  emit('retry')
}

function handleHome() {
  playSound('click')
  emit('home')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="result-overlay">
        <div class="result-card">
          <div class="topline">
            <span class="result-chip">
              <Target :size="16" />
              <span>已完成</span>
            </span>
            <span v-if="isNewBest" class="record-chip">
              <Sparkles :size="14" />
              <span>新纪录</span>
            </span>
          </div>

          <h2 class="result-title">{{ getRatingText(result.accuracy) }}</h2>
          <p class="result-subtitle">这次表现不错，继续保持。</p>

          <div class="star-rating">
            <Star
              v-for="n in 5"
              :key="n"
              :size="24"
              :class="['star-icon', n <= stars ? 'star-active' : 'star-inactive']"
              fill="currentColor"
            />
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

          <div class="actions">
            <button class="btn-primary" @click="handleRetry">
              <RotateCcw :size="18" />
              <span>再来一次</span>
            </button>

            <button class="btn-secondary" @click="handleHome">
              <Home :size="18" />
              <span>返回关卡页</span>
            </button>
          </div>
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
  background: rgba(18, 30, 49, 0.34);
  backdrop-filter: blur(10px);
}

.result-card {
  width: min(100%, 420px);
  padding: 22px;
  border-radius: var(--radius-xl);
  background: var(--bg-panel-strong);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-lg);
  animation: resultCardIn var(--duration-normal) var(--ease-out);
}

.topline,
.result-chip,
.record-chip,
.actions,
.btn-primary,
.btn-secondary {
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
  color: var(--hero-blue-dark);
  background: var(--hero-blue-soft);
}

.record-chip {
  color: var(--energy-yellow-dark);
  background: var(--energy-yellow-soft);
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
  color: var(--energy-yellow);
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
  color: #d7dfeb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid var(--border-light);
}

.stat-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-icon.score {
  color: var(--hero-blue-dark);
  background: var(--hero-blue-soft);
}

.stat-icon.correct {
  color: var(--win-green-dark);
  background: var(--win-green-soft);
}

.stat-icon.accuracy {
  color: var(--energy-yellow-dark);
  background: var(--energy-yellow-soft);
}

.stat-icon.time {
  color: var(--warning-orange-dark);
  background: rgba(255, 122, 69, 0.12);
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

.actions {
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  justify-content: center;
  gap: 8px;
  flex: 1;
  height: 52px;
  border: none;
  border-radius: 18px;
  font-size: var(--font-base);
  font-weight: 800;
}

.btn-primary {
  color: white;
  background: linear-gradient(135deg, var(--hero-blue) 0%, var(--hero-blue-dark) 100%);
}

.btn-secondary {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.76);
}

.btn-primary:active,
.btn-secondary:active {
  transform: scale(0.98);
}

@media (hover: hover) {
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md), var(--glow-blue);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.92);
    color: var(--text-primary);
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

.modal-enter-from .result-card,
.modal-leave-to .result-card {
  transform: translateY(16px) scale(0.98);
}

@media (max-width: 420px) {
  .result-overlay {
    align-items: flex-end;
    padding: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }

  .result-card {
    width: 100%;
    padding: 18px;
    border-radius: 24px;
  }

  .topline {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 14px;
  }

  .result-title {
    font-size: 28px;
  }

  .result-subtitle {
    line-height: 1.55;
  }

  .star-rating {
    margin: 14px 0 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
