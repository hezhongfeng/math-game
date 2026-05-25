<script setup>
import { computed } from 'vue'

const MAX_BALL_COUNT = 30

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  difficulty: {
    type: Object,
    default: null
  },
  enabled: {
    type: Boolean,
    default: true
  }
})

const operand1 = computed(() => Number(props.question?.operand1) || 0)
const operand2 = computed(() => Number(props.question?.operand2) || 0)
const missingPart = computed(() => props.question?.missingPart || 'answer')
const result = computed(() => {
  if (typeof props.question?.result === 'number') return props.question.result
  if (typeof props.question?.answer === 'number') return props.question.answer
  return 0
})

const strategy = computed(() => {
  if (props.question?.operator === '+' && missingPart.value !== 'answer') {
    return 'split'
  }

  if (props.question?.operator === '+') {
    return 'addition'
  }

  if (props.question?.operator === '-') {
    return 'subtraction'
  }

  return null
})

const totalCount = computed(() => {
  if (strategy.value === 'split') return result.value
  if (strategy.value === 'addition') return operand1.value + operand2.value
  if (strategy.value === 'subtraction') return operand1.value
  return 0
})

const displayCount = computed(() => Math.min(Math.max(totalCount.value, 0), MAX_BALL_COUNT))
const overflowCount = computed(() => Math.max(totalCount.value - displayCount.value, 0))

const knownPart = computed(() => {
  if (missingPart.value === 'operand1') return operand2.value
  if (missingPart.value === 'operand2') return operand1.value
  return 0
})

const shouldShow = computed(() => (
  props.enabled &&
  strategy.value !== null &&
  displayCount.value > 0
))

const slots = computed(() => {
  const items = []

  for (let index = 0; index < displayCount.value; index += 1) {
    let state = 'known'

    if (strategy.value === 'split') {
      state = index < knownPart.value ? 'known' : 'missing'
    } else if (strategy.value === 'addition') {
      state = index < operand1.value ? 'addend-one' : 'addend-two'
    } else if (strategy.value === 'subtraction') {
      state = index < operand2.value ? 'removed' : 'remaining'
    }

    items.push({ id: index, state })
  }

  return items
})

const columnCount = computed(() => 10)
const ariaLabel = computed(() => {
  if (strategy.value === 'addition') return '小球辅助：两组小球合起来'
  if (strategy.value === 'subtraction') return '小球辅助：划掉拿走的小球'
  return '小球辅助：实心是已知，空心是未知'
})
</script>

<template>
  <Transition name="hint-fade">
    <div
      v-if="shouldShow"
      class="number-bond-hint"
      :class="`is-${strategy}`"
      :style="{ '--slot-columns': columnCount }"
      :aria-label="ariaLabel"
      data-testid="ball-hint"
    >
      <div class="slot-row" aria-hidden="true">
        <span
          v-for="slot in slots"
          :key="slot.id"
          class="slot"
          :class="`is-${slot.state}`"
        ></span>
        <span
          v-if="overflowCount > 0"
          class="overflow-badge"
          aria-hidden="true"
        >
          +{{ overflowCount }}
        </span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.number-bond-hint {
  width: fit-content;
  max-width: min(100%, 420px);
  margin: 8px auto 0;
  padding: 7px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(92, 157, 255, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}

.slot-row {
  display: grid;
  grid-template-columns: repeat(var(--slot-columns), 24px);
  grid-auto-rows: 24px;
  gap: 6px;
  padding: 5px;
  border-radius: 20px;
  background: rgba(235, 243, 255, 0.72);
}

.slot {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(92, 157, 255, 0.36);
  transition: transform var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}

.slot.is-known,
.slot.is-addend-one,
.slot.is-remaining {
  background: linear-gradient(180deg, var(--brand-primary-light), var(--brand-primary));
  border-color: var(--brand-primary);
  box-shadow: 0 4px 10px rgba(92, 157, 255, 0.24);
}

.slot.is-addend-two {
  background: linear-gradient(180deg, var(--candy-mint-light), var(--candy-mint));
  border-color: var(--candy-mint);
  box-shadow: 0 4px 10px rgba(107, 203, 119, 0.22);
}

.slot.is-missing,
.slot.is-removed {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(92, 157, 255, 0.26);
}

.slot.is-removed::after {
  position: absolute;
  top: 50%;
  left: 4px;
  right: 4px;
  height: 2px;
  content: '';
  border-radius: var(--radius-full);
  background: var(--candy-red);
  transform: rotate(-28deg);
  transform-origin: center;
}

.overflow-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  background: rgba(92, 157, 255, 0.1);
  border: 1px solid rgba(92, 157, 255, 0.18);
  color: var(--brand-primary-dark);
  font-size: 12px;
  font-weight: 800;
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 420px) {
  .number-bond-hint {
    padding: 6px;
  }

  .slot-row {
    grid-template-columns: repeat(var(--slot-columns), 21px);
    grid-auto-rows: 21px;
    gap: 4px;
  }

  .slot {
    width: 21px;
    height: 21px;
  }

  .overflow-badge {
    min-width: 21px;
    height: 21px;
    font-size: 11px;
  }
}
</style>
