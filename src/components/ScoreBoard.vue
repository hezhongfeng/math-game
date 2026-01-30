<script setup>
import { computed } from 'vue'
import { Clock, CheckCircle, TrendingUp, Star } from 'lucide-vue-next'

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

const formatTime = computed(() => {
  const duration = Number(props.duration) || 0
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <div class="score-board">
    <!-- 进度条 -->
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">进度 {{ currentIndex }}/{{ totalQuestions }}</span>
        <span class="progress-pct">{{ progress }}%</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- 第一行：得分、正确 -->
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-icon score-icon">
          <Star :size="18" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ score }}</span>
          <span class="stat-label">得分</span>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon correct-icon">
          <CheckCircle :size="18" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ correctCount }}</span>
          <span class="stat-label">正确</span>
        </div>
      </div>
    </div>

    <!-- 第二行：用时、正确率 -->
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-icon time-icon">
          <Clock :size="18" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ formatTime }}</span>
          <span class="stat-label">用时</span>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon accuracy-icon">
          <TrendingUp :size="18" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ Number(accuracy) || 0 }}%</span>
          <span class="stat-label">正确率</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  background: white;
  border-radius: 18px;
  padding: 16px 18px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.06);
}

/* 进度条 */
.progress-section {
  margin-bottom: 14px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--game-text-secondary);
}

.progress-pct {
  font-size: 14px;
  font-weight: 700;
  color: var(--game-primary-dark);
}

.progress-bar {
  height: 8px;
  background: var(--game-bg-light);
  border-radius: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--game-primary), var(--game-primary-light));
  border-radius: 8px;
  transition: width 0.3s ease;
}

/* 统计行 */
.stats-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.stats-row:first-of-type {
  margin-top: 0;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--game-bg-light);
  border-radius: 14px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.score-icon {
  background: rgba(79, 70, 229, 0.1);
  color: var(--game-primary-dark);
}

.stat-icon.correct-icon {
  background: rgba(34, 197, 94, 0.1);
  color: var(--game-success-dark);
}

.stat-icon.time-icon {
  background: rgba(249, 115, 22, 0.1);
  color: var(--game-accent-dark);
}

.stat-icon.accuracy-icon {
  background: rgba(234, 179, 8, 0.1);
  color: var(--game-warning-dark);
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--game-text);
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: var(--game-text-secondary);
  font-weight: 500;
}
</style>
