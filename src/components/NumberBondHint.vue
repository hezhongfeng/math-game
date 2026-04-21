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
  }
})

const isSplitStage = computed(() => (
  props.difficulty?.stage === 'splitWithinFive' ||
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
</script>

<template>
  <div v-if="shouldShow" class="number-bond-hint" aria-label="数字组合提示">
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
  width: min(100%, 420px);
  margin: 10px auto 0;
  padding: 10px 12px;
  border-radius: var(--radius-lg);
  background: rgba(247, 250, 255, 0.84);
  border: 1px solid rgba(49, 120, 246, 0.14);
}

.slot-row {
  display: flex;
  align-items: center;
}

.slot-row {
  justify-content: center;
  flex-wrap: wrap;
  gap: 7px;
}

.slot {
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(49, 120, 246, 0.38);
}

.slot.is-known {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(49, 120, 246, 0.1);
}

.slot.is-missing {
  background: rgba(255, 255, 255, 0.86);
  border-style: dashed;
}

@media (max-width: 420px) {
  .number-bond-hint {
    padding: 9px 10px;
  }

  .slot {
    width: 20px;
    height: 20px;
  }
}
</style>
