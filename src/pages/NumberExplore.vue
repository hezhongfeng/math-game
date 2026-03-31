<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, RotateCcw } from 'lucide-vue-next'
import NumberPad from '../components/NumberPad.vue'
import BallArray from '../components/BallArray.vue'
import { useSound } from '../composables/useSound'

const router = useRouter()
const { playClick, playSubmit } = useSound()

// 状态
const inputNumber = ref('')
const currentCount = ref(0)
const showResult = ref(false)
const errorMsg = ref('')
const isTransitioning = ref(false)

// 处理数字输入
function handleInput(num) {
  playClick()
  errorMsg.value = ''
  if (inputNumber.value.length < 4) {
    inputNumber.value += num
  }
}

// 处理删除
function handleDelete() {
  playClick()
  inputNumber.value = inputNumber.value.slice(0, -1)
}

// 处理提交
function handleSubmit() {
  playSubmit()
  const num = parseInt(inputNumber.value, 10)
  
  if (!num || num < 1) {
    errorMsg.value = '请输入大于0的数字'
    return
  }
  if (num > 1000) {
    errorMsg.value = '最大支持1000个哦'
    return
  }
  
  isTransitioning.value = true
  setTimeout(() => {
    currentCount.value = num
    showResult.value = true
    isTransitioning.value = false
  }, 300)
}

// 返回重新输入
function goBack() {
  showResult.value = false
  inputNumber.value = ''
  currentCount.value = 0
  errorMsg.value = ''
}

// 返回首页
function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="explore-page">
    <!-- 顶部导航 -->
    <header class="top-nav">
      <button class="nav-btn" @click="goHome" aria-label="返回首页">
        <ArrowLeft :size="22" />
      </button>
      <h1 class="page-title">数字探索</h1>
      <div class="nav-placeholder"></div>
    </header>

    <!-- 输入视图 -->
    <main v-if="!showResult" class="input-view">
      <!-- 数字显示区 -->
      <div class="number-display">
        <div class="display-card">
          <span class="display-number" :class="{ 'is-empty': !inputNumber }">
            {{ inputNumber || '—' }}
          </span>
          <span class="display-unit">个小球</span>
        </div>
      </div>

      <!-- 错误提示 -->
      <transition name="error">
        <div v-if="errorMsg" class="error-toast">{{ errorMsg }}</div>
      </transition>

      <!-- 数字键盘 -->
      <div class="keypad-container">
        <NumberPad 
          @input="handleInput" 
          @delete="handleDelete" 
          @submit="handleSubmit" 
        />
      </div>
    </main>

    <!-- 展示视图 -->
    <main v-else class="result-view">
      <!-- 数字徽章 -->
      <div class="count-badge">
        <span class="badge-number">{{ currentCount }}</span>
        <span class="badge-label">个小球</span>
      </div>

      <!-- 小球展示区 -->
      <div class="ball-area">
        <BallArray :count="currentCount" />
      </div>

      <!-- 底部操作 -->
      <div class="action-bar">
        <button class="action-btn btn-retry" @click="goBack">
          <RotateCcw :size="20" />
          <span>再试一次</span>
        </button>
      </div>
    </main>

    <!-- 过渡遮罩 -->
    <div v-if="isTransitioning" class="transition-overlay">
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explore-page {
  min-height: 100dvh;
  background: linear-gradient(180deg, #f0f7ff 0%, #e8f0ff 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* ========== 顶部导航 ========== */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 102, 255, 0.08);
  flex-shrink: 0;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 102, 255, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--hero-blue);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: background 0.15s ease;
}

.nav-btn:active {
  background: rgba(0, 102, 255, 0.16);
}

.page-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.01em;
}

.nav-placeholder {
  width: 40px;
}

/* ========== 输入视图 ========== */
.input-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 数字显示区 - 占据剩余空间，居中显示 */
.number-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  min-height: 0;
}

.display-card {
  text-align: center;
  padding: 24px 48px;
  background: white;
  border-radius: 28px;
  box-shadow: 0 8px 40px rgba(0, 102, 255, 0.1);
  border: 1px solid rgba(0, 102, 255, 0.06);
  min-width: 200px;
}

.display-number {
  display: block;
  font-size: 88px;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color 0.2s ease;
  letter-spacing: -0.02em;
}

.display-number.is-empty {
  color: #c0c8d4;
}

.display-unit {
  display: block;
  font-size: 15px;
  color: var(--text-secondary);
  margin-top: 6px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

/* 错误提示 */
.error-toast {
  margin: 0 24px 8px;
  padding: 10px 16px;
  background: #FFF0F0;
  color: #D32F2F;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  flex-shrink: 0;
}

.error-enter-active,
.error-leave-active {
  transition: all 0.2s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 键盘容器 - 居中并缩小 */
.keypad-container {
  display: flex;
  justify-content: center;
  padding: 0 16px max(12px, env(safe-area-inset-bottom));
  flex-shrink: 0;
}

.keypad-container :deep(.number-pad) {
  width: 260px;
  padding: 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 102, 255, 0.06);
}

.keypad-container :deep(.pad-grid) {
  gap: 8px;
}

.keypad-container :deep(.num-btn) {
  min-width: auto;
  min-height: 52px;
  font-size: 30px;
  border-radius: 12px;
}

.keypad-container :deep(.num-btn svg) {
  width: 26px;
  height: 26px;
}

/* ========== 展示视图 ========== */
.result-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.count-badge {
  text-align: center;
  padding: 8px 16px;
  flex-shrink: 0;
}

.badge-number {
  font-size: 36px;
  font-weight: 900;
  color: var(--hero-blue);
  font-variant-numeric: tabular-nums;
}

.badge-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
  margin-left: 4px;
}

.ball-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0;
}

.action-bar {
  display: flex;
  justify-content: center;
  padding: 12px 16px max(16px, env(safe-area-inset-bottom));
  flex-shrink: 0;
}

.action-btn {
  height: 48px;
  padding: 0 28px;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: transform 0.15s ease;
}

.action-btn:active {
  transform: scale(0.96);
}

.btn-retry {
  background: var(--hero-blue);
  color: white;
  box-shadow: 0 4px 16px rgba(0, 102, 255, 0.25);
}

/* ========== 过渡遮罩 ========== */
.transition-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hero-blue);
  animation: dot-bounce 1.2s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ========== 平板适配 ========== */
@media (min-width: 768px) {
  .top-nav {
    padding: 16px 24px;
  }

  .display-number {
    font-size: 100px;
  }

  .badge-number {
    font-size: 48px;
  }

  .keypad-container :deep(.number-pad) {
    width: 280px;
  }

  .keypad-container :deep(.num-btn) {
    min-height: 56px;
    font-size: 32px;
  }
}
</style>
