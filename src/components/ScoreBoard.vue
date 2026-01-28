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
          <Star :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ score }}</span>
          <span class="stat-label">得分</span>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon correct-icon">
          <CheckCircle :size="20" />
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
          <Clock :size="20" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ formatTime }}</span>
          <span class="stat-label">用时</span>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon accuracy-icon">
          <TrendingUp :size="20" />
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
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
  border-radius: 20px;
  padding: 16px 20px;
  box-shadow:
    0 4px 20px rgba(74, 144, 226, 0.12),
    0 2px 8px rgba(74, 144, 226, 0.08);
  border: 2px solid rgba(74, 144, 226, 0.15);
}

/* 进度条 */
.progress-section {
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 15px;
  font-weight: 600;
  color: #4A90E2;
  font-family: inherit;
}

.progress-pct {
  font-size: 15px;
  font-weight: 700;
  color: #2A70C2;
  font-family: inherit;
}

.progress-bar {
  height: 10px;
  background: #E3F2FD;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A90E2, #7AB8FF);
  border-radius: 10px;
  transition: width 0.3s ease;
}

/* 统计行 */
.stats-row {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.stats-row:first-of-type {
  margin-top: 0;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #F5F9FF;
  border-radius: 16px;
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.score-icon {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  color: #1976D2;
}

.stat-icon.correct-icon {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  color: #388E3C;
}

.stat-icon.time-icon {
  background: linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%);
  color: #00838F;
}

.stat-icon.accuracy-icon {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  color: #F9A825;
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1e3a5f;
  font-family: inherit;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-family: inherit;
  font-weight: 500;
}
</style>
