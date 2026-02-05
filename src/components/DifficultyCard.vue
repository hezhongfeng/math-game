<script setup>
import { computed } from 'vue'
import { Lock, Star, CheckCircle2 } from 'lucide-vue-next'
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
  if (!props.bestScore) return 0
  const accuracy = props.bestScore.accuracy
  if (accuracy === 100) return 3
  if (accuracy >= 80) return 2
  if (accuracy >= 60) return 1
  return 0
})

// 获取难度颜色 - 统一使用 game 系列
const levelColorClass = computed(() => {
  const classes = {
    '入门': 'bg-game-success',
    '初级': 'bg-game-warning-dark',
    '中级': 'bg-game-accent',
    '进级': 'bg-game-primary',
    '高级': 'bg-game-primary-dark'
  }
  return classes[props.difficulty.level] || 'bg-game-neutral-border'
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
    class="level-card"
    :class="[
      {
        'level-locked': isLocked,
        'level-completed': isCompleted && !isLocked,
        'level-unlocked': !isLocked && !isCompleted
      }
    ]"
    @click="handleSelect"
  >
    <!-- 左侧序号 -->
    <div 
      class="level-num"
      :class="[
        isLocked ? 'bg-game-neutral-border text-game-neutral-text-muted' : levelColorClass
      ]"
    >
      {{ difficulty.id }}
    </div>

    <!-- 中间内容 -->
    <div class="level-info">
      <h3 class="level-title" :class="{ 'text-game-neutral-text-muted': isLocked }">
        {{ difficulty.name }}
      </h3>
      
      <div v-if="!isLocked" class="level-stats">
        <!-- 星星评分 -->
        <div class="stars">
          <Star 
            v-for="n in 3" 
            :key="n" 
            :size="16" 
            :class="n <= stars ? 'text-game-accent fill-game-accent' : 'text-game-neutral-text-muted'"
          />
        </div>
        
        <!-- 正确率 -->
        <span v-if="bestScore" class="accuracy" :class="bestScore.accuracy >= 80 ? 'text-game-success' : 'text-game-neutral-text-secondary'">
          {{ bestScore.accuracy }}%
        </span>
        
        <!-- NEW 标签 -->
        <span v-else-if="!isCompleted" class="new-label">NEW</span>
      </div>
      
      <!-- 锁定提示 -->
      <div v-else class="lock-text">
        <Lock :size="14" />
        <span>需解锁</span>
      </div>
    </div>

    <!-- 右侧状态 -->
    <div class="level-status">
      <!-- 完成标记 -->
      <div v-if="isCompleted && !isLocked" class="check-mark text-game-success">
        <CheckCircle2 :size="28" />
      </div>
      
      <!-- 锁定标记 -->
      <div v-else-if="isLocked" class="lock-mark text-game-neutral-text-muted">
        <Lock :size="24" />
      </div>
      
      <!-- 操作箭头 -->
      <div v-else class="go-arrow text-game-neutral-text-muted">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   Claymorphism 粘土风难度卡片
   ============================================ */

.level-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f0 100%);
  border-radius: 20px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    6px 6px 12px rgba(0, 0, 0, 0.08),
    -6px -6px 12px rgba(255, 255, 255, 0.9),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.level-card:hover:not(.level-locked) {
  transform: translateY(-3px) translateX(2px);
  box-shadow:
    10px 10px 20px rgba(0, 0, 0, 0.1),
    -10px -10px 20px rgba(255, 255, 255, 0.95),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.level-card:active:not(.level-locked) {
  transform: translateY(1px) translateX(1px);
  box-shadow:
    3px 3px 6px rgba(0, 0, 0, 0.08),
    -3px -3px 6px rgba(255, 255, 255, 0.8),
    inset 2px 2px 4px rgba(0, 0, 0, 0.05);
}

/* 锁定状态 - 粘土风凹陷效果 */
.level-locked {
  background: linear-gradient(145deg, #e0e0d5 0%, #d5d5c8 100%);
  cursor: not-allowed;
  opacity: 0.85;
  box-shadow:
    inset 4px 4px 8px rgba(0, 0, 0, 0.08),
    inset -4px -4px 8px rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.4);
}

/* 已完成状态 - 绿色发光边框 */
.level-completed {
  border: 3px solid var(--game-success);
  box-shadow:
    0 0 15px rgba(82, 196, 26, 0.2),
    6px 6px 12px rgba(0, 0, 0, 0.08),
    -6px -6px 12px rgba(255, 255, 255, 0.9),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* 已解锁状态 - 主色发光边框 */
.level-unlocked {
  border: 3px solid var(--game-primary-light);
  box-shadow:
    0 0 15px rgba(74, 124, 89, 0.15),
    6px 6px 12px rgba(0, 0, 0, 0.08),
    -6px -6px 12px rgba(255, 255, 255, 0.9),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* 序号圆形 - 粘土风 */
.level-num {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  border: 3px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    3px 3px 6px rgba(0, 0, 0, 0.15),
    -2px -2px 4px rgba(255, 255, 255, 0.3),
    inset 1px 1px 2px rgba(255, 255, 255, 0.3);
}

/* 信息区 */
.level-info {
  flex: 1;
  min-width: 0;
}

.level-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--game-text);
  margin: 0 0 6px 0;
  letter-spacing: -0.2px;
}

/* 统计行 */
.level-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 3px;
}

.accuracy {
  font-size: 16px;
  font-weight: 700;
}

/* NEW 标签 - 粘土风 */
.new-label {
  padding: 3px 10px;
  background: linear-gradient(145deg, var(--game-warning-light) 0%, var(--game-warning) 100%);
  color: white;
  font-size: 11px;
  font-weight: 800;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 2px 0 0 #A86608,
    0 3px 6px rgba(212, 130, 13, 0.3);
}

/* 锁定提示 */
.lock-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--game-text-muted);
  font-weight: 500;
}

/* 右侧状态 */
.level-status {
  flex-shrink: 0;
}

.check-mark {
  color: var(--game-success);
  filter: drop-shadow(0 2px 4px rgba(82, 196, 26, 0.3));
}

.lock-mark {
  color: var(--game-text-muted);
  opacity: 0.6;
}

.go-arrow {
  color: var(--game-text-muted);
  transition: all 0.2s ease;
}

.level-card:hover .go-arrow {
  color: var(--game-primary);
  transform: translateX(4px);
}
</style>
