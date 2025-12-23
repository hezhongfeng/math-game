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
  <div class="number-pad bg-white rounded-2xl shadow-lg p-4">
    <!-- 数字键盘 -->
    <div class="grid grid-cols-3 gap-3">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="aspect-square rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 active:scale-95 transition-all duration-200 flex items-center justify-center text-3xl font-bold text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ num }}
      </button>
      
      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="aspect-square rounded-xl bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 active:scale-95 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Delete :size="28" class="text-red-500" />
      </button>
      
      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="aspect-square rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 active:scale-95 transition-all duration-200 flex items-center justify-center text-3xl font-bold text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        0
      </button>
      
      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="aspect-square rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check :size="28" class="text-white" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

button:active:not(:disabled) {
  transform: scale(0.95);
}
</style>
