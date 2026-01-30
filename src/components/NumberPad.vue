<script setup>
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
    <!-- 数字键盘 - Candy Claymorphism Style -->
    <div class="grid grid-cols-3 gap-4 md:gap-5">
      <!-- 数字键 1-9 -->
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="numpad-btn-candy text-4xl md:text-5xl font-bold text-candy-choco"
        :class="{ 'numpad-btn-disabled': disabled }"
      >
        {{ num }}
      </button>

      <!-- 清除按钮 -->
      <button
        @click="handleDelete"
        :disabled="disabled"
        class="numpad-btn-candy numpad-btn-delete"
        :class="{ 'numpad-btn-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'opacity-50': disabled }">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
        </svg>
      </button>

      <!-- 数字键 0 -->
      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="numpad-btn-candy text-4xl md:text-5xl font-bold text-candy-choco"
        :class="{ 'numpad-btn-disabled': disabled }"
      >
        0
      </button>

      <!-- 确认按钮 -->
      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="numpad-btn-candy numpad-btn-confirm"
        :class="{ 'numpad-btn-confirm-disabled': disabled }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" :class="{ 'opacity-50': disabled }">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 数字键盘 - Candy Claymorphism 容器 */
.number-pad {
  border-radius: 28px;
  padding: 24px 20px;
  background: linear-gradient(135deg, #ffffff 0%, #FFFBF5 100%);
  border: 3px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-shadow:
    8px 8px 20px rgba(0, 0, 0, 0.08),
    -4px -4px 12px rgba(255, 255, 255, 0.9),
    inset -2px -2px 8px rgba(0, 0, 0, 0.03),
    inset 2px 2px 8px rgba(255, 255, 255, 0.9);
}

.number-pad-disabled {
  opacity: 0.6;
}

/* 数字按钮 - Candy Claymorphism 泡泡风格 */
.numpad-btn-candy {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  aspect-ratio: 1;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72px;
  min-width: 72px;
  background: linear-gradient(180deg, #FFFBF5 0%, #FFF5E6 100%);
  border: 3px solid white;
  transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    4px 4px 10px rgba(0, 0, 0, 0.08),
    -2px -2px 6px rgba(255, 255, 255, 1),
    inset -1px -1px 4px rgba(0, 0, 0, 0.03),
    inset 1px 1px 4px rgba(255, 255, 255, 0.9);
}

.numpad-btn-candy:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    6px 6px 14px rgba(0, 0, 0, 0.1),
    -3px -3px 8px rgba(255, 255, 255, 1),
    inset -1px -1px 4px rgba(0, 0, 0, 0.03),
    inset 1px 1px 4px rgba(255, 255, 255, 0.9);
}

.numpad-btn-candy:active:not(:disabled) {
  transform: scale(0.92);
  box-shadow:
    2px 2px 5px rgba(0, 0, 0, 0.08),
    -1px -1px 4px rgba(255, 255, 255, 1),
    inset -2px -2px 6px rgba(0, 0, 0, 0.08),
    inset 2px 2px 6px rgba(255, 255, 255, 0.6);
}

/* 果冻动画 */
.numpad-btn-candy:not(:disabled):active {
  animation: jellyClay 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.numpad-btn-disabled {
  background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%) !important;
  box-shadow:
    2px 2px 5px rgba(0, 0, 0, 0.05),
    -1px -1px 4px rgba(255, 255, 255, 1),
    inset -1px -1px 4px rgba(0, 0, 0, 0.05),
    inset 1px 1px 4px rgba(255, 255, 255, 0.8) !important;
  color: #BDBDBD !important;
  cursor: not-allowed;
  transform: none !important;
  animation: none !important;
  border-color: #f0f0f0 !important;
}

/* 删除按钮 - 蜜桃橙 */
.numpad-btn-delete {
  background: linear-gradient(180deg, #FFE4D6 0%, #FFCCBC 100%);
  color: #E85A70;
}

.numpad-btn-delete:hover:not(:disabled) {
  background: linear-gradient(180deg, #FFE4D6 0%, #FFAB91 100%);
}

/* 确认按钮 - 薄荷绿 */
.numpad-btn-confirm {
  background: linear-gradient(180deg, #98FF98 0%, #6BCB77 100%);
  color: white;
}

.numpad-btn-confirm:hover:not(:disabled) {
  background: linear-gradient(180deg, #B8FFB8 0%, #81C784 100%);
}

.numpad-btn-confirm-disabled {
  background: linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%) !important;
  color: #BDBDBD !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow:
    2px 2px 5px rgba(0, 0, 0, 0.05),
    -1px -1px 4px rgba(255, 255, 255, 1),
    inset -1px -1px 4px rgba(0, 0, 0, 0.05),
    inset 1px 1px 4px rgba(255, 255, 255, 0.8) !important;
  animation: none !important;
}

@keyframes jellyClay {
  0%, 100% { transform: scale(0.92, 0.92); }
  25% { transform: scale(0.88, 0.96); }
  50% { transform: scale(0.96, 0.88); }
  75% { transform: scale(0.9, 0.94); }
}

/* 响应式调整 */
@media (min-width: 768px) {
  .numpad-btn-candy {
    min-height: 80px;
    min-width: 80px;
    border-radius: 24px;
  }
}
</style>
