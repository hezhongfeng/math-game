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
  <div class="number-pad bg-white rounded-cute-xl shadow-cute p-4 border-2 border-peppa-blue/20">
    <!-- 数字键盘 -->
    <div class="grid grid-cols-3 gap-3">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="aspect-square rounded-cute-lg bg-gradient-to-br from-peppa-blue-light to-peppa-blue hover:from-peppa-blue hover:to-peppa-blue-dark active:scale-95 transition-all duration-150 flex items-center justify-center text-4xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-blue/30"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="aspect-square rounded-cute-lg bg-gradient-to-br from-peppa-orange/80 to-peppa-orange hover:from-peppa-orange hover:to-peppa-orange-dark active:scale-95 transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-orange/30"
      >
        <Delete :size="28" class="text-peppa-orange-dark" />
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="aspect-square rounded-cute-lg bg-gradient-to-br from-peppa-blue-light to-peppa-blue hover:from-peppa-blue hover:to-peppa-blue-dark active:scale-95 transition-all duration-150 flex items-center justify-center text-4xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-blue/30"
      >
        0
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  background: linear-gradient(135deg, #ffffff 0%, #F5F9FF 100%);
}

button {
  -webkit-tap-highlight-color: transparent;
}
</style>
