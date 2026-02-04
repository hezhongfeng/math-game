<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { Home, RotateCcw, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const hasError = ref(false)
const errorInfo = ref(null)

// 开发环境标记（用于显示详细错误）
const isDev = import.meta.env.DEV

// 捕获子组件错误
onErrorCaptured((err, instance, info) => {
  console.error('错误边界捕获到错误:', err)
  console.error('错误组件:', instance)
  console.error('错误信息:', info)
  
  errorInfo.value = {
    message: err.message || '未知错误',
    stack: err.stack || '',
    info: info || ''
  }
  hasError.value = true
  
  // 阻止错误继续传播
  return false
})

// 返回首页
function goHome() {
  hasError.value = false
  errorInfo.value = null
  router.push('/')
}

// 刷新页面重试
function retry() {
  window.location.reload()
}
</script>

<template>
  <div class="error-boundary">
    <!-- 正常内容 -->
    <slot v-if="!hasError" />
    
    <!-- 错误状态 -->
    <div v-else class="error-container">
      <div class="error-content">
        <!-- 错误图标 -->
        <div class="error-icon-wrapper">
          <AlertCircle :size="48" class="error-icon" />
        </div>
        
        <!-- 错误标题 -->
        <h2 class="error-title text-child-xl">出错了</h2>
        
        <!-- 错误描述 -->
        <p class="error-message text-child-base">
          游戏遇到了一些问题，请重试或返回首页
        </p>
        
        <!-- 错误详情（开发环境显示） -->
        <div v-if="errorInfo && isDev" class="error-details">
          <p class="error-detail-text">{{ errorInfo.message }}</p>
          <p class="error-detail-info">{{ errorInfo.info }}</p>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <button class="btn-retry text-child-sm" @click="retry">
            <RotateCcw :size="20" />
            <span>刷新重试</span>
          </button>
          
          <button class="btn-home text-child-sm" @click="goHome">
            <Home :size="20" />
            <span>返回首页</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-boundary {
  min-height: 100vh;
}

.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(180deg, var(--game-bg-light) 0%, var(--game-bg) 50%, var(--game-bg-dark) 100%);
}

.error-content {
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.error-icon-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--game-error) 0%, var(--game-error-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 8px 24px rgba(207, 74, 74, 0.3);
}

.error-icon {
  color: white;
}

.error-title {
  font-weight: 800;
  color: var(--game-text);
  margin-bottom: 12px;
}

.error-message {
  color: var(--game-text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

.error-details {
  background: var(--game-bg-light);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
  border: 1px solid var(--game-border);
}

.error-detail-text {
  font-family: monospace;
  font-size: 14px;
  color: var(--game-error);
  margin-bottom: 8px;
  word-break: break-all;
}

.error-detail-info {
  font-family: monospace;
  font-size: 12px;
  color: var(--game-text-muted);
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-retry {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 24px;
  font-weight: 700;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, var(--game-primary) 0%, var(--game-primary-dark) 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 0 0 rgba(58, 99, 71, 0.4), 0 6px 12px rgba(74, 124, 89, 0.3);
}

.btn-retry:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 0 0 rgba(58, 99, 71, 0.4), 0 8px 16px rgba(74, 124, 89, 0.4);
}

.btn-retry:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 0 rgba(58, 99, 71, 0.4), 0 3px 6px rgba(74, 124, 89, 0.3);
}

.btn-home {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 24px;
  font-weight: 700;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--game-bg-light);
  color: var(--game-text-secondary);
  border: 2px solid var(--game-border);
  box-shadow: 0 3px 0 0 var(--game-border), 0 4px 8px rgba(0, 0, 0, 0.06);
}

.btn-home:hover {
  background: var(--game-bg);
  transform: translateY(-1px);
  box-shadow: 0 4px 0 0 var(--game-border), 0 6px 12px rgba(0, 0, 0, 0.08);
}

.btn-home:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 var(--game-border), 0 2px 4px rgba(0, 0, 0, 0.06);
}
</style>
