<script setup>
import { Delete, Check } from 'lucide-vue-next'
import { useSound } from '../composables/useSound'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['input', 'delete', 'submit'])
const { playSound } = useSound()

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function handleInput(num) {
  if (props.disabled) return
  playSound('click')
  emit('input', num)
}

function handleDelete() {
  if (props.disabled) return
  playSound('click')
  emit('delete')
}

function handleSubmit() {
  if (props.disabled) return
  playSound('click')
  emit('submit')
}
</script>

<template>
  <div class="number-pad" :class="{ 'is-disabled': disabled }">
    <div class="pad-grid">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="btn-circular num-btn"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="btn-circular num-btn num-btn-delete"
      >
        <Delete :size="24" stroke-width="2.5" />
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="btn-circular num-btn"
      >
        0
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="btn-circular-accent num-btn num-btn-submit"
      >
        <Check :size="28" stroke-width="3" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 0.5px solid rgba(255, 255, 255, 0.5);
}

.number-pad.is-disabled {
  opacity: 0.6;
}

.pad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.num-btn {
  width: 72px;
  height: 72px;
  font-size: 28px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.num-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.num-btn-delete {
  background: var(--ios-gray-4);
  color: var(--ios-text-primary);
}

.num-btn-delete:hover:not(:disabled) {
  background: var(--ios-gray-3);
}

.num-btn-submit {
  background: var(--ios-green);
}

.num-btn-submit:hover:not(:disabled) {
  background: var(--ios-green-dark);
}

/* 响应式调整 */
@media (min-width: 768px) {
  .pad-grid {
    gap: 16px;
  }
  
  .num-btn {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
}

/* 确保触摸目标大小 */
@media (max-width: 375px) {
  .num-btn {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }
  
  .pad-grid {
    gap: 10px;
  }
}
</style>
