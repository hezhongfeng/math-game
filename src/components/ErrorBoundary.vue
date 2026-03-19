<script setup>
import { onErrorCaptured, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle, Home, RotateCcw } from 'lucide-vue-next'

const router = useRouter()
const hasError = ref(false)
const errorInfo = ref(null)
const isDev = import.meta.env.DEV

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
  return false
})

function goHome() {
  hasError.value = false
  errorInfo.value = null
  router.push('/')
}

function retry() {
  window.location.reload()
}
</script>

<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />

    <div v-else class="error-container">
      <div class="error-card">
        <div class="topline">
          <span class="error-chip">
            <AlertCircle :size="16" />
            <span>出现异常</span>
          </span>
        </div>

        <div class="icon-panel">
          <AlertCircle :size="34" class="error-icon" />
        </div>

        <h2 class="error-title text-child-xl">界面遇到问题</h2>
        <p class="error-message text-child-base">请刷新后重试，或返回首页重新开始。</p>

        <div v-if="errorInfo && isDev" class="error-details">
          <p class="error-detail-text">{{ errorInfo.message }}</p>
          <p class="error-detail-info">{{ errorInfo.info }}</p>
        </div>

        <div class="error-actions">
          <button class="btn-retry text-child-sm" @click="retry">
            <RotateCcw :size="18" />
            <span>刷新重试</span>
          </button>

          <button class="btn-home text-child-sm" @click="goHome">
            <Home :size="18" />
            <span>返回首页</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-boundary,
.error-container {
  min-height: 100vh;
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
}

.error-card {
  width: min(100%, 420px);
  padding: 22px;
  border-radius: var(--radius-xl);
  background: var(--bg-panel-strong);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(18px);
}

.topline,
.error-chip,
.icon-panel,
.btn-retry,
.btn-home {
  display: flex;
  align-items: center;
}

.topline {
  justify-content: flex-start;
  margin-bottom: 16px;
}

.error-chip {
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-full);
  background: rgba(255, 107, 107, 0.12);
  color: var(--candy-red-dark);
  font-size: var(--font-sm);
  font-weight: 800;
}

.icon-panel {
  width: 72px;
  height: 72px;
  justify-content: center;
  margin-bottom: 18px;
  border-radius: 24px;
  background: rgba(255, 107, 107, 0.1);
  color: var(--candy-red-dark);
}

.error-title {
  margin-bottom: 10px;
  color: var(--text-primary);
  font-weight: 800;
}

.error-message {
  margin-bottom: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.error-details {
  margin-bottom: 16px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid var(--border-light);
}

.error-detail-text,
.error-detail-info {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  word-break: break-word;
}

.error-detail-text {
  margin-bottom: 8px;
  color: var(--candy-red-dark);
  font-size: 13px;
}

.error-detail-info {
  color: var(--text-muted);
  font-size: 12px;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-retry,
.btn-home {
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 18px;
  font-weight: 800;
}

.btn-retry {
  color: white;
  background: linear-gradient(135deg, var(--candy-pink) 0%, var(--candy-pink-dark) 100%);
}

.btn-home {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid var(--border-light);
}

.btn-retry:active,
.btn-home:active {
  transform: scale(0.98);
}

@media (hover: hover) {
  .btn-retry:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md), var(--glow-pink);
  }

  .btn-home:hover {
    background: rgba(255, 255, 255, 0.92);
    color: var(--text-primary);
  }
}

@media (max-width: 420px) {
  .error-container {
    align-items: flex-end;
    padding: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }

  .error-card {
    width: 100%;
    padding: 18px;
    border-radius: 24px;
  }

  .icon-panel {
    width: 64px;
    height: 64px;
    margin-bottom: 14px;
  }

  .error-message {
    line-height: 1.55;
  }
}
</style>
