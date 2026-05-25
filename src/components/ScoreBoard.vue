<script setup>
import { computed } from 'vue'
import { CheckCircle } from 'lucide-vue-next'

const props = defineProps({
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
  streak: {
    type: Number,
    default: 0
  }
})

const progress = computed(() => {
  if (props.totalQuestions === 0) return 0
  return Math.round(((props.currentIndex + 1) / props.totalQuestions) * 100)
})

const remainingCount = computed(() => Math.max(props.totalQuestions - props.currentIndex - 1, 0))

</script>

<template>
  <div class="score-board">
    <div class="progress-header">
      <span>进度</span>
      <div class="progress-meta">
        <span
          v-if="streak >= 3"
          :key="streak"
          class="streak-chip"
          :class="{ 'is-highlight': streak >= 5 }"
        >
          连对{{ streak }}
        </span>
        <strong>{{ currentIndex + 1 }}/{{ totalQuestions }}</strong>
      </div>
    </div>

    <div class="progress-track">
      <div class="progress-fill" :class="{ 'is-complete': progress >= 100 }" :style="{ width: `${progress}%` }"></div>
    </div>

    <div class="summary-row">
      <p class="summary-text">{{ remainingCount === 0 ? '最后一题' : `还剩${remainingCount}题` }}</p>

      <div class="summary-pill">
        <div class="stat-icon correct-icon">
          <CheckCircle :size="18" />
        </div>
        <div>
          <p class="stat-value font-number">{{ correctCount }}/{{ totalQuestions }}</p>
          <p class="stat-label">答对</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  padding: 14px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

.progress-header,
.summary-row,
.summary-pill {
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
  color: var(--candy-blue-dark);
  background: rgba(49, 120, 246, 0.08);
  border: 1px solid rgba(49, 120, 246, 0.14);
  font-size: 12px;
  font-weight: 800;
}

.streak-chip.is-highlight {
  color: var(--candy-yellow-dark);
  background: var(--candy-yellow-soft);
  border-color: rgba(245, 201, 74, 0.2);
}

.progress-track {
  height: 8px;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: rgba(49, 120, 246, 0.12);
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--candy-blue), var(--candy-mint));
  transition: width var(--duration-slow) var(--ease-out);
}

.progress-fill.is-complete {
  box-shadow: var(--glow-mint);
}

.summary-row {
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.summary-text {
  color: var(--text-primary);
  font-size: var(--font-base);
  font-weight: 800;
  line-height: 1.2;
}

.summary-pill {
  gap: 8px;
  flex-shrink: 0;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.82);
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

.correct-icon {
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

  .summary-row {
    flex-direction: column;
    align-items: stretch;
  }

  .summary-pill {
    width: 100%;
  }
}

@media (max-width: 959px) and (max-height: 860px) {
  .score-board {
    padding: 10px;
  }

  .progress-header {
    margin-bottom: 6px;
    font-size: 12px;
  }

  .streak-chip {
    padding: 3px 7px;
    font-size: 11px;
  }

  .summary-row {
    margin-top: 8px;
  }

  .summary-pill {
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
}
</style>
