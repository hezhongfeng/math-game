<script setup>
/**
 * NumberCard 组件 - 数字方框卡片
 * 用于展示算式中的数字和答案，提供统一的外观和状态样式
 */

const props = defineProps({
  value: {
    type: [Number, String],
    required: true
  },
  size: {
    type: String,
    default: 'normal', // 'normal' | 'large'
    validator: (value) => ['normal', 'large'].includes(value)
  },
  state: {
    type: String,
    default: 'default', // 'default' | 'placeholder' | 'correct' | 'incorrect'
    validator: (value) => ['default', 'placeholder', 'correct', 'incorrect'].includes(value)
  },
  minWidth: {
    type: String,
    default: '3ch'
  }
})
</script>

<template>
  <div
    class="number-card"
    :class="[
      `size-${size}`,
      `state-${state}`
    ]"
    :style="{ minWidth: props.minWidth }"
  >
    <span class="number-value">{{ value }}</span>
  </div>
</template>

<style scoped>
.number-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 14px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

/* 尺寸变体 */
.size-normal {
  padding: 10px 14px;
  min-height: 56px;
}

.size-large {
  padding: 14px 20px;
  min-height: 72px;
}

/* 状态样式 - 默认 */
.state-default {
  border: 2px solid var(--game-border);
}

.state-default .number-value {
  color: var(--game-text);
}

/* 状态样式 - 占位符 */
.state-placeholder {
  border: 2px solid var(--game-border);
  background: var(--game-bg-light);
}

.state-placeholder .number-value {
  color: var(--game-text-muted);
  font-weight: 400;
}

/* 状态样式 - 正确 */
.state-correct {
  border: 2px solid var(--game-success);
  background: linear-gradient(135deg, #ffffff 0%, rgba(34, 197, 94, 0.1) 100%);
  animation: correct-pop 0.4s ease-out;
}

.state-correct .number-value {
  color: var(--game-success-dark);
}

/* 状态样式 - 错误 */
.state-incorrect {
  border: 2px solid var(--game-accent);
  background: linear-gradient(135deg, #ffffff 0%, rgba(249, 115, 22, 0.1) 100%);
}

.state-incorrect .number-value {
  color: var(--game-accent-dark);
}

/* 数字文字样式 */
.number-value {
  font-family: inherit;
  font-weight: 700;
  line-height: 1;
  text-align: center;
}

.size-normal .number-value {
  font-size: 2.2rem;
}

.size-large .number-value {
  font-size: 2.6rem;
}

/* 动画 */
@keyframes correct-pop {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); opacity: 1; }
}

/* 响应式设计 */
@media (min-width: 768px) {
  .size-normal {
    padding: 14px 18px;
    min-height: 64px;
  }

  .size-large {
    padding: 18px 28px;
    min-height: 84px;
  }

  .size-normal .number-value {
    font-size: 2.6rem;
  }

  .size-large .number-value {
    font-size: 3rem;
  }
}
</style>
