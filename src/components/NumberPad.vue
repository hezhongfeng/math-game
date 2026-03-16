<script setup>
import { Check, X } from 'lucide-vue-next'
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
        class="num-btn"
        :disabled="disabled"
        @click="handleInput(num)"
      >
        {{ num }}
      </button>

      <button class="num-btn btn-delete" :disabled="disabled" @click="handleDelete">
        <X :size="28" stroke-width="2.5" />
      </button>

      <button class="num-btn" :disabled="disabled" @click="handleInput(0)">
        0
      </button>

      <button class="num-btn btn-submit" :disabled="disabled" @click="handleSubmit">
        <Check :size="30" stroke-width="3" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  padding: 16px;
  border-radius: var(--radius-xl);
  background: var(--bg-panel);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(16px);
}

.number-pad.is-disabled {
  opacity: 0.7;
}

.pad-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.num-btn {
  min-width: 64px;
  min-height: 64px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-light);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  font-size: 34px;
  font-weight: 800;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}

.num-btn:active:not(:disabled) {
  transform: scale(0.96);
  background: #eef4fb;
}

@media (hover: hover) {
  .num-btn:hover:not(:disabled) {
    border-color: var(--border-strong);
    background: #f8fbff;
  }

  .btn-delete:hover:not(:disabled) {
    background: #fff1e8;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg), var(--glow-green);
  }
}

.btn-delete {
  color: var(--warning-orange-dark);
  background: #fff6f1;
}

.btn-submit {
  color: white;
  background: linear-gradient(135deg, var(--win-green) 0%, var(--win-green-dark) 100%);
  border-color: transparent;
  box-shadow: var(--shadow-md), var(--glow-green);
}

@media (min-width: 768px) {
  .number-pad {
    padding: 18px;
  }

  .pad-grid {
    gap: 14px;
  }

  .num-btn {
    min-height: 78px;
    font-size: 38px;
  }
}
</style>
