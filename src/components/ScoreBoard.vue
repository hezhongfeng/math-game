<script setup>
import { computed } from 'vue'
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
        <strong>{{ progress }}%</strong>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon score-icon">
          <Star :size="18" />
        </div>
        <div>
          <p class="stat-value">{{ score }}</p>
          <p class="stat-label">得分</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon correct-icon">
          <CheckCircle :size="18" />
        </div>
        <div>
          <p class="stat-value">{{ correctCount }}</p>
          <p class="stat-label">答对</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon time-icon">
          <Clock :size="18" />
        </div>
        <div>
          <p class="stat-value">{{ formattedTime }}</p>
          <p class="stat-label">用时</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon accuracy-icon">
          <TrendingUp :size="18" />
        </div>
        <div>
          <p class="stat-value">{{ accuracy || 0 }}%</p>
          <p class="stat-label">正确率</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  padding: 16px;
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

.progress-track {
  height: 10px;
  margin-bottom: 14px;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: #dde7f2;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--hero-blue), var(--win-green));
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.stat-item {
  gap: 10px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
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

.score-icon {
  color: var(--energy-yellow-dark);
  background: var(--energy-yellow-soft);
}

.correct-icon {
  color: var(--win-green-dark);
  background: var(--win-green-soft);
}

.time-icon {
  color: var(--hero-blue-dark);
  background: var(--hero-blue-soft);
}

.accuracy-icon {
  color: var(--warning-orange-dark);
  background: rgba(255, 122, 69, 0.12);
}

.stat-value {
  color: var(--text-primary);
  font-size: var(--font-lg);
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
    padding: 14px;
  }

  .progress-track {
    margin-bottom: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    padding: 10px 12px;
  }
}
</style>
