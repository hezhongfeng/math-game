<script setup>
import { computed } from 'vue'
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
  <div class="number-pad bg-white rounded-cute-xl shadow-cute-lg p-4 md:p-5 border-4 border-peppa-blue-light">
    <!-- 数字键盘 -->
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="aspect-square md:aspect-auto md:h-[80px] rounded-cute-lg bg-gradient-to-br from-peppa-blue-light/60 to-peppa-blue-light/80 hover:from-peppa-blue-light hover:to-peppa-blue active:scale-95 transition-all duration-150 flex items-center justify-center text-4xl md:text-5xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-3 border-peppa-blue-light touch-manipulation"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="aspect-square md:aspect-auto md:h-[80px] rounded-cute-lg bg-gradient-to-br from-peppa-orange/60 to-peppa-orange/80 hover:from-peppa-orange hover:to-[#E65100] active:scale-95 transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-3 border-peppa-orange touch-manipulation"
      >
        <Delete :size="32" class="text-peppa-orange-dark" />
        <span class="ml-1 text-base font-bold text-peppa-orange-dark">清除</span>
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="aspect-square md:aspect-auto md:h-[80px] rounded-cute-lg bg-gradient-to-br from-peppa-blue-light/60 to-peppa-blue-light/80 hover:from-peppa-blue-light hover:to-peppa-blue active:scale-95 transition-all duration-150 flex items-center justify-center text-4xl md:text-5xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-3 border-peppa-blue-light touch-manipulation"
      >
        0
      </button>

  <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="aspect-square md:aspect-auto md:h-[80px] rounded-cute-lg bg-gradient-to-br from-peppa-green to-[#388E3C] hover:from-[#66BB6A] hover:to-[#388E3C] active:scale-95 transition-all duration-150 flex items-center justify-center shadow-cute-lg disabled:opacity-50 disabled:cursor-not-allowed border-4 border-peppa-green touch-manipulation"
      >
        <Check :size="36" class="text-white" />
        <span class="ml-1 text-lg font-bold text-white">确认</span>
      </button>
    </div>

    <!-- 键盘提示 -->
    <div class="mt-4 text-center">
      <p class="text-xs text-peppa-blue-dark/60 font-rounded">
        键盘：数字键输入，Enter/空格 确认，Backspace 删除
      </p>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  background: linear-gradient(135deg, #ffffff 0%, #F0F9FF 100%);
}

button {
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}
</style>
