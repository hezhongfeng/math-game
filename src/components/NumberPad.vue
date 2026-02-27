<script setup>
import { X, Check } from 'lucide-vue-next'
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
  <div class="number-pad" :class="{ 'is-disabled': disabled }">
    <div class="pad-grid">
      <button
        v-for="num in numbers"
        :key="num"
        @click="handleInput(num)"
        :disabled="disabled"
        class="num-btn"
      >
        {{ num }}
      </button>

      <button
        @click="handleDelete"
        :disabled="disabled"
        class="num-btn btn-delete"
      >
        <X :size="32" stroke-width="2.5" />
      </button>

      <button
        @click="handleInput(0)"
        :disabled="disabled"
        class="num-btn"
      >
        0
      </button>

      <button
        @click="handleSubmit"
        :disabled="disabled"
        class="num-btn btn-submit"
      >
        <Check :size="36" stroke-width="3" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  padding: 24px;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.number-pad.is-disabled {
  opacity: 0.6;
}

.pad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  justify-items: center;
}

.num-btn {
  width: 100%;
  aspect-ratio: 1;
  max-width: 88px;
  max-height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 42px;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
  transition: all 0.15s ease;
  cursor: pointer;
}

.num-btn:hover {
  border-color: var(--hero-blue);
  color: var(--hero-blue);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md), var(--glow-blue);
}

.num-btn:active {
  transform: scale(0.95);
  background: var(--hero-blue);
  color: white;
  border-color: var(--hero-blue);
}

/* 移动端优化：移除 hover 粘滞效果 */
@media (hover: none) {
  .num-btn:hover {
    border-color: var(--border-light);
    color: var(--text-primary);
    transform: none;
    box-shadow: var(--shadow-sm);
  }

  .btn-delete:hover {
    background: #FFF5F0;
    border-color: #FFE5DC;
    color: var(--warning-orange);
  }

  .btn-submit:hover {
    background: var(--win-green);
    border-color: var(--win-green);
    color: white;
  }
}

.num-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-delete {
  background: #FFF5F0;
  border-color: #FFE5DC;
  color: var(--warning-orange);
}

.btn-delete:hover {
  background: var(--warning-orange);
  color: white;
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
}

.btn-delete:active {
  transform: scale(0.95);
  background: var(--warning-orange-dark);
  border-color: var(--warning-orange-dark);
  color: white;
}

.btn-submit {
  background: var(--win-green);
  border-color: var(--win-green);
  color: white;
  box-shadow: 0 0 20px rgba(0, 208, 132, 0.3);
}

.btn-submit:hover {
  background: var(--win-green-dark);
  border-color: var(--win-green-dark);
  box-shadow: 0 0 30px rgba(0, 208, 132, 0.4);
}

.btn-submit:active {
  transform: scale(0.95);
  background: var(--win-green-dark);
  border-color: var(--win-green-dark);
}

@media (min-width: 768px) {
  .pad-grid {
    gap: 20px;
  }

  .num-btn {
    max-width: 100px;
    max-height: 100px;
    font-size: 48px;
  }
}

@media (max-width: 375px) {
  .number-pad {
    padding: 16px;
  }

  .pad-grid {
    gap: 12px;
  }

  .num-btn {
    max-width: 76px;
    max-height: 76px;
    font-size: 38px;
  }
}
</style>
