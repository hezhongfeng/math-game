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
  <div class="number-pad bg-white rounded-cute-2xl shadow-cute-lg p-4 md:p-5 border-2 border-peppa-blue/20">
    <!-- 数字键盘 -->
    <div class="grid grid-cols-3 gap-3 md:gap-4">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-blue-light to-peppa-blue hover:from-peppa-blue hover:to-peppa-blue-dark active:scale-95 transition-all duration-150 flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-blue/30"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-orange/80 to-peppa-orange hover:from-peppa-orange hover:to-peppa-orange-dark active:scale-95 transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-orange/30"
      >
        <Delete :size="36" class="text-peppa-orange-dark" />
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-blue-light to-peppa-blue hover:from-peppa-blue hover:to-peppa-blue-dark active:scale-95 transition-all duration-150 flex items-center justify-center text-5xl md:text-6xl font-bold text-peppa-blue-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-blue/30"
      >
        0
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="aspect-square rounded-cute-xl bg-gradient-to-br from-peppa-green to-peppa-green-dark hover:from-peppa-green-light hover:to-peppa-green active:scale-95 transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-cute border-2 border-peppa-green/30"
      >
        <Check :size="40" class="text-white" />
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
  touch-action: manipulation;
}
</style>
