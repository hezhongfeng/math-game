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
    <div class="pad-shell">
      <div class="pad-grid">
        <button
          v-for="num in numbers"
          :key="num"
          :data-testid="`num-btn-${num}`"
          class="num-btn font-number"
          :disabled="disabled"
          @click="handleInput(num)"
        >
          {{ num }}
        </button>

        <button
          data-testid="num-btn-delete"
          class="num-btn btn-delete"
          :disabled="disabled"
          aria-label="删除"
          @click="handleDelete"
        >
          <X :size="34" stroke-width="2.5" />
        </button>

        <button data-testid="num-btn-0" class="num-btn font-number" :disabled="disabled" @click="handleInput(0)">
          0
        </button>

        <button
          data-testid="num-btn-submit"
          class="num-btn btn-submit"
          :disabled="disabled"
          aria-label="提交"
          @click="handleSubmit"
        >
          <Check :size="36" stroke-width="3" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.number-pad {
  padding: 12px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(244, 248, 255, 0.92) 100%);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 18px 32px rgba(58, 87, 152, 0.08);
}

.number-pad.is-disabled {
  opacity: 0.7;
}

.pad-shell {
  padding: 6px;
  border-radius: 24px;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.9), rgba(246, 249, 255, 0.82)),
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(241, 246, 255, 0.8));
  border: 1px solid rgba(49, 120, 246, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.pad-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.num-btn {
  position: relative;
  min-width: 64px;
  min-height: 64px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(49, 120, 246, 0.08);
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(245, 248, 255, 0.94) 100%);
  color: var(--text-primary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.96), 0 10px 18px rgba(49, 120, 246, 0.08);
  font-size: 38px;
  font-weight: 900;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}

.num-btn::before {
  content: '';
  position: absolute;
  inset: 8px 10px auto;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  opacity: 0.95;
}

.num-btn::after {
  content: '';
  position: absolute;
  inset: auto 12px 9px;
  height: 8px;
  border-radius: 999px;
  background: rgba(73, 124, 217, 0.06);
  filter: blur(4px);
}

.num-btn svg {
  width: 32px;
  height: 32px;
}

.num-btn:active:not(:disabled) {
  transform: scale(0.95) translateY(1px);
  background: #eef4ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82), 0 6px 12px rgba(49, 120, 246, 0.08);
}

@media (hover: hover) {
  .num-btn:hover:not(:disabled) {
    border-color: rgba(49, 120, 246, 0.18);
    background: #f6f9ff;
  }

  .btn-delete:hover:not(:disabled) {
    background: #fff4e6;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 12px 20px rgba(49, 120, 246, 0.2);
  }
}

.btn-delete {
  color: var(--candy-peach-dark);
  background: linear-gradient(180deg, #fff7ef 0%, #ffefe0 100%);
}

.btn-submit {
  color: white;
  background: linear-gradient(180deg, #6ca8ff 0%, #4b86f3 100%);
  border-color: rgba(49, 120, 246, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 10px 16px rgba(49, 120, 246, 0.18);
}

@media (min-width: 768px) {
  .number-pad {
    padding: 18px;
  }

  .pad-shell {
    padding: 8px;
    border-radius: 26px;
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
    border-radius: 24px;
  }

  .pad-shell {
    padding: 5px;
    border-radius: 20px;
  }

  .pad-grid {
    gap: 8px;
  }

  .num-btn {
    font-size: 34px;
    border-radius: 18px;
  }

  .num-btn svg {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 959px) and (max-height: 860px) {
  .number-pad {
    padding: 8px;
    border-radius: 22px;
  }

  .pad-shell {
    padding: 4px;
    border-radius: 18px;
  }

  .pad-grid {
    gap: 8px;
  }

  .num-btn {
    font-size: 32px;
    border-radius: 16px;
  }

  .num-btn svg {
    width: 28px;
    height: 28px;
  }
}
</style>
