<script setup>
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
  <div class="number-pad" :class="{ 'number-pad-disabled': disabled }">
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="numpad-btn-clay text-5xl md:text-6xl font-bold"
        :class="{ 'numpad-btn-clay-disabled': disabled }"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="numpad-btn-clay numpad-btn-clay-delete"
        :class="{ 'numpad-btn-clay-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
        </svg>
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="numpad-btn-clay text-5xl md:text-6xl font-bold"
        :class="{ 'numpad-btn-clay-disabled': disabled }"
      >
        0
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="numpad-btn-clay numpad-btn-clay-confirm"
        :class="{ 'numpad-btn-clay-confirm-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   Claymorphism 粘土风数字键盘
   ============================================ */

.number-pad {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f0 100%);
  border-radius: 24px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  padding: 20px 16px;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8),
    inset 2px 2px 4px rgba(255, 255, 255, 0.8),
    inset -2px -2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.number-pad-disabled {
  opacity: 0.7;
}

/* 数字按钮 - 粘土风 */
.numpad-btn-clay {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  aspect-ratio: 1;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  min-width: 56px;
  background: linear-gradient(145deg, #ffffff 0%, #f0f0e8 100%);
  color: var(--game-primary-dark);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 4px 0 0 var(--game-border),
    0 6px 12px rgba(0, 0, 0, 0.08),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.numpad-btn-clay:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow:
    0 7px 0 0 var(--game-border),
    0 10px 20px rgba(0, 0, 0, 0.12),
    inset 0 2px 4px rgba(255, 255, 255, 0.9);
}

.numpad-btn-clay:active:not(:disabled) {
  transform: translateY(2px) scale(0.96);
  box-shadow:
    0 2px 0 0 var(--game-border),
    0 4px 8px rgba(0, 0, 0, 0.06),
    inset 0 3px 6px rgba(0, 0, 0, 0.1);
}

.numpad-btn-clay-disabled {
  background: linear-gradient(145deg, #f0f0e8 0%, #e8e8e0 100%) !important;
  color: var(--game-text-muted) !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow:
    0 2px 0 0 var(--game-border),
    0 3px 8px rgba(0, 0, 0, 0.04),
    inset 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

/* 删除按钮 - 粘土风 */
.numpad-btn-clay-delete {
  background: linear-gradient(145deg, var(--game-error-light) 0%, var(--game-error) 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 4px 0 0 var(--game-error-dark),
    0 6px 12px rgba(207, 74, 74, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.numpad-btn-clay-delete:hover:not(:disabled) {
  background: linear-gradient(145deg, var(--game-error-lighter) 0%, var(--game-error-light) 100%);
  box-shadow:
    0 7px 0 0 var(--game-error-dark),
    0 10px 20px rgba(207, 74, 74, 0.35),
    inset 0 2px 4px rgba(255, 255, 255, 0.4);
}

.numpad-btn-clay-delete:active:not(:disabled) {
  box-shadow:
    0 2px 0 0 var(--game-error-dark),
    0 4px 8px rgba(207, 74, 74, 0.25),
    inset 0 3px 6px rgba(0, 0, 0, 0.15);
}

/* 确认按钮 - 粘土风 */
.numpad-btn-clay-confirm {
  background: linear-gradient(145deg, var(--game-success-light) 0%, var(--game-success) 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 4px 0 0 var(--game-success-dark),
    0 6px 12px rgba(82, 196, 26, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.numpad-btn-clay-confirm:hover:not(:disabled) {
  background: linear-gradient(145deg, var(--game-success-lighter) 0%, var(--game-success-light) 100%);
  box-shadow:
    0 7px 0 0 var(--game-success-dark),
    0 10px 20px rgba(82, 196, 26, 0.35),
    inset 0 2px 4px rgba(255, 255, 255, 0.4);
}

.numpad-btn-clay-confirm:active:not(:disabled) {
  box-shadow:
    0 2px 0 0 var(--game-success-dark),
    0 4px 8px rgba(82, 196, 26, 0.25),
    inset 0 3px 6px rgba(0, 0, 0, 0.15);
}

.numpad-btn-clay-confirm-disabled {
  background: linear-gradient(145deg, #f0f0e8 0%, #e8e8e0 100%) !important;
  color: var(--game-text-muted) !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow:
    0 2px 0 0 var(--game-border),
    0 3px 8px rgba(0, 0, 0, 0.04),
    inset 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .numpad-btn-clay {
    min-height: 72px;
    min-width: 72px;
    border-radius: 20px;
  }
}
</style>
