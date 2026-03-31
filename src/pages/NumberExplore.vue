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
  
  currentCount.value = num
  showResult.value = true
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
      <button class="nav-btn" @click="goHome">
        <ArrowLeft :size="24" />
      </button>
      <h1 class="page-title">数字探索</h1>
      <div class="nav-placeholder"></div>
    </header>

    <!-- 输入视图 -->
    <main v-if="!showResult" class="input-view">
      <div class="input-display">
        <span class="display-number">{{ inputNumber || '?' }}</span>
        <span class="display-hint">输入数字，点击确认</span>
      </div>
      
      <div v-if="errorMsg" class="error-toast">{{ errorMsg }}</div>
      
      <NumberPad 
        @input="handleInput" 
        @delete="handleDelete" 
        @submit="handleSubmit" 
      />
    </main>

    <!-- 展示视图 -->
    <main v-else class="result-view">
      <div class="result-header">
        <span class="result-count">{{ currentCount }}</span>
      </div>
      
      <BallArray :count="currentCount" />
      
      <button class="back-btn" @click="goBack">
        <RotateCcw :size="20" />
        <span>再试一次</span>
      </button>
    </main>
  </div>
</template>

<style scoped>
.explore-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #f0f7ff 0%, #e4eeff 100%);
  display: flex;
  flex-direction: column;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0, 102, 255, 0.1);
}

.nav-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(0, 102, 255, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--hero-blue);
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-btn:active {
  background: rgba(0, 102, 255, 0.15);
}

.page-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
}

.nav-placeholder {
  width: 44px;
}

/* 输入视图 */
.input-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  gap: 24px;
}

.input-display {
  text-align: center;
}

.display-number {
  display: block;
  font-size: 72px;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  min-height: 80px;
}

.display-hint {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 8px;
}

.error-toast {
  padding: 12px 24px;
  background: #FFF0F0;
  color: #D32F2F;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

/* 展示视图 */
.result-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}

.result-header {
  margin-bottom: 16px;
}

.result-count {
  font-size: 48px;
  font-weight: 900;
  color: var(--hero-blue);
}

.back-btn {
  margin-top: 32px;
  padding: 16px 32px;
  background: var(--hero-blue);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 102, 255, 0.3);
  transition: transform 0.2s ease;
}

.back-btn:active {
  transform: scale(0.96);
}

/* 小屏幕适配 */
@media (max-width: 420px) {
  .display-number {
    font-size: 56px;
  }
  
  .result-count {
    font-size: 36px;
  }
  
  .top-nav {
    padding: 12px 16px;
  }
}
</style>
