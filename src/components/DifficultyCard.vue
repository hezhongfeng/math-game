<script setup>
import { computed } from 'vue'
import { Lock, Star, Check, ChevronRight } from 'lucide-vue-next'
import { useSound } from '../composables/useSound'

const props = defineProps({
  difficulty: {
    type: Object,
    required: true
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  bestScore: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select'])
const { playSound } = useSound()

const stars = computed(() => {
  if (!props.bestScore) return []
  const accuracy = props.bestScore.accuracy
  if (accuracy === 100) return [1, 2, 3]
  if (accuracy >= 80) return [1, 2]
  if (accuracy >= 60) return [1]
  return []
})

const accuracyColor = computed(() => {
  if (!props.bestScore) return ''
  if (props.bestScore.accuracy >= 80) return 'accuracy-high'
  if (props.bestScore.accuracy >= 60) return 'accuracy-medium'
  return 'accuracy-low'
})

// 获取难度样式类
function getDifficultyClass(level) {
  const classes = {
    '入门': 'level-beginner',
    '初级': 'level-elementary',
    '中级': 'level-intermediate',
    '进级': 'level-advanced',
    '高级': 'level-expert'
  }
  return classes[level] || 'level-default'
}

function handleSelect() {
  if (!props.isLocked) {
    playSound('click')
    emit('select', props.difficulty)
  }
}
</script>

<template>
  <div
    class="card"
    :class="{
      'card-locked': isLocked,
      'card-unlocked': !isLocked,
      'card-completed': isCompleted && !isLocked
    }"
    @click="handleSelect"
  >
    <!-- 图标区域 -->
    <div
      class="icon-wrapper"
      :class="{ 'icon-locked': isLocked }"
    >
      <span class="level-number">{{ difficulty.id }}</span>
      <div v-if="isCompleted && !isLocked" class="completed-badge">
        <Check :size="12" />
      </div>
    </div>

    <!-- 中间内容 -->
    <div class="content">
      <div class="name-row">
        <span class="name" :class="{ 'name-locked': isLocked }">
          {{ difficulty.name }}
        </span>
        <div v-if="!isLocked" class="status-badges">
          <span v-if="isCompleted" class="mini-badge completed">
            <Check :size="10" />
          </span>
          <span v-else class="mini-badge new">NEW</span>
        </div>
        <span v-else class="lock-badge">
          <Lock :size="14" />
        </span>
      </div>

      <div v-if="bestScore && !isLocked" class="stats-row">
        <span class="stat-score">{{ bestScore.correctCount }}/{{ bestScore.totalCount }}</span>
        <span class="stat-divider">|</span>
        <span class="stat-accuracy" :class="accuracyColor">{{ bestScore.accuracy }}%</span>
        <div class="star-rating">
          <Star
            v-for="n in 3"
            :key="n"
            :size="14"
            :fill="n <= stars.length ? 'currentColor' : 'none'"
            class="star-icon"
            :class="{ 'star-filled': n <= stars.length, 'star-empty': n > stars.length }"
          />
        </div>
      </div>

      <div v-else-if="!isLocked" class="status-row">
        <span class="question-count">{{ difficulty.questionCount }}题挑战</span>
        <span class="difficulty-badge" :class="getDifficultyClass(difficulty.level)">
          {{ difficulty.operation === 'add' ? '+' : difficulty.operation === 'subtract' ? '-' : '+/-' }}
        </span>
      </div>

      <div v-else class="status-row locked">
        <Lock :size="14" class="lock-icon" />
        <span class="locked-text">完成上一关解锁</span>
      </div>
    </div>

    <!-- 箭头 -->
    <div class="arrow-wrapper" :class="{ 'arrow-locked': isLocked }">
      <ChevronRight :size="20" class="arrow" />
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  animation: cardSlideIn 0.4s ease-out both;
  min-height: 80px;
}

/* 已解锁卡片 */
.card-unlocked {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-unlocked:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-unlocked:active {
  transform: scale(0.98);
}

/* 已完成卡片 */
.card-completed {
  background: linear-gradient(135deg, #ffffff 0%, rgba(34, 197, 94, 0.1) 100%);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

/* 锁定卡片 */
.card-locked {
  background: var(--game-bg-light);
  border: 1px dashed rgba(226, 232, 240, 0.5);
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes cardSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-15px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 图标区域 */
.icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(135deg, var(--game-primary) 0%, var(--game-primary-dark) 100%);
  color: white;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 4px 8px rgba(79, 70, 229, 0.4);
}

.icon-locked {
  background: var(--game-border);
  color: var(--game-text-muted);
  box-shadow: none;
}

.level-number {
  font-size: 20px;
  font-weight: 800;
}

/* 完成标记 */
.completed-badge {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--game-success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.4);
}

.content {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.name {
  font-size: 17px;
  font-weight: 700;
  color: var(--game-text);
  letter-spacing: 0.3px;
}

.name-locked {
  color: var(--game-text-muted);
}

/* 状态徽章 */
.status-badges {
  display: flex;
  gap: 4px;
}

.mini-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
}

.mini-badge.completed {
  background: rgba(34, 197, 94, 0.2);
  color: var(--game-success-dark);
}

.mini-badge.new {
  background: rgba(249, 115, 22, 0.2);
  color: var(--game-accent-dark);
}

.lock-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--game-border);
  color: var(--game-text-muted);
}

/* 统计行 */
.stats-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-score {
  font-size: 14px;
  color: var(--game-text-secondary);
  font-weight: 600;
}

.stat-divider {
  color: var(--game-border);
  font-weight: 300;
}

.stat-accuracy {
  font-size: 14px;
  font-weight: 700;
}

.stat-accuracy.accuracy-high {
  color: var(--game-success-dark);
}

.stat-accuracy.accuracy-medium {
  color: var(--game-warning-dark);
}

.stat-accuracy.accuracy-low {
  color: var(--game-error-dark);
}

/* 星星评分 */
.star-rating {
  display: flex;
  gap: 1px;
  margin-left: auto;
}

.star-icon {
  transition: all 0.2s ease;
}

.star-filled {
  color: var(--game-warning);
}

.star-empty {
  color: var(--game-border);
}

/* 状态行 */
.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-row.locked {
  opacity: 0.7;
}

.question-count {
  font-size: 13px;
  color: var(--game-text-secondary);
  font-weight: 500;
}

/* 难度徽章 */
.difficulty-badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  margin-left: auto;
  background: var(--game-bg);
  color: var(--game-text-secondary);
}

