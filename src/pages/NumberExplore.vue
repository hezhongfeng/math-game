<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, RotateCcw } from 'lucide-vue-next'
import NumberPad from '../components/NumberPad.vue'
import BallArray from '../components/BallArray.vue'
import { useSound } from '../composables/useSound'

const router = useRouter()
const { playClick, playSubmit } = useSound()

const inputNumber = ref('')
const currentCount = ref(0)
const showResult = ref(false)
const isShaking = ref(false)

function pulseNumber() {
  isShaking.value = true
  window.setTimeout(() => {
    isShaking.value = false
  }, 280)
}

function handleInput(num) {
  playClick()

  if (inputNumber.value === '' && num === 0) return

  const nextValue = `${inputNumber.value}${num}`
  const parsed = Number.parseInt(nextValue, 10)

  if (Number.isNaN(parsed) || parsed > 1000) {
    pulseNumber()
    return
  }

  inputNumber.value = nextValue
}

function handleDelete() {
  playClick()
  inputNumber.value = inputNumber.value.slice(0, -1)
}

function handleSubmit() {
  const num = Number.parseInt(inputNumber.value, 10)

  if (Number.isNaN(num) || num < 1 || num > 1000) {
    playClick()
    pulseNumber()
    return
  }

  playSubmit()
  currentCount.value = num
  showResult.value = true
}

function resetExplore() {
  playClick()
  inputNumber.value = ''
  currentCount.value = 0
  showResult.value = false
  isShaking.value = false
}

function goHome() {
  playClick()
  router.push('/')
}
</script>

<template>
  <div class="explore-page">
    <template v-if="!showResult">
      <header class="top-bar">
        <button class="back-btn" aria-label="返回首页" @click="goHome">
          <ArrowLeft :size="22" stroke-width="2.8" />
        </button>
      </header>

      <main class="input-screen">
        <section class="number-stage" :class="{ 'is-shaking': isShaking }">
          <div class="number-card">
            <div class="number-card-top">
              <div class="counter-badge">数一数</div>
            </div>
            <div class="number-display font-number">
              <div class="big-number" :class="{ 'is-empty': !inputNumber }">
                {{ inputNumber || '?' }}
              </div>
            </div>
          </div>
        </section>

        <section class="pad-stage">
          <NumberPad @input="handleInput" @delete="handleDelete" @submit="handleSubmit" />
        </section>
      </main>
    </template>

    <main v-else class="result-screen">
      <section class="result-number-shell">
        <div class="big-number font-number">{{ currentCount }}</div>
      </section>

      <section class="result-ball-shell">
        <BallArray :count="currentCount" />
      </section>

      <button class="play-again-btn" @click="resetExplore">
        <RotateCcw :size="20" />
        <span>再来一次</span>
      </button>
    </main>
  </div>
</template>

<style scoped>
.explore-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-top: env(safe-area-inset-top);
  padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
  background: #fff;
  overflow: hidden;
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px 4px;
}

.back-btn {
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12px 28px rgba(49, 120, 246, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: transform var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard);
}

.back-btn:active,
.play-again-btn:active {
  transform: scale(0.95);
}

.input-screen,
.result-screen {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 8px 14px 0;
}

.input-screen {
  gap: 14px;
}

.result-screen {
  gap: 10px;
  padding-inline: 6px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.number-stage,
.result-number-shell,
.result-ball-shell,
.play-again-btn {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 18px 36px rgba(58, 87, 152, 0.08);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.number-stage,
.result-number-shell {
  overflow: hidden;
  border-radius: 34px;
}

.number-stage {
  padding: 10px 16px;
  background: var(--bg-panel-strong);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-lg);
}

.number-card-top,
.number-display {
  display: flex;
  align-items: center;
}

.number-card-top {
  justify-content: flex-start;
  margin-bottom: 10px;
}

.counter-badge {
  padding: 8px 12px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  font-weight: 800;
}

.number-display {
  justify-content: center;
  min-height: 112px;
}

.big-number {
  position: relative;
  z-index: 1;
  font-weight: 800;

  min-width: clamp(88px, 24vw, 132px);
  padding: 12px 14px;
  border-radius: var(--radius-lg);
  border: 2px solid #DCE7FA;
  background: #F7FAFF;
  color: var(--text-primary);
  line-height: 1;
  font-size: clamp(48px, 14vw, 76px);
  text-align: center;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
  transition: transform var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}


.big-number.is-empty {
  color: var(--text-muted);
}

.number-stage.is-shaking .big-number {
  border-color: rgba(255, 107, 107, 0.4);
  animation: toy-shake 0.28s ease;
}

.pad-stage :deep(.number-pad) {
  width: 100%;
}

.number-stage :deep(.number-pad),
.pad-stage :deep(.number-pad) {
  border-radius: 28px;
}

.pad-stage :deep(.btn-delete) {
  color: var(--candy-peach-dark);
}

.pad-stage :deep(.btn-submit) {
  color: white;
}

@media (max-width: 420px) {
  .number-stage {
    padding: 10px 14px;
  }

  .number-card-top {
    margin-bottom: 8px;
  }

  .number-display {
    min-height: 96px;
  }

  .big-number {
    min-width: 72px;
    padding: 10px 10px;
  }
}

@media (max-width: 360px) {
  .counter-badge {
    padding: 8px 10px;
    font-size: 12px;
  }

  .number-display {
    min-height: 92px;
  }

  .big-number {
    font-size: 42px;
  }
}

@media (max-width: 959px) and (max-height: 860px) {
  .number-stage {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .number-display {
    min-height: 88px;
  }
}

@media (min-width: 768px) {
  .number-stage {
    padding: 12px 18px;
  }
}

.number-stage.is-shaking {
  animation: none;
}

.number-card {
  width: 100%;
}

.result-number-shell {
  padding: 18px 18px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-ball-shell {
  width: 100%;
  max-width: calc(100dvh - 280px); /* 留出顶部数字和底部按钮的空间 */
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border-radius: 34px;
  padding: 4px;
  overflow: hidden;
}

.play-again-btn {
  width: 100%;
  min-height: 64px;
  border-radius: 24px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  background: var(--brand-primary);
  border-color: rgba(92, 157, 255, 0.22);
  box-shadow: 0 12px 28px rgba(92, 157, 255, 0.22);
}

</style>
