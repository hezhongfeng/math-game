<script setup>
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
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
  playSound('click')
  emit('input', num)
}

function handleDelete() {
  playSound('click')
  emit('delete')
}

function handleSubmit() {
  playSound('click')
  emit('submit')
}
</script>

<template>
  <div class="number-pad bg-white rounded-cute-2xl shadow-cute-lg p-4 md:p-5 border-2 border-peppa-blue/20">
    <!-- 数字键盘 -->
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-blue-light to-peppa-blue hover:from-peppa-blue hover:to-peppa-blue-dark active:scale-95 transition-all duration-150 flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-blue/30 hover:shadow-cute-lg"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-orange/80 to-peppa-orange hover:from-peppa-orange hover:to-peppa-orange-dark active:scale-95 transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-orange/30 hover:shadow-cute-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-peppa-orange-dark">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
        </svg>
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-blue-light to-peppa-blue hover:from-peppa-blue hover:to-peppa-blue-dark active:scale-95 transition-all duration-150 flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-blue/30 hover:shadow-cute-lg"
      >
        0
      </button>

      <!-- 确认按钮 - 优化版 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="confirm-btn aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-yellow to-peppa-yellow-dark hover:from-peppa-yellow-light hover:to-peppa-yellow active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-yellow/50 hover:shadow-cute-lg"
      >
        <div class="flex flex-col items-center justify-center gap-0.5">
          <Check :size="28" class="text-peppa-orange-dark md:mb-1" stroke-width="4" />
          <span class="text-lg md:text-xl font-bold text-peppa-orange-dark font-rounded leading-none">确定</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  background: linear-gradient(135deg, #ffffff 0%, #F5F9FF 100%);
  box-shadow: 
    0 8px 30px rgba(74, 144, 226, 0.15),
    0 4px 15px rgba(74, 144, 226, 0.1);
}

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

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 8px 25px rgba(255, 213, 79, 0.4);
  }
  50% {
    box-shadow: 0 8px 40px rgba(255, 213, 79, 0.6);
  }
}

button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>
