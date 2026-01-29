<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'playful'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  hapticFeedback: {
    type: Boolean,
    default: true
  },
  icon: {
    type: [Object, Function],
    default: null
  },
  iconSize: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['click'])

const isPressed = ref(false)
const rippleActive = ref(false)

// 计算按钮类名
const buttonClasses = computed(() => {
  const baseClasses = [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-child-friendly',
    'font-bold',
    'rounded-cute-xl',
    'transition-all',
    'duration-150',
    'ease-out',
    'touch-manipulation',
    'cursor-pointer',
    'focus:outline-none',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:transform-none'
  ]

  // 尺寸类
  const sizeClasses = {
    small: ['min-w-child-btn-sm', 'min-h-child-btn-sm', 'px-4', 'py-2', 'text-child-sm'],
    medium: ['min-w-child-btn-md', 'min-h-child-btn-md', 'px-6', 'py-3', 'text-child-base'],
    large: ['min-w-child-btn-lg', 'min-h-child-btn-lg', 'px-8', 'py-4', 'text-child-lg'],
    xl: ['min-w-20', 'min-h-20', 'px-10', 'py-5', 'text-child-xl']
  }

  // 变体类
  const variantClasses = {
    primary: [
      'bg-gradient-to-b',
      'from-macaron-primary',
      'to-macaron-primary-dark',
      'text-white',
      'shadow-child-button',
      'border-0',
      'hover:shadow-child-button-hover',
      'hover:-translate-y-1',
      'active:shadow-child-button-active',
      'active:translate-y-1',
      'focus:ring-4',
      'focus:ring-macaron-primary/30'
    ],
    secondary: [
      'bg-white',
      'text-macaron-blue-dark',
      'shadow-child-button',
      'border-2',
      'border-macaron-blue/20',
      'hover:shadow-child-button-hover',
      'hover:-translate-y-1',
      'hover:border-macaron-blue/40',
      'active:shadow-child-button-active',
      'active:translate-y-1',
      'focus:ring-4',
      'focus:ring-macaron-blue/30'
    ],
    success: [
      'bg-gradient-to-b',
      'from-macaron-mint',
      'to-macaron-mint-dark',
      'text-white',
      'shadow-child-button',
      'hover:shadow-child-button-hover',
      'hover:-translate-y-1',
      'active:shadow-child-button-active',
      'active:translate-y-1',
      'focus:ring-4',
      'focus:ring-macaron-mint/30'
    ],
    playful: [
      'bg-gradient-to-b',
      'from-macaron-peach',
      'to-macaron-peach-dark',
      'text-white',
      'shadow-child-button',
      'hover:shadow-child-button-hover',
      'hover:-translate-y-1',
      'active:shadow-child-button-active',
      'active:translate-y-1',
      'focus:ring-4',
      'focus:ring-macaron-peach/30'
    ]
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant]
  ]
})

// 触发触觉反馈
function triggerHapticFeedback() {
  if (props.hapticFeedback && navigator.vibrate) {
    navigator.vibrate(50)
  }
}

// 处理点击事件
function handleClick(event) {
  if (props.disabled || props.loading) return

  // 触觉反馈
  triggerHapticFeedback()

  // 涟漪效果
  rippleActive.value = true
  setTimeout(() => {
    rippleActive.value = false
  }, 600)

  // 按压效果
  isPressed.value = true
  setTimeout(() => {
    isPressed.value = false
  }, 150)

  emit('click', event)
}

// 处理触摸事件
function handleTouchStart() {
  if (props.disabled || props.loading) return
  isPressed.value = true
}

function handleTouchEnd() {
  isPressed.value = false
}
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @mousedown="handleTouchStart"
    @mouseup="handleTouchEnd"
    @mouseleave="handleTouchEnd"
  >
    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- 按钮内容 -->
    <div
      :class="[
        'flex items-center justify-center gap-2 transition-opacity duration-150',
        { 'opacity-0': loading }
      ]"
    >
      <!-- 图标 -->
      <component
        v-if="icon"
        :is="icon"
        :size="iconSize"
        class="flex-shrink-0"
      />

      <!-- 文字内容 -->
      <span v-if="$slots.default">
        <slot />
      </span>
    </div>

    <!-- 涟漪效果 -->
    <div
      v-if="rippleActive"
      class="absolute inset-0 rounded-inherit pointer-events-none overflow-hidden"
    >
      <div class="absolute inset-0 bg-white/30 rounded-inherit animate-ping"></div>
    </div>

    <!-- 光泽效果 -->
    <div
      class="absolute inset-0 rounded-inherit pointer-events-none overflow-hidden opacity-0 hover:opacity-100 transition-opacity duration-300"
    >
      <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-inherit"></div>
    </div>

    <!-- 按压反馈 -->
    <div
      v-if="isPressed"
      class="absolute inset-0 bg-black/10 rounded-inherit pointer-events-none"
    ></div>
  </button>
</template>

<style scoped>
/* 确保按钮在所有设备上都有合适的触摸目标 */
button {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* 防止文本选择 */
button * {
  pointer-events: none;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  button {
    border: 2px solid currentColor !important;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none !important;
  }

  button:hover {
    transform: none !important;
  }

  .animate-ping {
    animation: none !important;
  }
}
</style>
