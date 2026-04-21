<script setup>
import { computed } from 'vue'

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

const isSplitStage = computed(() => (
  props.difficulty?.stage === 'gapWithinFive' ||
  props.difficulty?.stage === 'splitWithinFive' ||
  props.difficulty?.stage === 'gapWithinTen' ||
  props.difficulty?.stage === 'splitWithinTen'
))

const target = computed(() => props.question?.result || props.question?.answer || 0)
const missingPart = computed(() => props.question?.missingPart || 'answer')
const knownPart = computed(() => {
  if (missingPart.value === 'operand1') return props.question.operand2
  if (missingPart.value === 'operand2') return props.question.operand1
  return 0
})

const missingCount = computed(() => Math.max(target.value - knownPart.value, 0))
const shouldShow = computed(() => (
  props.enabled &&
  isSplitStage.value &&
  props.question?.operator === '+' &&
  missingPart.value !== 'answer' &&
  target.value >= 2 &&
  target.value <= 10 &&
  knownPart.value > 0 &&
  missingCount.value > 0
))

const slots = computed(() => {
  const items = []

  for (let index = 0; index < target.value; index += 1) {
    items.push({
      id: index,
      state: index < knownPart.value ? 'known' : 'missing'
    })
  }

  return items
})

const columnCount = computed(() => target.value)
</script>

<template>
  <div
    v-if="shouldShow"
    class="number-bond-hint"
    :style="{ '--slot-columns': columnCount }"
    aria-label="数字组合提示"
  >
    <div class="slot-row" aria-hidden="true">
      <span
        v-for="slot in slots"
        :key="slot.id"
        class="slot"
        :class="`is-${slot.state}`"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.number-bond-hint {
  width: fit-content;
  max-width: min(100%, 420px);
  margin: 12px auto 0;
  padding: 9px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(92, 157, 255, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}

.slot-row {
  display: grid;
  grid-template-columns: repeat(var(--slot-columns), 24px);
  grid-auto-rows: 24px;
  gap: 7px;
  padding: 6px;
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

.slot.is-known {
  background: linear-gradient(180deg, var(--brand-primary-light), var(--brand-primary));
  border-color: var(--brand-primary);
  box-shadow: 0 4px 10px rgba(92, 157, 255, 0.24);
}

.slot.is-missing {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(92, 157, 255, 0.26);
}

@media (max-width: 420px) {
  .number-bond-hint {
    padding: 8px;
  }

  .slot-row {
    grid-template-columns: repeat(var(--slot-columns), 21px);
    grid-auto-rows: 21px;
    gap: 5px;
  }

  .slot {
    width: 21px;
    height: 21px;
  }
}
</style>
