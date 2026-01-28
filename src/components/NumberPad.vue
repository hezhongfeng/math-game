<script setup>
import { computed } from 'vue'
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
    <!-- 数字键盘 -->
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="num-btn aspect-square rounded-cute-xl bg-white flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue border-2 border-peppa-blue/30 hover:border-peppa-blue/50 active:scale-95 transition-all duration-150 min-h-[64px] md:min-h-[72px] min-w-[64px] md:min-w-[72px]"
        :class="{ 'num-btn-disabled': disabled }"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="num-btn aspect-square rounded-cute-xl bg-white flex items-center justify-center border-2 border-peppa-orange/30 hover:border-peppa-orange/50 active:scale-95 transition-all duration-150 min-h-[64px] md:min-h-[72px] min-w-[64px] md:min-w-[72px]"
        :class="{ 'num-btn-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-peppa-orange" :class="{ 'opacity-50': disabled }">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
        </svg>
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="num-btn aspect-square rounded-cute-xl bg-white flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue border-2 border-peppa-blue/30 hover:border-peppa-blue/50 active:scale-95 transition-all duration-150 min-h-[64px] md:min-h-[72px] min-w-[64px] md:min-w-[72px]"
        :class="{ 'num-btn-disabled': disabled }"
      >
        0
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="confirm-btn aspect-square rounded-cute-xl flex items-center justify-center bg-white active:scale-95 transition-all duration-150 border-2 border-peppa-green/40 min-h-[64px] md:min-h-[72px] min-w-[64px] md:min-w-[72px]"
        :class="{ 'confirm-btn-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="text-peppa-green" :class="{ 'opacity-50': disabled }">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  border-radius: 32px;
  padding: 20px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(74, 144, 226, 0.15);
  background: #ffffff;
  transition: all 0.3s ease;
}

.number-pad-disabled {
  opacity: 0.6;
}

/* 数字按钮 - 扁平简约设计 */
.num-btn {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  border: 2px solid rgba(74, 144, 226, 0.2);
  transition: all 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.num-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(74, 144, 226, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.num-btn:active:not(:disabled) {
  transform: scale(0.96);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.num-btn-disabled {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
  color: #cbd5e1 !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 确认按钮 - 扁平简约设计 */
.confirm-btn {
  border: 2px solid rgba(76, 175, 80, 0.25);
  transition: all 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(76, 175, 80, 0.45);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.confirm-btn:active:not(:disabled) {
  transform: scale(0.96);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.confirm-btn-disabled {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}
</style>
