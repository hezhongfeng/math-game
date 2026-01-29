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
  if (props.bestScore.accuracy >= 80) return 'accuracy-high'
  if (props.bestScore.accuracy >= 60) return 'accuracy-medium'
  return 'accuracy-low'
})

// 根据难度颜色获取图标渐变
function getIconGradient(color) {
  const gradients = {
    'bg-green-400': 'linear-gradient(135deg, #C8E6C9 0%, #81C784 100%)',
    'bg-green-500': 'linear-gradient(135deg, #A5D6A7 0%, #66BB6A 100%)',
    'bg-green-600': 'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)',
    'bg-blue-400': 'linear-gradient(135deg, #B3E5FC 0%, #4FC3F7 100%)',
    'bg-blue-500': 'linear-gradient(135deg, #81D4FA 0%, #29B6F6 100%)',
    'bg-blue-600': 'linear-gradient(135deg, #4FC3F7 0%, #03A9F4 100%)',
    'bg-yellow-400': 'linear-gradient(135deg, #FFF9C4 0%, #FFD54F 100%)',
    'bg-yellow-500': 'linear-gradient(135deg, #FFF59D 0%, #FFCA28 100%)',
    'bg-yellow-600': 'linear-gradient(135deg, #FFD54F 0%, #FFB300 100%)',
    'bg-orange-400': 'linear-gradient(135deg, #FFE0B2 0%, #FFB74D 100%)',
    'bg-orange-500': 'linear-gradient(135deg, #FFCC80 0%, #FFA726 100%)',
    'bg-orange-600': 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)',
    'bg-red-400': 'linear-gradient(135deg, #FFCDD2 0%, #EF9A9A 100%)',
    'bg-red-500': 'linear-gradient(135deg, #EF9A9A 0%, #EF5350 100%)',
    'bg-red-600': 'linear-gradient(135deg, #E57373 0%, #F44336 100%)',
  }
  return gradients[color] || 'linear-gradient(135deg, #E3F2FD, #BBDEFB)'
}

// 获取文字颜色
function getTextColor(color) {
  const colors = {
    'bg-green-400': '#2E7D32',
    'bg-green-500': '#2E7D32',
    'bg-green-600': '#1B5E20',
    'bg-blue-400': '#0277BD',
    'bg-blue-500': '#01579B',
    'bg-blue-600': '#014377',
    'bg-yellow-400': '#F57F17',
    'bg-yellow-500': '#EF6C00',
    'bg-yellow-600': '#E65100',
    'bg-orange-400': '#E65100',
    'bg-orange-500': '#D84315',
    'bg-orange-600': '#BF360C',
    'bg-red-400': '#C62828',
    'bg-red-500': '#B71C1C',
    'bg-red-600': '#8B0000',
  }
  return colors[color] || '#37474F'
}

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
    class="card animate-card-entrance"
    :class="{
      'card-locked': isLocked,
      'card-unlocked': !isLocked,
      'card-completed': isCompleted && !isLocked
    }"
    @click="handleSelect"
  >
    <!-- 图标区域 - 立体效果 -->
    <div
      class="icon-wrapper"
      :class="{ 'icon-locked': isLocked }"
      :style="{ background: isLocked ? 'linear-gradient(135deg, #f5f5f5, #e0e0e0)' : getIconGradient(difficulty.color) }"
    >
      <span class="emoji" :class="{ 'emoji-locked': isLocked }">{{ cuteEmoji }}</span>
      <div v-if="isCompleted && !isLocked" class="completed-badge">
        <Check :size="14" />
      </div>
    </div>

    <!-- 中间内容 -->
    <div class="content">
      <div class="name-row">
        <span
          class="name"
          :class="{ 'name-locked': isLocked }"
          :style="{ color: isLocked ? '#9E9E9E' : getTextColor(difficulty.color) }"
        >
          {{ difficulty.name }}
        </span>
        <div v-if="!isLocked" class="status-badges">
          <span v-if="isCompleted" class="mini-badge completed">
            <Check :size="12" />
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
            :size="16"
            :fill="n <= stars.length ? 'currentColor' : 'none'"
            class="star-icon"
            :class="{ 'star-filled': n <= stars.length, 'star-empty': n > stars.length }"
          />
        </div>
      </div>

      <div v-else-if="!isLocked" class="status-row">
        <span class="question-count">{{ difficulty.questionCount }}题挑战</span>
        <span class="difficulty-badge" :class="getDifficultyClass(difficulty.level)">
          {{ difficulty.operation === 'add' ? '➕' : difficulty.operation === 'subtract' ? '➖' : '➕➖' }}
        </span>
      </div>

      <div v-else class="status-row locked">
        <Lock :size="14" class="lock-icon" />
        <span class="locked-text">完成上一关解锁</span>
      </div>
    </div>

    <!-- 箭头 - 动态效果 -->
    <div class="arrow-wrapper" :class="{ 'arrow-locked': isLocked }">
      <ChevronRight :size="24" class="arrow" />
    </div>
  </div>
</template>

