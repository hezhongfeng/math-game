<script setup>
import { computed } from 'vue'
import { Lock, Star, CheckCircle2, ChevronRight, Zap } from 'lucide-vue-next'
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

// 获取难度主题色
const levelTheme = computed(() => {
  const themes = {
    '入门': {
      color: '#00D084',
      glow: 'rgba(0, 208, 132, 0.5)',
      dark: '#00A86B',
      name: 'forest'
    },
    '初级': {
      color: '#0066FF',
      glow: 'rgba(0, 102, 255, 0.5)',
      dark: '#0052CC',
      name: 'ocean'
    },
    '中级': {
      color: '#FFC700',
      glow: 'rgba(255, 199, 0, 0.5)',
      dark: '#E6B200',
      name: 'desert'
    },
    '进级': {
      color: '#FF6B35',
      glow: 'rgba(255, 107, 53, 0.5)',
      dark: '#E55A2B',
      name: 'volcano'
    },
    '高级': {
      color: '#8B5CF6',
      glow: 'rgba(139, 92, 246, 0.5)',
      dark: '#7C3AED',
      name: 'space'
    }
  }
  return themes[props.difficulty.level] || themes['入门']
})

// 动态样式
const cardStyle = computed(() => {
  if (props.isLocked) return {}
  const theme = levelTheme.value
  return {
    '--level-color': theme.color,
    '--level-glow': theme.glow,
    '--level-dark': theme.dark
  }
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
    :style="cardStyle"
    @click="handleSelect"
  >
    <!-- 能量边框效果 -->
    <div class="energy-border"></div>
    
    <!-- 左侧关卡图标 -->
    <div 
      class="level-icon"
      :class="{ 'is-locked': isLocked }"
    >
      <span v-if="!isLocked" class="level-number">{{ difficulty.id }}</span>
      <Lock v-else :size="20" />
    </div>

    <!-- 中间内容 -->
    <div class="level-content">
      <h3 class="level-name" :class="{ 'is-locked': isLocked }">
        {{ difficulty.name }}
      </h3>
      
      <div v-if="!isLocked" class="level-stats">
        <!-- 能量星级 -->
        <div class="energy-stars">
          <Zap 
            v-for="n in 3" 
            :key="n" 
            :size="14" 
            :class="['energy-star', n <= stars ? 'active' : '']"
          />
        </div>
        
        <!-- 正确率 -->
        <span v-if="bestScore" class="accuracy" :class="bestScore.accuracy >= 80 ? 'high' : ''">
          {{ bestScore.accuracy }}%
        </span>
        
        <!-- NEW 能量标签 -->
        <span v-else-if="!isCompleted" class="energy-badge">NEW</span>
      </div>
      
      <!-- 锁定提示 -->
      <div v-else class="lock-text">
        <span>能量不足</span>
      </div>
    </div>

    <!-- 右侧状态 -->
    <div class="level-status">
      <!-- 完成标记 -->
      <div v-if="isCompleted && !isLocked" class="status-icon completed">
        <CheckCircle2 :size="24" />
      </div>
      
      <!-- 锁定标记 -->
      <div v-else-if="isLocked" class="status-icon locked">
        <Lock :size="20" />
      </div>
      
      <!-- 操作箭头 -->
      <div v-else class="status-icon enter">
        <ChevronRight :size="20" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.difficulty-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  border-radius: var(--radius-sharp-lg);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all var(--duration-micro) var(--ease-standard);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  will-change: transform;
  overflow: hidden;
}

/* 能量边框动画 */
.energy-border {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-sharp-lg);
  border: 2px solid transparent;
  background: linear-gradient(90deg, var(--level-color), var(--level-dark), var(--level-color)) border-box;
  -webkit-mask: 
    linear-gradient(#fff 0 0) padding-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) padding-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--duration-micro) ease;
}

.difficulty-card:hover:not(.is-locked) .energy-border {
  opacity: 1;
}

.difficulty-card:hover:not(.is-locked) {
  transform: translateY(-3px);
  box-shadow: 
    0 0 30px var(--level-glow),
    0 8px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.difficulty-card:active:not(.is-locked) {
  transform: translateY(-1px) scale(0.98);
}

/* 锁定状态 */
.is-locked {
  opacity: 0.5;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.6) 100%);
  cursor: not-allowed;
}

/* 完成状态 */
.is-completed {
  border-color: rgba(0, 208, 132, 0.3);
}

.is-completed .energy-border {
  opacity: 0.5;
  background: linear-gradient(90deg, #00D084, #00A86B, #00D084) border-box;
}

/* 关卡图标 */
.level-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sharp-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  background: linear-gradient(145deg, var(--level-color) 0%, var(--level-dark) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 0 20px var(--level-glow);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.level-icon.is-locked {
  background: linear-gradient(145deg, #334155 0%, #1E293B 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.5);
}

/* 内容区 */
.level-content {
  flex: 1;
  min-width: 0;
}

.level-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 6px 0;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.level-name.is-locked {
  color: rgba(255, 255, 255, 0.5);
}

/* 统计行 */
.level-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.energy-stars {
  display: flex;
  gap: 4px;
}

.energy-star {
  color: rgba(255, 255, 255, 0.2);
  transition: all var(--duration-micro) ease;
}

.energy-star.active {
  color: var(--energy-yellow);
  filter: drop-shadow(0 0 6px rgba(255, 199, 0, 0.8));
}

.accuracy {
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  font-variant-numeric: tabular-nums;
}

.accuracy.high {
  color: var(--win-green);
  text-shadow: 0 0 10px rgba(0, 208, 132, 0.5);
}

/* 能量标签 */
.energy-badge {
  padding: 3px 10px;
  background: linear-gradient(145deg, var(--energy-yellow) 0%, var(--energy-yellow-dark) 100%);
  color: var(--bg-dark-navy);
  font-size: 10px;
  font-weight: 800;
  border-radius: var(--radius-full);
  box-shadow: 0 0 12px rgba(255, 199, 0, 0.4);
}

/* 锁定提示 */
.lock-text {
  font-size: 12px;
  color: rgba(148, 163, 184, 0.8);
  font-weight: 500;
}

/* 状态图标 */
.level-status {
  flex-shrink: 0;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-micro) var(--ease-standard);
}

.status-icon.completed {
  color: var(--win-green);
  filter: drop-shadow(0 0 8px rgba(0, 208, 132, 0.6));
}

.status-icon.locked {
  color: rgba(148, 163, 184, 0.5);
}

.status-icon.enter {
  color: rgba(255, 255, 255, 0.5);
}

.difficulty-card:hover .status-icon.enter {
  color: var(--level-color);
  filter: drop-shadow(0 0 8px var(--level-glow));
  transform: translateX(4px);
}
</style>
