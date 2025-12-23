<script setup>
import { computed } from 'vue'
import { Delete, Check } from 'lucide-vue-next'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['input', 'delete', 'submit'])

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function handleInput(num) {
  emit('input', num)
}

function handleDelete() {
  emit('delete')
}

function handleSubmit() {
  emit('submit')
}
</script>

<template>
  <div class="number-pad bg-white rounded-cute-xl shadow-cute-lg p-5 border-4 border-peppa-blue-light relative overflow-hidden">
    <!-- 装饰元素 -->
    <div class="absolute top-2 left-3 text-2xl opacity-60 animate-float" style="animation-delay: 0s;">⚽</div>
    <div class="absolute top-3 right-4 text-xl opacity-50 animate-float" style="animation-delay: 0.5s;">🚀</div>
    <div class="absolute bottom-2 left-4 text-lg opacity-40 animate-float" style="animation-delay: 1s;">⭐</div>
    <div class="absolute bottom-3 right-3 text-2xl opacity-60 animate-wiggle">⚽</div>

    <!-- 数字键盘 -->
    <div class="grid grid-cols-3 gap-3">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="aspect-square rounded-cute-lg bg-gradient-to-br from-peppa-blue-light/50 to-peppa-blue-light/70 hover:from-peppa-blue-light hover:to-peppa-blue active:scale-95 transition-all duration-200 flex items-center justify-center text-3xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-3 border-peppa-blue-light"
      >
        {{ num }}
        <span class="absolute text-xs opacity-0 hover:opacity-100 transition-opacity duration-200">⚽</span>
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="aspect-square rounded-cute-lg bg-gradient-to-br from-peppa-orange/50 to-peppa-orange/70 hover:from-peppa-orange hover:to-[#E65100] active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-3 border-peppa-orange"
      >
        <Delete :size="28" class="text-peppa-orange-dark" />
        <span class="absolute text-sm opacity-0 hover:opacity-100 transition-opacity duration-200">🗑️</span>
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="aspect-square rounded-cute-lg bg-gradient-to-br from-peppa-blue-light/50 to-peppa-blue-light/70 hover:from-peppa-blue-light hover:to-peppa-blue active:scale-95 transition-all duration-200 flex items-center justify-center text-3xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-3 border-peppa-blue-light"
      >
        0
        <span class="absolute text-xs opacity-0 hover:opacity-100 transition-opacity duration-200">⚽</span>
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="aspect-square rounded-cute-lg bg-gradient-to-br from-peppa-green to-[#388E3C] hover:from-[#66BB6A] hover:to-[#388E3C] active:scale-95 transition-all duration-200 flex items-center justify-center shadow-glow-yellow disabled:opacity-50 disabled:cursor-not-allowed border-3 border-peppa-green"
      >
        <Check :size="28" class="text-white" />
        <span class="absolute text-sm opacity-0 hover:opacity-100 transition-opacity duration-200">⭐</span>
      </button>
    </div>

    <!-- 底部装饰 -->
    <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1 text-xs opacity-30">
      <span>⚽</span>
      <span>⚽</span>
      <span>⚽</span>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  background: linear-gradient(135deg, #E3F2FD 0%, #ffffff 100%);
  position: relative;
}

.number-pad::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 30%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(0, 188, 212, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

button {
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

button:active:not(:disabled)::after {
  width: 200%;
  height: 200%;
}
</style>
