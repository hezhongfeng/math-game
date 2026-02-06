<script setup>
import { computed } from 'vue'
import { Lock, Star, CheckCircle2, ChevronRight } from 'lucide-vue-next'
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

// 获取难度颜色
const levelColorClass = computed(() => {
  const classes = {
    '入门': 'bg-ios-green',
    '初级': 'bg-ios-orange',
    '中级': 'bg-ios-yellow',
    '进级': 'bg-ios-blue',
    '高级': 'bg-ios-purple'
  }
  return classes[props.difficulty.level] || 'bg-ios-gray-3'
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
      'is-completed': isCompleted && !isLocked,
      'is-unlocked': !isLocked && !isCompleted
    }"
    @click="handleSelect"
  >
    <!-- 左侧序号 -->
    <div 
      class="level-badge"
      :class="[
        isLocked ? 'bg-ios-gray-4 text-ios-gray-1' : levelColorClass
      ]"
    >
      {{ difficulty.id }}
    </div>

    <!-- 中间内容 -->
    <div class="level-content">
      <h3 class="level-name" :class="{ 'text-ios-gray-1': isLocked }">
        {{ difficulty.name }}
      </h3>
      
      <div v-if="!isLocked" class="level-meta">
        <!-- 星星评分 -->
        <div class="stars">
          <Star 
            v-for="n in 3" 
            :key="n" 
            :size="14" 
            :class="n <= stars ? 'text-ios-yellow fill-ios-yellow' : 'text-ios-gray-4'"
          />
        </div>
        
        <!-- 正确率 -->
        <span v-if="bestScore" class="accuracy" :class="bestScore.accuracy >= 80 ? 'text-ios-green' : 'text-ios-gray-1'">
          {{ bestScore.accuracy }}%
        </span>
        
        <!-- NEW 标签 -->
        <span v-else-if="!isCompleted" class="new-badge">NEW</span>
      </div>
      
      <!-- 锁定提示 -->
      <div v-else class="lock-hint">
        <Lock :size="12" />
        <span>需解锁</span>
      </div>
    </div>

    <!-- 右侧状态 -->
    <div class="level-action">
      <!-- 完成标记 -->
      <div v-if="isCompleted && !isLocked" class="status-icon completed">
        <CheckCircle2 :size="24" />
      </div>
      
      <!-- 锁定标记 -->
      <div v-else-if="isLocked" class="status-icon locked">
        <Lock :size="20" />
      </div>
      
      <!-- 操作箭头 -->
      <div v-else class="status-icon arrow">
        <ChevronRight :size="20" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.difficulty-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-micro) var(--ease-standard);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  will-change: transform, box-shadow;
}

.difficulty-card:hover:not(.is-locked) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.difficulty-card:active:not(.is-locked) {
  transform: translateY(0) scale(0.98);
  box-shadow: var(--shadow-md);
}

/* 锁定状态 */
.is-locked {
  opacity: 0.5;
  background: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
}

/* 完成状态 */
.is-completed {
  background: rgba(52, 199, 89, 0.08);
  border-color: rgba(52, 199, 89, 0.2);
}

/* 序号徽章 */
.level-badge {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

/* 内容区 */
.level-content {
  flex: 1;
  min-width: 0;
}

.level-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--ios-text-primary);
  margin: 0 0 4px 0;
  letter-spacing: -0.01em;
}

/* 统计行 */
.level-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  display: flex;
  gap: 2px;
}

.accuracy {
  font-size: 14px;
  font-weight: 600;
}

/* NEW 标签 */
.new-badge {
  padding: 2px 8px;
  background: var(--ios-orange);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
}

/* 锁定提示 */
.lock-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--ios-gray-1);
  font-weight: 500;
}

/* 状态图标 */
.level-action {
  flex-shrink: 0;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-micro) var(--ease-standard);
}

.status-icon.completed {
  color: var(--ios-green);
}

.status-icon.locked {
  color: var(--ios-gray-2);
}

.status-icon.arrow {
  color: var(--ios-gray-2);
}

.difficulty-card:hover .status-icon.arrow {
  color: var(--ios-blue);
  transform: translateX(2px);
}

/* 完成徽章 */
.is-completed::after {
  content: '';
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: var(--ios-green);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(52, 199, 89, 0.3);
  animation: badgePop var(--duration-emphasis) var(--ease-spring);
}

.is-completed::before {
  content: '';
  position: absolute;
  top: 2px;
  right: 8px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  z-index: 1;
  animation: badgePop var(--duration-emphasis) var(--ease-spring) 50ms both;
}

@keyframes badgePop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
