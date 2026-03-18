<script setup>
import { Check, X } from 'lucide-vue-next'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['input', 'delete', 'submit'])

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function handleInput(num) {
  if (props.disabled) return
  emit('input', num)
}

function handleDelete() {
  if (props.disabled) return
  emit('delete')
}

function handleSubmit() {
  if (props.disabled) return
  emit('submit')
}
</script>

<template>
  <div class="number-pad" :class="{ 'is-disabled': disabled }">
    <div class="pad-grid">
      <button
        v-for="num in numbers"
        :key="num"
        :data-testid="`num-btn-${num}`"
        class="num-btn"
        :disabled="disabled"
        @click="handleInput(num)"
      >
        {{ num }}
      </button>

      <button data-testid="num-btn-delete" class="num-btn btn-delete" :disabled="disabled" @click="handleDelete">
        <X :size="34" stroke-width="2.5" />
      </button>

      <button data-testid="num-btn-0" class="num-btn" :disabled="disabled" @click="handleInput(0)">
        0
      </button>

      <button data-testid="num-btn-submit" class="num-btn btn-submit" :disabled="disabled" @click="handleSubmit">
        <Check :size="36" stroke-width="3" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  padding: 14px;
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
  gap: 10px;
}

.num-btn {
  min-width: 64px;
  min-height: 64px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-light);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  font-size: 38px;
  font-weight: 800;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}

.num-btn svg {
  width: 32px;
  height: 32px;
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
    font-size: 46px;
  }
}

@media (max-width: 420px) {
  .number-pad {
    padding: 10px;
    border-radius: 20px;
  }

  .pad-grid {
    gap: 8px;
  }

  .num-btn {
    font-size: 34px;
    border-radius: 16px;
  }

  .num-btn svg {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 959px) and (max-height: 860px) {
  .number-pad {
    padding: 8px;
    border-radius: 18px;
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(12px);
  }

  .pad-grid {
    gap: 8px;
  }

  .num-btn {
    font-size: 32px;
    border-radius: 14px;
    box-shadow: none;
  }

  .btn-submit {
    box-shadow: var(--shadow-sm);
  }

  .num-btn svg {
    width: 28px;
    height: 28px;
  }
}
</style>