.level-beginner {
  background: rgba(34, 197, 94, 0.2);
  color: var(--game-success-dark);
}

.level-elementary {
  background: rgba(249, 115, 22, 0.2);
  color: var(--game-accent-dark);
}

.level-intermediate {
  background: rgba(234, 179, 8, 0.2);
  color: var(--game-warning-dark);
}

.level-advanced {
  background: rgba(239, 68, 68, 0.2);
  color: var(--game-error-dark);
}

.level-expert {
  background: rgba(79, 70, 229, 0.2);
  color: var(--game-primary-dark);
}

.lock-icon {
  color: var(--game-text-muted);
  flex-shrink: 0;
}

.locked-text {
  font-size: 12px;
  color: var(--game-text-muted);
  font-weight: 500;
}

/* 箭头 */
.arrow-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--game-bg);
  transition: all 0.2s ease;
}

.arrow {
  color: var(--game-text-muted);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.card-unlocked .arrow-wrapper {
  background: rgba(79, 70, 229, 0.1);
}

.card-unlocked .arrow {
  color: var(--game-primary-dark);
}

.card-unlocked:hover .arrow-wrapper {
  background: var(--game-primary-dark);
  transform: translateX(3px);
}

.card-unlocked:hover .arrow {
  color: white;
}

.arrow-locked {
  background: var(--game-bg);
}

.arrow-locked .arrow {
  color: var(--game-border);
  opacity: 0.5;
}
</style>
