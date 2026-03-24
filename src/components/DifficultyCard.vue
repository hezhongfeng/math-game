<script setup>
import { computed } from 'vue'
import { CheckCircle2, ChevronRight, Lock, Star } from 'lucide-vue-next'
import { GAME_CONFIG } from '../config/constants'
import { getStarCount } from '../utils/stars'

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

const stars = computed(() => {
  if (!props.bestScore) return 0
  return getStarCount(props.bestScore.accuracy)
})

const levelColor = computed(() => props.difficulty.color || 'var(--candy-pink)')

const statusText = computed(() => {
  if (props.isLocked) return `上一关需达到 ${GAME_CONFIG.PASS_ACCURACY}%`
  if (props.isCompleted && props.bestScore) {
    return `已通过 · 最佳正确率 ${props.bestScore.accuracy}%`
  }
  if (props.bestScore) {
    return `当前 ${props.bestScore.accuracy}% · 达到 ${GAME_CONFIG.PASS_ACCURACY}% 可解锁下一关`
  }
  return '首次挑战'
})

function handleSelect(event) {
  if (props.isLocked) return
  emit('select', event, props.difficulty)
}
</script>

<template>
  <article
    :data-testid="`difficulty-card-${difficulty.id}`"
    class="difficulty-card"
    :class="{
      'is-locked': isLocked,
      'is-completed': isCompleted && !isLocked
    }"
    @click="handleSelect($event)"
  >
    <div class="leading">
      <div class="level-badge" :style="{ background: levelColor }">
        {{ difficulty.id }}
      </div>

      <div class="level-content">
        <div class="title-row">
          <h3 class="level-name">{{ difficulty.name }}</h3>
          <span v-if="!isLocked && !bestScore" class="new-tag">新关</span>
        </div>
        <p class="level-desc">{{ difficulty.description }}</p>
        <p class="level-status">{{ statusText }}</p>
      </div>
    </div>

    <div class="trailing">
      <div v-if="!isLocked" class="stars">
        <Star
          v-for="n in 5"
          :key="n"
          :size="14"
          :class="['star', n <= stars ? 'active' : '']"
          fill="currentColor"
        />
      </div>

      <CheckCircle2 v-if="isCompleted && !isLocked" class="state-icon completed" />
      <Lock v-else-if="isLocked" class="state-icon locked" />
      <ChevronRight v-else class="state-icon arrow" />
    </div>
  </article>
</template>

<style scoped>
.difficulty-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: var(--radius-lg);
  background: var(--bg-panel-strong);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}

.difficulty-card:active:not(.is-locked) {
  transform: scale(0.985);
}

.difficulty-card.is-leaving {
  opacity: 0.7;
  transform: scale(0.96);
  transition: all var(--duration-normal) var(--ease-out);
}

@media (hover: hover) {
  .difficulty-card:hover:not(.is-locked) {
    transform: translateY(-1px);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-md);
  }
}

.difficulty-card.is-completed {
  border-color: rgba(46, 196, 182, 0.32);
  box-shadow: var(--shadow-sm), var(--glow-mint);
}

.difficulty-card.is-locked {
  opacity: 0.72;
  cursor: not-allowed;
}

.leading,
.title-row,
.trailing {
  display: flex;
  align-items: center;
}

.leading {
  min-width: 0;
  gap: 14px;
  flex: 1;
}

.level-badge {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: white;
  font-size: var(--font-h3);
  font-weight: 800;
  box-shadow: inset 0 -8px 16px rgba(0, 0, 0, 0.12);
}

.level-content {
  min-width: 0;
}

.title-row {
  gap: 10px;
  margin-bottom: 4px;
}

.level-name {
  color: var(--text-primary);
  font-size: var(--font-lg);
  font-weight: 800;
}

.new-tag {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(49, 120, 246, 0.12);
  color: var(--candy-pink-dark);
  font-size: 12px;
  font-weight: 800;
}

.level-desc,
.level-status {
  font-size: var(--font-sm);
}

.level-desc {
  margin-bottom: 4px;
  color: var(--text-secondary);
}

.level-status {
  color: var(--text-muted);
  font-weight: 600;
}

.trailing {
  gap: 12px;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  color: #DCE7FA;
}

.star.active {
  color: var(--candy-yellow);
}

.state-icon {
  width: 22px;
  height: 22px;
}

.state-icon.completed {
  color: var(--candy-mint);
}

.state-icon.locked,
.state-icon.arrow {
  color: var(--text-muted);
}
</style>
