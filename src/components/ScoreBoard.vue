<script setup>
import { computed, ref, watch } from 'vue'
import { CheckCircle, Clock, Star, TrendingUp } from 'lucide-vue-next'
import { formatTime } from '../utils/format'

const props = defineProps({
  score: {
    type: Number,
    default: 0
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  correctCount: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  }
})

const isScoreAnimating = ref(false)

watch(() => props.score, (newVal, oldVal) => {
  if (newVal > oldVal) {
    isScoreAnimating.value = true
    setTimeout(() => {
      isScoreAnimating.value = false
    }, 400)
  }
})

const progress = computed(() => {
  if (props.totalQuestions === 0) return 0
  return Math.round((props.currentIndex / props.totalQuestions) * 100)
})

const formattedTime = computed(() => formatTime(props.duration))
</script>

<template>
  <div class="score-board">
    <div class="progress-section">
      <div class="progress-header">
        <span>进度 {{ currentIndex }}/{{ totalQuestions }}</span>
        <div class="progress-meta">
          <span
            v-if="streak >= 3"
            :key="streak"
            class="streak-chip"
            :class="{ 'is-highlight': streak >= 3 }"
          >
            连对 {{ streak }}
          </span>
          <strong>{{ progress }}%</strong>
        </div>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :class="{ 'is-complete': progress >= 100 }" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon score-icon">
          <Star :size="18" />
        </div>
        <div>
          <p class="stat-value font-number" :class="{ 'score-pop': isScoreAnimating }">{{ score }}</p>
          <p class="stat-label">得分</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon correct-icon">
          <CheckCircle :size="18" />
        </div>
        <div>
          <p class="stat-value font-number">{{ correctCount }}</p>
          <p class="stat-label">答对</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon time-icon">
          <Clock :size="18" />
        </div>
        <div>
          <p class="stat-value font-number">{{ formattedTime }}</p>
          <p class="stat-label">用时</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon accuracy-icon">
          <TrendingUp :size="18" />
        </div>
        <div>
          <p class="stat-value font-number">{{ accuracy || 0 }}%</p>
          <p class="stat-label">正确率</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  padding: 14px;
  border-radius: var(--radius-xl);
  background: var(--bg-panel);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(16px);
}

.progress-header,
.stat-item {
  display: flex;
  align-items: center;
}

.progress-header {
  justify-content: space-between;
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 700;
}

.progress-header strong {
  color: var(--text-primary);
}

.progress-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.streak-chip {
  padding: 4px 8px;
  border-radius: var(--radius-full);
  color: var(--candy-pink-dark);
  background: rgba(49, 120, 246, 0.12);
  border: 1px solid rgba(49, 120, 246, 0.2);
  font-size: 12px;
  font-weight: 800;
  animation: streakChipIn var(--duration-fast) var(--ease-out);
}

.streak-chip.is-highlight {
  color: var(--candy-yellow-dark);
  background: var(--candy-yellow-soft);
  border-color: rgba(255, 230, 109, 0.25);
}

.progress-track {
  height: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: rgba(49, 120, 246, 0.12);
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--candy-pink), var(--candy-mint));
  transition: width var(--duration-slow) var(--ease-out);
}

.progress-fill.is-complete {
  box-shadow: var(--glow-mint);
  animation: progressGlow 1.5s ease-in-out infinite;
}

@keyframes progressGlow {
  0%, 100% { box-shadow: var(--glow-mint); }
  50% { box-shadow: 0 0 12px rgba(78, 205, 196, 0.5); }
}

@keyframes streakChipIn {
  0% {
    opacity: 0;
    transform: scale(0.92);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.stat-item {
  gap: 8px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--border-light);
}

.stat-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.score-icon {
  color: var(--candy-pink-dark);
  background: var(--candy-pink-soft);
}

.correct-icon {
  color: var(--candy-mint-dark);
  background: var(--candy-mint-soft);
}

.time-icon {
  color: var(--candy-yellow-dark);
  background: var(--candy-yellow-soft);
}

.accuracy-icon {
  color: var(--candy-mint-dark);
  background: var(--candy-mint-soft);
}

.stat-value {
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 800;
  line-height: 1.2;
}

.stat-label {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 600;
}

@media (max-width: 360px) {
  .score-board {
    padding: 12px;
  }

  .progress-track {
    margin-bottom: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    padding: 8px 10px;
  }
}

@media (max-width: 959px) and (max-height: 860px) {
  .score-board {
    padding: 10px;
    border-radius: 18px;
    box-shadow: var(--shadow-sm);
  }

  .progress-header {
    margin-bottom: 6px;
    font-size: 12px;
  }

  .streak-chip {
    padding: 3px 7px;
    font-size: 11px;
  }

  .progress-track {
    margin-bottom: 8px;
  }

  .stat-item {
    padding: 8px 10px;
  }

  .stat-icon {
    width: 28px;
    height: 28px;
    border-radius: 10px;
  }

  .stat-value {
    font-size: 15px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stats-grid .stat-item:nth-child(3),
  .stats-grid .stat-item:nth-child(4) {
    display: none;
  }
}
</style>
