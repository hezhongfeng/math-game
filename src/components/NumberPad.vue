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
    <div class="grid grid-cols-3 gap-4 md:gap-5">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="num-btn aspect-square rounded-cute-xl flex items-center justify-center text-5xl md:text-6xl font-bold min-h-[72px] md:min-h-[80px] min-w-[72px] md:min-w-[80px]"
        :class="{ 'num-btn-disabled': disabled }"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="num-btn aspect-square rounded-cute-xl flex items-center justify-center min-h-[72px] md:min-h-[80px] min-w-[72px] md:min-w-[80px]"
        :class="{ 'num-btn-disabled': disabled }"
        style="background: linear-gradient(180deg, #FFE0B2 0%, #FFCC80 100%); box-shadow: 0 4px 0 0 #F57C00, 0 6px 15px rgba(245, 124, 0, 0.2);"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E65100" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" :class="{ 'opacity-50': disabled }">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
        </svg>
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="num-btn aspect-square rounded-cute-xl flex items-center justify-center text-5xl md:text-6xl font-bold min-h-[72px] md:min-h-[80px] min-w-[72px] md:min-w-[80px]"
        :class="{ 'num-btn-disabled': disabled }"
      >
        0
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="confirm-btn aspect-square rounded-cute-xl flex items-center justify-center min-h-[72px] md:min-h-[80px] min-w-[72px] md:min-w-[80px]"
        :class="{ 'confirm-btn-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" :class="{ 'opacity-50': disabled }">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 数字键盘 - 立体容器 */
.number-pad {
  border-radius: 32px;
  padding: 24px 20px;
  background: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 6px 0 0 rgba(0, 0, 0, 0.06),
    0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.number-pad-disabled {
  opacity: 0.5;
}

/* 数字按钮 - 3D立体效果 */
.num-btn {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  border: none;
  border-radius: 20px;
  transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 4px 0 0 #BDBDBD,
    0 6px 15px rgba(0, 0, 0, 0.1);
  color: #37474F;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
}

.num-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 6px 0 0 #BDBDBD,
    0 10px 25px rgba(0, 0, 0, 0.15);
}

.num-btn:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow:
    0 1px 0 0 #BDBDBD,
    0 2px 8px rgba(0, 0, 0, 0.1);
}

.num-btn-disabled {
  background: linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%) !important;
  box-shadow:
    0 2px 0 0 #9E9E9E,
    0 2px 8px rgba(0, 0, 0, 0.05) !important;
  color: #BDBDBD !important;
  cursor: not-allowed;
  transform: none !important;
}

/* 确认按钮 - 绿色渐变立体 */
.confirm-btn {
  background: linear-gradient(180deg, #81C784 0%, #66BB6A 100%);
  border: none;
  border-radius: 20px;
  transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 4px 0 0 #4CAF50,
    0 6px 15px rgba(102, 187, 106, 0.3);
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 6px 0 0 #4CAF50,
    0 10px 25px rgba(102, 187, 106, 0.4);
}

.confirm-btn:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow:
    0 1px 0 0 #4CAF50,
    0 2px 8px rgba(102, 187, 106, 0.3);
}

.confirm-btn-disabled {
  background: linear-gradient(180deg, #e0e0e0 0%, #bdbdbd 100%) !important;
  box-shadow:
    0 2px 0 0 #9E9E9E,
    0 2px 8px rgba(0, 0, 0, 0.05) !important;
  cursor: not-allowed;
  transform: none !important;
}
</style>