<style scoped>
/* Cliomorphism 风格卡片 */
.card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  animation: cardSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  min-height: 88px;
}

/* 已解锁卡片 - 立体效果 */
.card-unlocked {
  background: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 4px 0 0 rgba(0, 0, 0, 0.06),
    0 8px 25px rgba(0, 0, 0, 0.08);
}

.card-unlocked:hover {
  transform: translateY(-3px);
  box-shadow:
    0 6px 0 0 rgba(0, 0, 0, 0.06),
    0 12px 35px rgba(0, 0, 0, 0.12);
}

.card-unlocked:active {
  transform: translateY(1px);
  box-shadow:
    0 2px 0 0 rgba(0, 0, 0, 0.06),
    0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.1s ease;
}

/* 已完成卡片 - 绿色光晕 */
.card-completed {
  border-color: rgba(129, 199, 132, 0.5);
  background: linear-gradient(135deg, #ffffff 0%, #F1F8E9 100%);
}

.card-completed:hover {
  border-color: #81C784;
  box-shadow:
    0 6px 0 0 rgba(129, 199, 132, 0.3),
    0 12px 35px rgba(129, 199, 132, 0.2);
}

/* 锁定卡片 */
.card-locked {
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
  border: 2px dashed #bdbdbd;
  opacity: 0.75;
  cursor: not-allowed;
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

/* 图标区域 - 立体 */
.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  box-shadow:
    0 3px 0 0 rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover .icon-wrapper:not(.icon-locked) {
  transform: scale(1.05);
}

.icon-locked {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.emoji {
  font-size: 34px;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
}

.emoji-locked {
  filter: grayscale(0.5) opacity(0.6);
}

/* 完成标记 */
.completed-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #81C784, #66BB6A);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(102, 187, 106, 0.4);
  border: 2px solid white;
}

.content {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.name {
  font-size: 20px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.3px;
}

.name-locked {
  color: #9E9E9E;
}

/* 状态徽章 */
.status-badges {
  display: flex;
  gap: 6px;
}

.mini-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

.mini-badge.completed {
  background: linear-gradient(135deg, #C8E6C9, #A5D6A7);
  color: #2E7D32;
}

.mini-badge.new {
  background: linear-gradient(135deg, #FFCCBC, #FFAB91);
  color: #D84315;
  animation: pulse-gentle 2s infinite;
}

.lock-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E0E0E0;
  color: #9E9E9E;
}

/* 统计行 */
.stats-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-score {
  font-size: 15px;
  color: #546E7A;
  font-weight: 600;
}

.stat-divider {
  color: #BDBDBD;
  font-weight: 300;
}

.stat-accuracy {
  font-size: 15px;
  font-weight: 700;
}

.stat-accuracy.accuracy-high {
  color: #4CAF50;
}

.stat-accuracy.accuracy-medium {
  color: #FF9800;
}

.stat-accuracy.accuracy-low {
  color: #F44336;
}

/* 星星评分 */
.star-rating {
  display: flex;
  gap: 2px;
  margin-left: auto;
}

.star-icon {
  transition: all 0.2s ease;
}

.star-filled {
  color: #FFD54F;
  filter: drop-shadow(0 1px 2px rgba(255, 213, 79, 0.4));
}

.star-empty {
  color: #E0E0E0;
}

/* 状态行 */
.status-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-row.locked {
  opacity: 0.7;
}

.question-count {
  font-size: 15px;
  color: #78909C;
  font-weight: 500;
}

/* 难度徽章 */
.difficulty-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  margin-left: auto;
}

.level-beginner {
  background: linear-gradient(135deg, #C8E6C9, #A5D6A7);
}

.level-elementary {
  background: linear-gradient(135deg, #B3E5FC, #81D4FA);
}

.level-intermediate {
  background: linear-gradient(135deg, #FFF9C4, #FFF59D);
}

.level-advanced {
  background: linear-gradient(135deg, #FFE0B2, #FFCC80);
}

.level-expert {
  background: linear-gradient(135deg, #FFCDD2, #EF9A9A);
}

.level-default {
  background: linear-gradient(135deg, #E0E0E0, #BDBDBD);
}

.lock-icon {
  color: #9E9E9E;
  flex-shrink: 0;
}

.locked-text {
  font-size: 13px;
  color: #9E9E9E;
  font-weight: 500;
}

/* 箭头 */
.arrow-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F5F5;
  transition: all 0.2s ease;
}

.arrow {
  color: #BDBDBD;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.card-unlocked .arrow-wrapper {
  background: linear-gradient(135deg, #E1F5FE, #B3E5FC);
}

.card-unlocked .arrow {
  color: #0288D1;
}

.card-unlocked:hover .arrow-wrapper {
  background: linear-gradient(135deg, #4FC3F7, #29B6F6);
  transform: translateX(3px);
}

.card-unlocked:hover .arrow {
  color: white;
}

.arrow-locked {
  background: #EEEEEE;
}

.arrow-locked .arrow {
  color: #BDBDBD;
  opacity: 0.5;
}

@keyframes pulse-gentle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
