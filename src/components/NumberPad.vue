<script setup>
import { Delete, Zap } from 'lucide-vue-next'
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
        class="tech-btn num-btn"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="tech-btn num-btn btn-delete"
      >
        <Delete :size="24" stroke-width="2.5" />
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="tech-btn num-btn"
      >
        0
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="tech-btn num-btn btn-submit"
      >
        <Zap :size="28" stroke-width="2.5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  padding: 20px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
  border-radius: var(--radius-sharp-lg);
  border: 2px solid rgba(0, 102, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.number-pad.is-disabled {
  opacity: 0.6;
}

.pad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.tech-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: white;
  background: linear-gradient(145deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%);
  border-radius: var(--radius-sharp-md);
  border: 2px solid rgba(0, 102, 255, 0.3);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 100ms ease;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
}

.tech-btn:hover:not(:disabled) {
  border-color: rgba(0, 102, 255, 0.6);
  box-shadow: 
    0 0 20px rgba(0, 102, 255, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.tech-btn:active:not(:disabled) {
  transform: scale(0.92) translateY(0);
  background: linear-gradient(145deg, rgba(0, 102, 255, 0.8) 0%, rgba(0, 82, 204, 0.9) 100%);
  border-color: rgba(0, 102, 255, 0.8);
  box-shadow: 
    0 0 30px rgba(0, 102, 255, 0.5),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tech-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-delete {
  background: linear-gradient(145deg, rgba(51, 65, 85, 0.6) 0%, rgba(30, 41, 59, 0.7) 100%);
  border-color: rgba(148, 163, 184, 0.3);
  color: rgba(255, 255, 255, 0.7);
}

.btn-delete:hover:not(:disabled) {
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 
    0 0 15px rgba(255, 107, 53, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn-delete:active:not(:disabled) {
  background: linear-gradient(145deg, rgba(255, 107, 53, 0.8) 0%, rgba(229, 90, 43, 0.9) 100%);
  border-color: rgba(255, 107, 53, 0.8);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
}

.btn-submit {
  background: linear-gradient(145deg, rgba(0, 208, 132, 0.8) 0%, rgba(0, 168, 107, 0.9) 100%);
  border-color: rgba(0, 208, 132, 0.5);
  box-shadow: 
    0 0 20px rgba(0, 208, 132, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn-submit:hover:not(:disabled) {
  border-color: rgba(0, 208, 132, 0.8);
  box-shadow: 
    0 0 30px rgba(0, 208, 132, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.btn-submit:active:not(:disabled) {
  transform: scale(0.92) translateY(0);
  background: linear-gradient(145deg, rgba(77, 232, 168, 0.9) 0%, rgba(0, 208, 132, 1) 100%);
  box-shadow: 
    0 0 40px rgba(0, 208, 132, 0.6),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 响应式调整 */
@media (min-width: 768px) {
  .pad-grid {
    gap: 16px;
  }
  
  .tech-btn {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
}

/* 确保触摸目标大小 */
@media (max-width: 375px) {
  .tech-btn {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }
  
  .pad-grid {
    gap: 10px;
  }
}
</style>
