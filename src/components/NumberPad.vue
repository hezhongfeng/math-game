<script setup>
import { computed } from 'vue'
import { Delete } from 'lucide-vue-next'
import { useSound } from '../composables/useSound'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['input', 'delete'])
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
</script>

<template>
  <div class="number-pad bg-white rounded-cute-2xl shadow-cute-xl p-5 md:p-6 border-5 border-peppa-blue-light">
    <!-- 数字键盘 -->
    <div class="grid grid-cols-3 gap-4 md:gap-5">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="aspect-square md:aspect-auto md:h-[90px] rounded-cute-2xl bg-gradient-to-br from-peppa-blue-light/70 to-peppa-blue-light/90 hover:from-peppa-blue-light hover:to-peppa-blue active:scale-95 transition-all duration-200 flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-4 border-peppa-blue-light touch-manipulation"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="aspect-square md:aspect-auto md:h-[90px] rounded-cute-2xl bg-gradient-to-br from-peppa-orange/70 to-peppa-orange/90 hover:from-peppa-orange hover:to-[#E65100] active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-4 border-peppa-orange touch-manipulation"
      >
        <Delete :size="36" class="text-peppa-orange-dark" />
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="aspect-square md:aspect-auto md:h-[90px] rounded-cute-2xl bg-gradient-to-br from-peppa-blue-light/70 to-peppa-blue-light/90 hover:from-peppa-blue-light hover:to-peppa-blue active:scale-95 transition-all duration-200 flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-4 border-peppa-blue-light touch-manipulation"
      >
        0
      </button>
    </div>

    <!-- 键盘提示 -->
    <div class="mt-5 text-center">
      <p class="text-sm text-peppa-blue-dark/70 font-rounded">
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
