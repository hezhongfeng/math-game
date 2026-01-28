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
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 3px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

/* 尺寸变体 */
.size-normal {
  padding: 12px 16px;
  min-height: 64px;
}

.size-large {
  padding: 16px 24px;
  min-height: 80px;
}

/* 状态样式 - 默认 */
.state-default {
  border: 2px solid #e2e8f0;
}

.state-default .number-value {
  color: #1e3a5f;
}

/* 状态样式 - 占位符 */
.state-placeholder {
  border: 2px dashed #cbd5e1;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.state-placeholder .number-value {
  color: #4A90E2;
  animation: pulse-gentle 2s ease-in-out infinite;
  font-weight: 900;
}

/* 状态样式 - 正确 */
.state-correct {
  border: 3px solid #4CAF50;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  animation: correct-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.state-correct .number-value {
  color: #059669;
}

/* 状态样式 - 错误 */
.state-incorrect {
  border: 3px solid #FF9800;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  animation: incorrect-shake 0.5s ease-in-out;
}

.state-incorrect .number-value {
  color: #ea580c;
}

/* 数字文字样式 */
.number-value {
  font-family: inherit;
  font-weight: 800;
  line-height: 1;
  text-align: center;
}

.size-normal .number-value {
  font-size: 2.5rem;
}

.size-large .number-value {
  font-size: 3.5rem;
}

/* 动画 */
@keyframes pulse-gentle {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@keyframes correct-pop {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes incorrect-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* 响应式设计 */
@media (min-width: 768px) {
  .size-normal {
    padding: 16px 20px;
    min-height: 72px;
  }

  .size-large {
    padding: 20px 32px;
    min-height: 96px;
  }

  .size-normal .number-value {
    font-size: 3rem;
  }

  .size-large .number-value {
    font-size: 4rem;
  }
}
</style>
