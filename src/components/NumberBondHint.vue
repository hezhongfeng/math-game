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
const frameCapacity = computed(() => {
  if (displayCount.value <= 5) return 5
  if (displayCount.value <= 10) return 10
  if (displayCount.value <= 20) return 20
  return displayCount.value
})
const frameType = computed(() => {
  if (strategy.value === 'split') return 'part-whole'
  if (frameCapacity.value === 5) return 'five-frame'
  if (frameCapacity.value === 10) return 'ten-frame'
  if (frameCapacity.value === 20) return 'double-ten-frame'
  return 'ball-grid'
})

const shouldShow = computed(() => (
  props.enabled &&
  strategy.value !== null &&
  displayCount.value > 0
))

const slots = computed(() => {
  const items = []

  for (let index = 0; index < frameCapacity.value; index += 1) {
    let state = 'empty'

    if (index >= displayCount.value) {
      items.push({ id: index, state })
      continue
    }

    if (strategy.value === 'split') {
      if (missingPart.value === 'operand1') {
        state = index < operand1.value ? 'missing' : 'known'
      } else {
        state = index < operand1.value ? 'known' : 'missing'
      }
    } else if (strategy.value === 'addition') {
      state = index < operand1.value ? 'addend-one' : 'addend-two'
    } else if (strategy.value === 'subtraction') {
      state = index < operand1.value - operand2.value ? 'remaining' : 'removed'
    }

    items.push({ id: index, state })
  }

  return items
})

const frames = computed(() => {
  if (frameCapacity.value <= 5) return [slots.value]

  const groups = []
  for (let start = 0; start < slots.value.length; start += 10) {
    groups.push(slots.value.slice(start, start + 10))
  }
  return groups
})

const partSegments = computed(() => {
  if (strategy.value !== 'split') return []

  const firstPartIsMissing = missingPart.value === 'operand1'
  return [
    {
      id: 'first',
      value: operand1.value,
      state: firstPartIsMissing ? 'missing' : 'known'
    },
    {
      id: 'second',
      value: operand2.value,
      state: firstPartIsMissing ? 'known' : 'missing'
    }
  ]
})

const ariaLabel = computed(() => {
  if (strategy.value === 'addition') return `小球辅助：${operand1.value} 个已有，加入 ${operand2.value} 个`
  if (strategy.value === 'subtraction') return `小球辅助：原有 ${operand1.value} 个，拿走 ${operand2.value} 个`
  return `整体和部分辅助：一共 ${result.value} 个，虚线部分是未知数`
})

const modelLabel = computed(() => {
  if (frameType.value === 'part-whole') return '整体和部分'
  if (frameType.value === 'five-frame') return '五格框'
  if (frameType.value === 'ten-frame') return '十格框'
  if (frameType.value === 'double-ten-frame') return '双十格框'
  return '数量格'
})

const operationLabel = computed(() => {
  if (strategy.value === 'addition') return `已有 ${operand1.value} · 加入 ${operand2.value}`
  if (strategy.value === 'subtraction') return `原有 ${operand1.value} · 拿走 ${operand2.value}`
  return `整体 ${result.value} · 虚线部分待补`
})
</script>

<template>
  <Transition name="hint-fade">
    <div
      v-if="shouldShow"
      class="number-bond-hint"
      :class="[`is-${strategy}`, `is-${frameType}`]"
      role="img"
      :aria-label="ariaLabel"
      data-testid="ball-hint"
    >
      <div class="hint-heading">
        <span class="model-label">{{ modelLabel }}</span>
        <span class="operation-label">{{ operationLabel }}</span>
      </div>
      <div v-if="strategy === 'split'" class="part-whole-model" aria-hidden="true">
        <div class="whole-bar">
          <span>整体</span>
          <strong>{{ result }}</strong>
        </div>
        <div class="part-connector"></div>
        <div class="part-row">
          <div
            v-for="part in partSegments"
            :key="part.id"
            class="part-block"
            :class="`is-${part.state}`"
            :style="{ '--part-size': Math.max(part.value, 1) }"
          >
            <span>{{ part.state === 'missing' ? '待补部分' : '已知部分' }}</span>
            <strong>{{ part.state === 'missing' ? '?' : part.value }}</strong>
          </div>
        </div>
        <p class="part-hint">虚线部分表示还不知道的数</p>
      </div>
      <div v-else class="frame-stack" aria-hidden="true">
        <div
          v-for="(frame, frameIndex) in frames"
          :key="`frame-${frameIndex}`"
          class="slot-frame"
          :class="{ 'is-five': frame.length <= 5 }"
        >
          <span
            v-for="slot in frame"
            :key="slot.id"
            class="slot"
            :class="`is-${slot.state}`"
          ></span>
        </div>
        <span
          v-if="overflowCount > 0"
          class="overflow-badge"
          aria-hidden="true"
        >
          +{{ overflowCount }}
        </span>
        <p v-if="strategy === 'subtraction'" class="subtraction-key">
          <span class="removed-swatch"></span>
          划线部分表示拿走
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.number-bond-hint {
  width: min(100%, 360px);
  max-height: 188px;
  margin: 10px auto 0;
  padding: 9px;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: rgba(248, 251, 255, 0.9);
  border: 1px solid rgba(92, 157, 255, 0.18);
  box-shadow: 0 5px 14px rgba(72, 116, 188, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.8);
}

