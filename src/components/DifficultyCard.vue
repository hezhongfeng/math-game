<script setup>
import { computed } from 'vue'
import { Lock, Star, Check, ChevronRight } from 'lucide-vue-next'
import { CUTE_EMOJIS } from '../config/constants'
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

const cuteEmoji = computed(() => CUTE_EMOJIS[props.difficulty.id % CUTE_EMOJIS.length])

const accuracyColor = computed(() => {
  if (!props.bestScore) return ''
  if (props.bestScore.accuracy >= 80) return 'text-green-600'
  if (props.bestScore.accuracy >= 60) return 'text-amber-600'
  return 'text-orange-500'
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
    class="card animate-card-entrance"
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
      :style="{ backgroundColor: isLocked ? '#f1f5f9' : `${difficulty.color}15` }"
    >
      <span class="emoji">{{ cuteEmoji }}</span>
    </div>

    <!-- 中间内容 -->
    <div class="content">
      <div class="name-row">
        <span 
          class="name" 
          :style="{ color: isLocked ? '#94a3b8' : difficulty.color }"
        >
          {{ difficulty.name }}
        </span>
        <span v-if="isCompleted && !isLocked" class="badge-success">
          <Check :size="14" />
        </span>
        <span v-else-if="isLocked" class="badge-locked">
          <Lock :size="14" />
        </span>
      </div>

      <div v-if="bestScore && !isLocked" class="stats-row">
        <span class="stat">{{ bestScore.correctCount }}/{{ bestScore.totalCount }}</span>
        <span class="stat accuracy" :class="accuracyColor">{{ bestScore.accuracy }}%</span>
        <div class="stars">
          <Star
            v-for="n in 3"
            :key="n"
            :size="16"
            :fill="n <= stars.length ? 'currentColor' : 'none'"
            class="star"
            :class="{ 'star-active': n <= stars.length }"
          />
        </div>
      </div>

      <div v-else-if="!isLocked" class="status-row">
        <span class="question-count" :style="{ color: difficulty.color }">{{ difficulty.questionCount }}题</span>
        <span 
          class="status-badge" 
          :style="{ backgroundColor: `${difficulty.color}15`, color: difficulty.color }"
        >
          点击挑战
        </span>
      </div>

      <div v-else class="status-row">
        <Lock :size="14" class="lock-icon" />
        <span class="locked-text">完成上一关解锁</span>
      </div>
    </div>

    <!-- 箭头 -->
    <ChevronRight v-if="!isLocked" :size="22" class="arrow" />
    <ChevronRight v-else :size="22" class="arrow arrow-locked" />
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  animation: cardSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.card-unlocked {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(74, 144, 226, 0.2);
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.1);
}

.card-unlocked:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 
    0 8px 25px rgba(74, 144, 226, 0.15),
    0 4px 10px rgba(74, 144, 226, 0.1);
  border-color: rgba(74, 144, 226, 0.4);
}

.card-unlocked:active {
  transform: scale(0.98);
  transition: all 0.1s ease;
}

.card-completed {
  border-color: rgba(76, 175, 80, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #f0fff4 100%);
}

.card-locked {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px dashed #cbd5e1;
  opacity: 0.8;
}

@keyframes cardSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.emoji {
  font-size: 30px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
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
  font-size: 19px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.3px;
}

.badge-success {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
}

.badge-locked {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #94a3b8;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.accuracy {
  font-weight: 700;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #fbbf24;
}

.star:not(.star-active) {
  opacity: 0.2;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-count {
  font-size: 15px;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
}

.lock-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.locked-text {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

.arrow {
  color: #cbd5e1;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.card-unlocked:hover .arrow {
  transform: translateX(3px);
  color: #4A90E2;
}

.arrow-locked {
  opacity: 0.4;
}
</style>
