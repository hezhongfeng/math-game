<script setup>
import { computed } from 'vue'
import { Check, Clock } from 'lucide-vue-next'
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
    <!-- 禁用遮罩提示 -->
    <Transition name="fade">
      <div v-if="disabled" class="disabled-overlay">
        <div class="disabled-content">
          <Clock :size="32" class="disabled-icon" />
          <span class="disabled-text">请等待...</span>
        </div>
      </div>
    </Transition>

    <!-- 数字键盘 -->
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="num-btn aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-blue-light to-peppa-blue hover:from-peppa-blue hover:to-peppa-blue-dark active:scale-95 transition-all duration-150 flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue-dark shadow-cute border-2 border-peppa-blue/30"
        :class="{ 'num-btn-disabled': disabled }"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="num-btn aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-orange/80 to-peppa-orange hover:from-peppa-orange hover:to-peppa-orange-dark active:scale-95 transition-all duration-150 flex items-center justify-center shadow-cute border-2 border-peppa-orange/30"
        :class="{ 'num-btn-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-peppa-orange-dark" :class="{ 'opacity-50': disabled }">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
        </svg>
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="num-btn aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-blue-light to-peppa-blue hover:from-peppa-blue hover:to-peppa-blue-dark active:scale-95 transition-all duration-150 flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue-dark shadow-cute border-2 border-peppa-blue/30"
        :class="{ 'num-btn-disabled': disabled }"
      >
        0
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="confirm-btn aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-yellow to-peppa-yellow-dark hover:from-peppa-yellow-light hover:to-peppa-yellow active:scale-95 transition-all duration-150 shadow-cute border-2 border-peppa-yellow/50"
        :class="{ 'confirm-btn-disabled': disabled }"
      >
        <div class="flex flex-col items-center justify-center gap-0.5">
          <Check :size="28" class="text-peppa-orange-dark md:mb-1" stroke-width="4" :class="{ 'opacity-50': disabled }" />
          <span class="text-lg md:text-xl font-bold text-peppa-orange-dark font-rounded leading-none">确定</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  background: linear-gradient(135deg, #ffffff 0%, #F5F9FF 100%);
  border-radius: 32px;
  padding: 20px 16px;
  box-shadow: 
    0 8px 30px rgba(74, 144, 226, 0.15),
    0 4px 15px rgba(74, 144, 226, 0.1);
  border: 2px solid rgba(74, 144, 226, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.number-pad-disabled {
  opacity: 0.7;
  border-color: rgba(74, 144, 226, 0.1);
}

/* 禁用遮罩 */
.disabled-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 249, 255, 0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.disabled-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: pulse-wait 1.5s ease-in-out infinite;
}

.disabled-icon {
  color: #4A90E2;
  animation: spin-wait 2s linear infinite;
}

.disabled-text {
  font-size: 16px;
  font-weight: 700;
  color: #4A90E2;
  font-family: inherit;
  letter-spacing: 2px;
}

@keyframes pulse-wait {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes spin-wait {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 数字按钮 */
.num-btn {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.num-btn:hover:not(:disabled) {
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
  transform: translateY(-2px);
}

.num-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.num-btn-disabled {
  background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%) !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  color: #999 !important;
  cursor: not-allowed;
  box-shadow: none !important;
  transform: none !important;
}

/* 确认按钮 */
.confirm-btn {
  transform: scale(1.08);
  box-shadow: 0 8px 25px rgba(255, 213, 79, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
}

.confirm-btn:hover:not(:disabled) {
  transform: scale(1.12);
  box-shadow: 0 10px 35px rgba(255, 213, 79, 0.5);
}

.confirm-btn:active:not(:disabled) {
  transform: scale(0.95) scale(1.08);
}

.confirm-btn-disabled {
  background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%) !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  box-shadow: none !important;
  animation: none !important;
  transform: scale(1.08) !important;
  cursor: not-allowed;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 8px 25px rgba(255, 213, 79, 0.4);
  }
  50% {
    box-shadow: 0 8px 40px rgba(255, 213, 79, 0.6);
  }
}
</style>