.hint-heading {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 7px;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
}

.model-label {
  padding: 4px 7px;
  border-radius: var(--radius-full);
  background: rgba(92, 157, 255, 0.12);
  color: var(--brand-primary-dark);
  white-space: nowrap;
}

.operation-label {
  min-width: 0;
  text-align: right;
}

.frame-stack {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.slot-frame {
  display: grid;
  grid-template-columns: repeat(5, 25px);
  grid-template-rows: repeat(2, 25px);
  gap: 4px;
  padding: 5px;
  border-radius: var(--radius-md);
  background: rgba(224, 237, 255, 0.72);
  box-shadow: inset 0 0 0 1px rgba(92, 157, 255, 0.14);
}

.slot-frame.is-five {
  grid-template-rows: 25px;
}

.slot {
  position: relative;
  width: 25px;
  height: 25px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(92, 157, 255, 0.3);
  background: rgba(255, 255, 255, 0.74);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
}

.slot.is-empty {
  border-style: solid;
  opacity: 0.72;
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

.slot.is-removed {
  background: rgba(255, 231, 231, 0.88);
  border-color: rgba(255, 107, 107, 0.58);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.62);
}

.slot.is-missing {
  background: rgba(255, 255, 255, 0.76);
  border-color: rgba(92, 157, 255, 0.48);
  border-style: dashed;
  box-shadow: inset 0 0 0 3px rgba(235, 243, 255, 0.82);
}

.slot.is-removed::after {
  position: absolute;
  top: 10px;
  left: 2px;
  width: 25px;
  height: 3px;
  content: '';
  border-radius: var(--radius-full);
  background: var(--candy-red);
  box-shadow: 0 1px 0 rgba(177, 53, 53, 0.18);
  transform: rotate(-42deg);
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

.is-subtraction .model-label {
  background: rgba(255, 107, 107, 0.12);
  color: var(--candy-red-dark);
}

.is-split .model-label {
  background: rgba(245, 201, 74, 0.17);
  color: var(--candy-yellow-dark);
}

.part-whole-model {
  display: grid;
  gap: 6px;
  width: min(100%, 300px);
  margin: 0 auto;
}

.whole-bar {
  min-height: 34px;
  padding: 6px 11px;
  border: 1px solid rgba(245, 201, 74, 0.38);
  border-radius: var(--radius-md);
  background: rgba(255, 247, 212, 0.82);
  color: var(--candy-yellow-dark);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 800;
}

.whole-bar strong {
  font-size: 17px;
  line-height: 1;
}

.part-connector {
  width: 2px;
  height: 8px;
  margin: -2px auto;
  background: rgba(245, 201, 74, 0.6);
}

.part-row {
  display: flex;
  min-height: 54px;
  gap: 4px;
}

.part-block {
  flex: var(--part-size) 1 0;
  min-width: 0;
  padding: 7px 8px;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
}

.part-block strong {
  font-size: 19px;
  line-height: 1;
}

.part-block.is-known {
  border: 1px solid rgba(92, 157, 255, 0.36);
  background: rgba(224, 239, 255, 0.9);
  color: var(--brand-primary-dark);
}

.part-block.is-missing {
  border: 2px dashed rgba(92, 157, 255, 0.6);
  background: rgba(255, 255, 255, 0.74);
  color: var(--text-secondary);
}

.part-hint,
.subtraction-key {
  margin: 0;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
}

.subtraction-key {
  flex-basis: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.removed-swatch {
  position: relative;
  width: 15px;
  height: 15px;
  border: 1px solid rgba(255, 107, 107, 0.56);
  border-radius: var(--radius-full);
  background: rgba(255, 231, 231, 0.88);
}

.removed-swatch::after {
  position: absolute;
  top: 6px;
  left: -1px;
  width: 15px;
  height: 2px;
  content: '';
  border-radius: var(--radius-full);
  background: var(--candy-red);
  transform: rotate(-42deg);
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition:
    max-height var(--duration-normal) var(--ease-out),
    margin-top var(--duration-normal) var(--ease-out),
    padding-top var(--duration-normal) var(--ease-out),
    padding-bottom var(--duration-normal) var(--ease-out),
    opacity var(--duration-fast) var(--ease-out),
    transform var(--duration-normal) var(--ease-out);
}

.hint-fade-enter-from,
.hint-fade-leave-to {
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

@media (max-width: 420px) {
  .number-bond-hint {
    width: min(100%, 330px);
    padding: 8px;
  }

  .hint-heading {
    gap: 5px;
    font-size: 11px;
  }

  .slot-frame {
    grid-template-columns: repeat(5, 22px);
    grid-template-rows: repeat(2, 22px);
    gap: 4px;
    padding: 5px;
  }

  .slot-frame.is-five {
    grid-template-rows: 22px;
  }

  .slot {
    width: 22px;
    height: 22px;
  }

  .part-block {
    padding: 7px 5px;
    font-size: 10px;
  }

  .part-block strong {
    font-size: 18px;
  }

  .overflow-badge {
    min-width: 22px;
    height: 22px;
    font-size: 11px;
  }
}
</style>
