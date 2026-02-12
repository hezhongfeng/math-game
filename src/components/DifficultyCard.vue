<script setup>
import { computed } from 'vue'
import { Lock, Star, CheckCircle2, ChevronRight } from 'lucide-vue-next'
import { useSound } from '../composables/useSound'
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
const { playSound } = useSound()

const stars = computed(() => {
  if (!props.bestScore) return 0
  return getStarCount(props.bestScore.accuracy)
})

const levelColor = computed(() => {
  const colors = {
    '入门': '#4ECDC4',
    '初级': '#45B7D1',
    '中级': '#F9CA24',
    '进级': '#FF7B54',
    '高级': '#A55EEA'
  }
  return colors[props.difficulty.level] || '#4ECDC4'
})

function handleSelect() {
  if (!props.isLocked) {
    playSound('click')
    emit('select', props.difficulty)
  }
}
</script>

<template>
  <div
    class="difficulty-card"
    :class="{
      'is-locked': isLocked,
      'is-completed': isCompleted && !isLocked
    }"
    @click="handleSelect"
  >
    <div class="level-badge" :style="{ background: levelColor }">
      {{ difficulty.id }}
    </div>

    <div class="level-content">
      <h3 class="level-name">{{ difficulty.name }}</h3>
      
      <div v-if="!isLocked" class="level-stats">
        <div class="stars">
          <Star 
            v-for="n in 3" 
            :key="n" 
            :size="20" 
            :class="['star', n <= stars ? 'active' : '']"
          />
        </div>
        <span v-if="bestScore" class="accuracy">{{ bestScore.accuracy }}%</span>
        <span v-else-if="!isCompleted" class="new-tag">NEW</span>
      </div>
      
      <div v-else class="lock-hint">
        <Lock :size="16" />
        <span>需解锁</span>
      </div>
    </div>

    <div class="level-action">
      <CheckCircle2 v-if="isCompleted && !isLocked" class="icon-completed" />
      <Lock v-else-if="isLocked" class="icon-locked" />
      <ChevronRight v-else class="icon-arrow" />
    </div>
  </div>
</template>

<style scoped>
.difficulty-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
  cursor: pointer;
}

.difficulty-card:hover:not(.is-locked) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.difficulty-card:active:not(.is-locked) {
  transform: scale(0.98);
}

.is-locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.is-completed {
  border-left: 5px solid #00D084;
}

.level-badge {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-h2);
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}

.level-content {
  flex: 1;
}

.level-name {
  font-size: var(--font-h3);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.level-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  color: #E0E0E0;
  transition: color 0.2s ease;
}

.star.active {
  color: #FFB347;
  fill: #FFB347;
}

.accuracy {
  font-size: var(--font-md);
  font-weight: 700;
  color: #00D084;
}

.new-tag {
  padding: 4px 12px;
  background: var(--coral);
  color: white;
  font-size: var(--font-sm);
  font-weight: 800;
  border-radius: var(--radius-full);
}

.lock-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-md);
  color: var(--text-gray);
}

.level-action svg {
  width: 28px;
  height: 28px;
}

.icon-completed {
  color: #00D084;
}

.icon-locked {
  color: #B2BEC3;
}

.icon-arrow {
  color: #B2BEC3;
}

.difficulty-card:hover .icon-arrow {
  color: var(--coral);
  transform: translateX(4px);
}
</style>
