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
        class="numpad-btn text-5xl md:text-6xl font-bold"
        :class="{ 'numpad-btn-disabled': disabled }"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="numpad-btn numpad-btn-delete"
        :class="{ 'numpad-btn-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
        </svg>
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="numpad-btn text-5xl md:text-6xl font-bold"
        :class="{ 'numpad-btn-disabled': disabled }"
      >
        0
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="numpad-btn numpad-btn-confirm"
        :class="{ 'numpad-btn-confirm-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  composes: game-card;
  padding: 16px 12px;
  transition: all 0.3s ease;
}

.number-pad-disabled {
  opacity: 0.6;
}

.numpad-btn {
  composes: touch-manipulation;
  aspect-ratio: 1;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  min-width: 56px;
  background: var(--game-bg-light);
  color: var(--game-primary-dark);
  border: 2px solid rgba(79, 70, 229, 0.1);
  transition: all 0.15s ease;
  box-shadow:
    0 3px 0 0 var(--game-border),
    0 4px 12px rgba(0, 0, 0, 0.08);
}

.numpad-btn:hover:not(:disabled) {
  background: var(--game-bg);
  transform: translateY(-1px);
  box-shadow:
    0 4px 0 0 var(--game-border),
    0 8px 20px rgba(0, 0, 0, 0.12);
}

.numpad-btn:active:not(:disabled) {
  transform: translateY(1px) scale(0.97);
  box-shadow:
    0 1px 0 0 var(--game-border),
    0 2px 8px rgba(0, 0, 0, 0.06);
}

.numpad-btn-disabled {
  background: var(--game-bg-light) !important;
  color: var(--game-text-muted) !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow:
    0 1px 0 0 var(--game-border),
    0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

/* 删除按钮 */
.numpad-btn-delete {
  background: linear-gradient(135deg, #FF8A80 0%, #FF6B6B 100%);
  color: white;
  border: 2px solid rgba(255, 107, 107, 0.4);
  box-shadow:
    0 3px 0 0 rgba(200, 70, 70, 0.4),
    0 4px 12px rgba(255, 107, 107, 0.25);
}

.numpad-btn-delete:hover:not(:disabled) {
  background: linear-gradient(135deg, #FFB3B0 0%, #FF8A80 100%);
  box-shadow:
    0 4px 0 0 rgba(200, 70, 70, 0.4),
    0 8px 20px rgba(255, 107, 107, 0.35);
}

.numpad-btn-delete:active:not(:disabled) {
  box-shadow:
    0 1px 0 0 rgba(200, 70, 70, 0.4),
    0 2px 8px rgba(255, 107, 107, 0.25);
}

/* 确认按钮 */
.numpad-btn-confirm {
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  color: white;
  border: 2px solid rgba(102, 187, 106, 0.4);
  box-shadow:
    0 3px 0 0 rgba(60, 140, 60, 0.4),
    0 4px 12px rgba(102, 187, 106, 0.25);
}

.numpad-btn-confirm:hover:not(:disabled) {
  background: linear-gradient(135deg, #A5D6A7 0%, #81C784 100%);
  box-shadow:
    0 4px 0 0 rgba(60, 140, 60, 0.4),
    0 8px 20px rgba(102, 187, 106, 0.35);
}

.numpad-btn-confirm:active:not(:disabled) {
  box-shadow:
    0 1px 0 0 rgba(60, 140, 60, 0.4),
    0 2px 8px rgba(102, 187, 106, 0.25);
}

.numpad-btn-confirm-disabled {
  background: var(--game-bg-light) !important;
  color: var(--game-text-muted) !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow:
    0 1px 0 0 var(--game-border),
    0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .numpad-btn {
    min-height: 64px;
    min-width: 64px;
    border-radius: 18px;
  }
}
</style>
