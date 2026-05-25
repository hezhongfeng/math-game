<script setup>
import { Check, X } from 'lucide-vue-next'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'normal',
    validator: (v) => ['normal', 'compact'].includes(v)
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
  <div class="number-pad" :class="{ 'is-disabled': disabled, 'number-pad--compact': size === 'compact' }">
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
</template>

<style scoped>
.number-pad {
  padding: 18px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(246, 250, 255, 0.96) 0%, rgba(235, 242, 255, 0.98) 100%);
  border: 1px solid rgba(92, 157, 255, 0.14);
  box-shadow: 0 14px 28px rgba(39, 87, 166, 0.08);
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
  position: relative;
  min-width: 64px;
  min-height: 64px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(92, 157, 255, 0.14);
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f3f8ff 100%);
  color: #204274;
  box-shadow: 0 8px 16px rgba(50, 95, 173, 0.08);
  font-size: 38px;
  font-weight: 900;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}

.num-btn::after {
  content: '';
  position: absolute;
  inset: auto 16px 10px;
  height: 6px;
  border-radius: 999px;
  background: rgba(92, 157, 255, 0.08);
  filter: blur(6px);
}

.num-btn svg {
  width: 32px;
  height: 32px;
}

.num-btn:active:not(:disabled) {
  transform: scale(0.95) translateY(1px);
  background: #edf4ff;
  box-shadow: 0 4px 10px rgba(50, 95, 173, 0.08);
}

.num-btn:focus-visible {
  outline: none;
  border-color: rgba(92, 157, 255, 0.32);
  box-shadow: 0 0 0 4px rgba(92, 157, 255, 0.14);
}

@media (hover: hover) {
  .num-btn:hover:not(:disabled) {
    border-color: rgba(92, 157, 255, 0.26);
    background: #f7fbff;
    box-shadow: 0 12px 20px rgba(50, 95, 173, 0.1);
  }

  .btn-delete:hover:not(:disabled) {
    background: #fff1e6;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 14px 24px rgba(39, 128, 96, 0.18);
  }
}

.btn-delete {
  color: #c96c22;
  background: linear-gradient(180deg, #fff8f0 0%, #fff0df 100%);
  border-color: rgba(255, 159, 67, 0.2);
}

.btn-submit {
  color: white;
  background: linear-gradient(180deg, #62c98a 0%, #4aac70 100%);
  border-color: rgba(74, 172, 112, 0.28);
  box-shadow: 0 10px 18px rgba(74, 172, 112, 0.18);
}

.btn-submit::after {
  background: rgba(255, 255, 255, 0.14);
}

.num-btn:disabled {
  cursor: default;
  opacity: 0.6;
  box-shadow: none;
}

.number-pad--compact {
  width: 100%;
  padding: 9px;
  border-radius: 18px;
}

.number-pad--compact .pad-grid {
  gap: 6px;
}

.number-pad--compact .num-btn {
  min-width: 50px;
  min-height: 50px;
  border-radius: 14px;
  font-size: 27px;
}

.number-pad--compact .num-btn svg {
  width: 23px;
  height: 23px;
}

.number-pad--compact .btn-delete {
  color: var(--candy-peach-dark);
}

.number-pad--compact .btn-submit {
  color: white;
}

.number-pad--compact .num-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(92, 157, 255, 0.16);
}

@media (min-width: 768px) {
  .number-pad {
    padding: 26px;
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
    padding: 15px;
    border-radius: 24px;
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

  .number-pad--compact {
    padding: 7px;
  }

  .number-pad--compact .pad-grid {
    gap: 5px;
  }

  .number-pad--compact .num-btn {
    min-width: 46px;
    min-height: 46px;
    font-size: 24px;
  }

  .number-pad--compact .num-btn svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 959px) and (max-height: 860px) {
  .number-pad {
    padding: 12px;
    border-radius: 22px;
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
