<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, RotateCcw } from 'lucide-vue-next'
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

// 计算属性：当前输入是否有效
const isValidInput = computed(() => {
  const num = parseInt(inputNumber.value, 10)
  return num >= 1 && num <= 1000
})

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

// 处理删除
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

// 键盘布局
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
      <div class="keypad">
        <div class="keypad-grid">
          <button
            v-for="num in numbers"
            :key="num"
            class="key-btn"
            @click="handleInput(num)"
          >
            {{ num }}
          </button>
          <button class="key-btn key-delete" @click="handleDelete" aria-label="删除">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
              <line x1="18" y1="9" x2="12" y2="15"/>
              <line x1="12" y1="9" x2="18" y2="15"/>
            </svg>
          </button>
          <button class="key-btn" @click="handleInput(0)">0</button>
          <button
            class="key-btn key-submit"
            :class="{ 'is-valid': isValidInput }"
            @click="handleSubmit"
            aria-label="确认"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
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

/* 数字显示区 */
.number-display {
  display: flex;
  justify-content: center;
  padding: 12px 16px 4px;
  flex-shrink: 0;
}

.display-card {
  text-align: center;
  padding: 12px 28px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 102, 255, 0.08);
  border: 1px solid rgba(0, 102, 255, 0.06);
  min-width: 160px;
}

.display-number {
  display: block;
  font-size: 56px;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color 0.2s ease;
}

.display-number.is-empty {
  color: #c0c8d4;
}

.display-unit {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
  font-weight: 600;
}

/* 错误提示 */
.error-toast {
  margin: 0 24px 4px;
  padding: 8px 16px;
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

/* 数字键盘 */
.keypad {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 12px max(8px, env(safe-area-inset-bottom));
  margin-top: 8px;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 360px;
  margin: 0 auto;
  width: 100%;
}

.key-btn {
  height: 52px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  background: white;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: all 0.1s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.key-btn:active {
  transform: scale(0.95);
  background: #f0f4ff;
}

.key-delete {
  color: var(--warning-orange);
  background: rgba(255, 107, 53, 0.06);
  border-color: rgba(255, 107, 53, 0.15);
}

.key-delete:active {
  background: rgba(255, 107, 53, 0.15);
}

.key-submit {
  color: white;
  background: var(--hero-blue);
  border-color: var(--hero-blue);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.25);
}

.key-submit:active {
  transform: scale(0.95);
  background: var(--hero-blue-dark);
}

.key-submit:not(.is-valid) {
  opacity: 0.4;
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
    font-size: 80px;
  }

  .keypad-grid {
    max-width: 320px;
    gap: 12px;
  }

  .key-btn {
    height: 64px;
    font-size: 28px;
  }

  .badge-number {
    font-size: 48px;
  }
}
</style>
