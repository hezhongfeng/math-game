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
  
  // 禁止首位输入 0
  if (inputNumber.value === '' && num === 0) return
  
  if (inputNumber.value.length < 3) {
    const nextVal = inputNumber.value + num
    if (parseInt(nextVal, 10) > 100) {
      errorMsg.value = '最大支持 100 哦'
      return
    }
    inputNumber.value = nextVal
  }
}

// 处理删除
function handleDelete() {
  playClick()
  inputNumber.value = inputNumber.value.slice(0, -1)
  errorMsg.value = ''
}

// 处理提交
function handleSubmit() {
  const num = parseInt(inputNumber.value, 10)
  
  if (!num || num < 1) {
    playClick()
    errorMsg.value = '请输入数字'
    return
  }
  
  playSubmit()
  isTransitioning.value = true
  setTimeout(() => {
    currentCount.value = num
    showResult.value = true
    isTransitioning.value = false
  }, 400)
}

// 返回重新输入
function goBack() {
  playClick()
  showResult.value = false
  inputNumber.value = ''
  currentCount.value = 0
  errorMsg.value = ''
}

// 返回首页
function goHome() {
  playClick()
  router.push('/')
}
</script>

<template>
  <div class="explore-page">
    <!-- 顶部导航 -->
    <header class="top-nav">
      <button class="nav-btn" @click="goHome" aria-label="返回首页">
        <ArrowLeft :size="24" stroke-width="2.5" />
      </button>
      <h1 class="page-title">数字探索</h1>
      <div class="nav-placeholder"></div>
    </header>

    <!-- 输入视图 -->
    <main v-if="!showResult" class="input-view animate-fade-in">
      <!-- 数字显示区 -->
      <div class="number-display">
        <div class="display-card-wrapper">
          <div class="display-card float-anim">
            <span class="display-number font-number" :class="{ 'is-empty': !inputNumber }">
              {{ inputNumber || '0' }}
            </span>
            <span class="display-unit">个小球</span>
          </div>
          <div class="card-shadow"></div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div class="error-container">
        <transition name="error-pop">
          <div v-if="errorMsg" class="error-toast">{{ errorMsg }}</div>
        </transition>
      </div>

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
    <main v-else class="result-view animate-pop">
      <!-- 数字徽章 -->
      <div class="count-header">
        <div class="count-badge">
          <span class="badge-number font-number">{{ currentCount }}</span>
          <span class="badge-label">个小球</span>
        </div>
      </div>

      <!-- 小球展示区 -->
      <div class="ball-area">
        <BallArray :count="currentCount" />
      </div>

      <!-- 底部操作 -->
      <div class="action-bar">
        <button class="btn-primary btn-retry" @click="goBack">
          <span>换个数字</span>
        </button>
      </div>
    </main>

    <!-- 魔法过渡遮罩 -->
    <transition name="fade">
      <div v-if="isTransitioning" class="magic-overlay">
        <div class="magic-content">
          <div class="sparkles">
            <span>✨</span><span>⭐</span><span>✨</span>
          </div>
          <div class="magic-text">正在变出小球...</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.explore-page {
  min-height: 100dvh;
  background: 
    radial-gradient(circle at top left, var(--brand-primary-glow), transparent 40%),
    radial-gradient(circle at bottom right, var(--brand-success-glow), transparent 35%),
    linear-gradient(180deg, var(--bg-light) 0%, var(--bg-dark) 100%);
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
  padding: 12px 20px;
  background: var(--bg-panel);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
  z-index: 10;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: var(--brand-primary-soft);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}

.nav-btn:active {
  transform: scale(0.9);
  background: var(--brand-primary-light);
  color: white;
}

.page-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.nav-placeholder {
  width: 44px;
}

/* ========== 输入视图 ========== */
.input-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.number-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
}

.display-card-wrapper {
  position: relative;
  perspective: 1000px;
}

.display-card {
  text-align: center;
  padding: 40px 60px;
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--brand-primary-soft);
  min-width: 240px;
  position: relative;
  z-index: 2;
}

.card-shadow {
  position: absolute;
  bottom: -15px;
  left: 10%;
  right: 10%;
  height: 20px;
  background: var(--brand-primary-glow);
  filter: blur(15px);
  border-radius: 50%;
  z-index: 1;
}

.display-number {
  display: block;
  font-size: 110px;
  font-weight: 900;
  color: var(--brand-primary);
  line-height: 1;
  transition: all 0.3s var(--ease-standard);
  text-shadow: 0 8px 16px var(--brand-primary-glow);
}

.display-number.is-empty {
  color: var(--text-muted);
  opacity: 0.3;
}

.display-unit {
  display: block;
  font-size: 18px;
  color: var(--text-secondary);
  margin-top: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

/* 错误提示 */
.error-container {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.error-toast {
  padding: 8px 20px;
  background: var(--brand-alert-soft);
  color: var(--brand-alert);
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 700;
  border: 1px solid var(--brand-alert-light);
  box-shadow: var(--shadow-sm);
}

.error-pop-enter-active {
  animation: error-pop-in 0.4s var(--ease-standard);
}
.error-pop-leave-active {
  animation: error-pop-in 0.3s var(--ease-standard) reverse;
}

@keyframes error-pop-in {
  0% { opacity: 0; transform: scale(0.8) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* 键盘容器 */
.keypad-container {
  display: flex;
  justify-content: center;
  padding: 0 16px max(24px, env(safe-area-inset-bottom));
}

.keypad-container :deep(.number-pad) {
  width: 100%;
  max-width: 380px;
  background: var(--bg-panel-strong);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-panel);
}

/* ========== 展示视图 ========== */
.result-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.count-header {
  padding: 20px 16px;
  background: var(--bg-panel);
  text-align: center;
  border-bottom: 1px solid var(--border-light);
}

.count-badge {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.badge-number {
  font-size: 48px;
  font-weight: 900;
  color: var(--brand-primary);
  text-shadow: 0 4px 12px var(--brand-primary-glow);
}

.badge-label {
  font-size: 18px;
  color: var(--text-secondary);
  font-weight: 700;
}

.count-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 4px;
  font-weight: 600;
}

.ball-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.action-bar {
  padding: 20px 24px max(24px, env(safe-area-inset-bottom));
  background: var(--bg-panel-strong);
  display: flex;
  justify-content: center;
}

.btn-retry {
  width: 100%;
  max-width: 280px;
  gap: 12px;
}

/* ========== 魔法过渡 ========== */
.magic-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.magic-content {
  text-align: center;
}

.sparkles {
  font-size: 40px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.sparkles span {
  animation: float-anim 1.5s infinite ease-in-out;
}

.sparkles span:nth-child(2) { animation-delay: 0.2s; }
.sparkles span:nth-child(3) { animation-delay: 0.4s; }

.magic-text {
  font-size: 20px;
  font-weight: 800;
  color: var(--brand-primary);
  letter-spacing: 0.05em;
}

/* ========== 动画 ========== */
.float-anim {
  animation: float-anim 3s infinite ease-in-out;
}

@keyframes float-anim {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ========== 平板适配 ========== */
@media (min-width: 768px) {
  .display-number { font-size: 140px; }
  .badge-number { font-size: 64px; }
  .keypad-container :deep(.number-pad) { max-width: 420px; }
}
</style>
