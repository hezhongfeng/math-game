<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  elevation: {
    type: String,
    default: 'medium',
    validator: (value) => ['low', 'medium', 'high'].includes(value)
  },
  interactive: {
    type: Boolean,
    default: false
  },
  loadingState: {
    type: Boolean,
    default: false
  },
  celebrationTrigger: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'playful'].includes(value)
  },
  rounded: {
    type: String,
    default: 'xl',
    validator: (value) => ['lg', 'xl', '2xl'].includes(value)
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  clickable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'hover', 'focus'])

const isHovered = ref(false)
const isFocused = ref(false)
const isPressed = ref(false)
const showCelebration = ref(false)
const entranceAnimationComplete = ref(false)

// 计算卡片类名
const cardClasses = computed(() => {
  const baseClasses = [
    'relative',
    'bg-white',
    'transition-all',
    'duration-200',
    'ease-out',
    'border-2',
    'border-white/50'
  ]

  // 圆角类
  const roundedClasses = {
    lg: 'rounded-cute-lg',
    xl: 'rounded-cute-xl',
    '2xl': 'rounded-cute-2xl'
  }

  // 内边距类
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  // 阴影类
  const elevationClasses = {
    low: 'shadow-child-soft',
    medium: 'shadow-child-medium',
    high: 'shadow-child-large'
  }

  // 变体类
  const variantClasses = {
    default: [],
    success: [
      'border-macaron-mint/30',
      'bg-gradient-to-br',
      'from-white',
      'to-macaron-mint/5'
    ],
    warning: [
      'border-macaron-peach/30',
      'bg-gradient-to-br',
      'from-white',
      'to-macaron-peach/5'
    ],
    playful: [
      'border-macaron-primary/30',
      'bg-gradient-to-br',
      'from-white',
      'to-macaron-primary/5'
    ]
  }

  // 交互类
  const interactiveClasses = props.interactive || props.clickable ? [
    'cursor-pointer',
    'touch-manipulation',
    'hover:shadow-child-large',
    'hover:-translate-y-1',
    'active:scale-95',
    'focus:outline-none',
    'focus:ring-4',
    'focus:ring-macaron-blue/30'
  ] : []

  // 禁用状态类
  const disabledClasses = props.disabled ? [
    'opacity-50',
    'cursor-not-allowed',
    'pointer-events-none'
  ] : []

  return [
    ...baseClasses,
    roundedClasses[props.rounded],
    paddingClasses[props.padding],
    elevationClasses[props.elevation],
    ...variantClasses[props.variant],
    ...interactiveClasses,
    ...disabledClasses
  ]
})

// 处理点击事件
function handleClick(event) {
  if (props.disabled) return

  // 按压效果
  isPressed.value = true
  setTimeout(() => {
    isPressed.value = false
  }, 150)

  emit('click', event)
}

// 处理悬停事件
function handleMouseEnter() {
  if (props.disabled) return
  isHovered.value = true
  emit('hover', true)
}

function handleMouseLeave() {
  isHovered.value = false
  emit('hover', false)
}

// 处理焦点事件
function handleFocus() {
  if (props.disabled) return
  isFocused.value = true
  emit('focus', true)
}

function handleBlur() {
  isFocused.value = false
  emit('focus', false)
}

// 触发庆祝动画
function triggerCelebration() {
  showCelebration.value = true
  setTimeout(() => {
    showCelebration.value = false
  }, 800)
}

// 入场动画
onMounted(() => {
  setTimeout(() => {
    entranceAnimationComplete.value = true
  }, 100)

  // 监听庆祝触发器变化
  if (props.celebrationTrigger) {
    triggerCelebration()
  }
})
</script>

<template>
  <div
    ref="cardRef"
    :class="[
      cardClasses,
      {
        'animate-card-entrance': !entranceAnimationComplete,
        'animate-celebration': showCelebration,
        'animate-success-glow': variant === 'success' && celebrationTrigger,
        'scale-95': isPressed,
        'min-h-child-card': interactive || clickable
      }
    ]"
    :tabindex="(interactive || clickable) && !disabled ? 0 : -1"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- 加载状态遮罩 -->
    <div
      v-if="loadingState"
      class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-inherit flex items-center justify-center z-10"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-3 border-macaron-blue border-t-transparent rounded-full animate-spin"></div>
        <span class="text-child-sm font-child-friendly text-gray-600">加载中...</span>
      </div>
    </div>

    <!-- 庆祝粒子效果 -->
    <div
      v-if="showCelebration"
      class="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="absolute w-2 h-2 bg-macaron-primary rounded-full animate-confetti-fall"
        :style="{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 0.5}s`,
          animationDuration: `${2 + Math.random()}s`
        }"
      ></div>
    </div>

    <!-- 光泽效果 -->
    <div
      class="absolute inset-0 rounded-inherit pointer-events-none overflow-hidden opacity-0 hover:opacity-100 transition-opacity duration-300"
    >
      <div class="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-inherit"></div>
    </div>

    <!-- 悬停光晕 -->
    <div
      v-if="isHovered && (interactive || clickable)"
      class="absolute -inset-1 bg-gradient-to-r from-macaron-blue/20 via-macaron-primary/20 to-macaron-mint/20 rounded-inherit blur-sm -z-10 animate-pulse-gentle"
    ></div>

    <!-- 焦点指示器 -->
    <div
      v-if="isFocused"
      class="absolute -inset-1 border-2 border-macaron-blue rounded-inherit -z-10 animate-pulse-gentle"
    ></div>

    <!-- 卡片内容 -->
    <div class="relative z-0">
      <slot />
    </div>

    <!-- 装饰性元素插槽 -->
    <div
      v-if="$slots.decoration"
      class="absolute top-4 right-4 pointer-events-none"
    >
      <slot name="decoration" />
    </div>

    <!-- 角标插槽 -->
    <div
      v-if="$slots.badge"
      class="absolute -top-2 -right-2 z-10"
    >
      <slot name="badge" />
    </div>
  </div>
</template>

<style scoped>
/* 确保卡片在所有设备上都有合适的触摸体验 */
div[tabindex] {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 庆祝粒子动画 */
@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(200px) rotate(720deg) scale(0);
    opacity: 0;
  }
}

/* 入场动画 */
@keyframes card-entrance {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 成功发光动画 */
@keyframes success-glow {
  0% {
    box-shadow: 0 0 0 rgba(129, 199, 132, 0);
  }
  50% {
    box-shadow: 0 0 30px rgba(129, 199, 132, 0.6);
  }
  100% {
    box-shadow: 0 0 0 rgba(129, 199, 132, 0);
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  div[tabindex] {
    border: 2px solid currentColor !important;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-card-entrance,
  .animate-celebration,
  .animate-success-glow,
  .animate-confetti-fall,
  .animate-pulse-gentle {
    animation: none !important;
  }

  div:hover {
    transform: none !important;
  }

  .transition-all {
    transition: none !important;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  div[tabindex]:hover {
    transform: none;
  }

  div[tabindex]:active {
    transform: scale(0.98);
  }
}
</style>
