<script setup>
import { computed } from 'vue'
import { CheckCircle2, ChevronRight, Lock, Star } from 'lucide-vue-next'
import { getStarCount } from '../utils/stars'
import { formatPreciseTime } from '../utils/format'

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
  },
  leaderboard: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const stars = computed(() => {
  if (!props.bestScore) return 0
  return getStarCount(props.bestScore.accuracy)
})

const levelColor = computed(() => props.difficulty.color || 'var(--candy-blue)')
const bestTimeLabel = computed(() => {
  if (!props.leaderboard.length) return ''
  return formatPreciseTime(props.leaderboard[0].durationMs)
})

const statusText = computed(() => {
  if (props.isLocked) return ''
  if (props.isCompleted && props.bestScore) {
    return '再玩'
  }
  if (props.bestScore) {
    return '再玩'
  }
  return '去玩'
})

function handleSelect(event) {
  if (props.isLocked) return
  emit('select', event, props.difficulty)
}
</script>

<template>
  <article
    class="difficulty-card"
    :class="{
      'is-locked': isLocked,
      'is-completed': isCompleted && !isLocked
    }"
  >
    <div class="leading">
      <div class="level-badge" :style="{ background: levelColor }">
        {{ difficulty.id }}
      </div>

      <div class="level-content">
        <div class="title-row">
          <h3 class="level-name">第{{ difficulty.id }}关</h3>
          <span v-if="!isLocked && !bestScore" class="new-tag">新</span>
        </div>
        <p class="level-desc">{{ difficulty.description }}</p>
        <p v-if="difficulty.helperText" class="level-helper">{{ difficulty.helperText }}</p>
        <p v-if="bestTimeLabel" class="level-time">最快 {{ bestTimeLabel }}</p>
        <p v-if="statusText" class="level-status">{{ statusText }}</p>
      </div>
    </div>

    <div class="trailing">
      <div v-if="!isLocked && stars > 0" class="stars">
        <Star
          v-for="n in 5"
          :key="n"
          :size="14"
          :class="['star', n <= stars ? 'active' : '']"
          fill="currentColor"
          aria-hidden="true"
        />
      </div>

      <CheckCircle2 v-if="isCompleted && !isLocked" class="state-icon completed" aria-hidden="true" />
      <Lock v-else-if="isLocked" class="state-icon locked" aria-hidden="true" />
      <ChevronRight v-else class="state-icon arrow" aria-hidden="true" />
    </div>

    <button
      :data-testid="`difficulty-card-${difficulty.id}`"
      class="card-action"
      type="button"
      :disabled="isLocked"
      :aria-label="isLocked ? `第${difficulty.id}关，尚未解锁` : `${statusText}第${difficulty.id}关：${difficulty.description}`"
      @click="handleSelect"
    />
  </article>
</template>

<style scoped>
.difficulty-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--border-light);
  box-shadow: none;
  transition: transform var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}

.card-action {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: inherit;
  background: transparent;
  cursor: pointer;
}

.card-action:disabled {
  cursor: not-allowed;
}

.card-action:focus-visible {
  outline: none;
}

.difficulty-card:focus-within {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--brand-alert-glow);
}

.difficulty-card.is-leaving {
  opacity: 0.7;
  transform: scale(0.96);
  transition: opacity var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out);
}

@media (hover: hover) {
  .difficulty-card:hover:not(.is-locked) {
    transform: translateY(-1px);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-sm);
  }
}

.difficulty-card.is-completed {
  border-color: rgba(46, 196, 182, 0.32);
  box-shadow: inset 0 0 0 1px rgba(46, 196, 182, 0.12);
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
  gap: 16px;
  flex: 1;
}

.level-badge {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: white;
  font-size: 30px;
  font-weight: 900;
  box-shadow: inset 0 -10px 18px rgba(0, 0, 0, 0.12);
}

.level-content {
  min-width: 0;
}

.title-row {
  gap: 8px;
  margin-bottom: 3px;
}

.level-name {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 800;
}

.new-tag {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(49, 120, 246, 0.12);
  color: var(--candy-blue-dark);
  font-size: 12px;
  font-weight: 800;
}

.level-desc,
.level-helper,
.level-time,
.level-status {
  font-size: var(--font-sm);
}

.level-desc {
  margin-bottom: 3px;
  color: var(--text-secondary);
  font-weight: 700;
}

.level-helper {
  margin-bottom: 3px;
  color: var(--text-muted);
  font-weight: 600;
  line-height: 1.45;
}

.level-time {
  margin-bottom: 3px;
  color: var(--brand-primary);
  font-weight: 800;
}

.level-status {
  color: var(--text-muted);
  font-weight: 600;
}

.trailing {
  gap: 10px;
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
  width: 28px;
  height: 28px;
}

.state-icon.completed {
  color: var(--candy-mint);
}

.state-icon.locked,
.state-icon.arrow {
  color: var(--text-muted);
}
</style>
