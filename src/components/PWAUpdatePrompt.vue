<script setup>
import { ref, onMounted } from 'vue'
import { RefreshCw, X } from 'lucide-vue-next'

const needRefresh = ref(false)
const updateSW = ref(null)

onMounted(async () => {
  // 检查 Service Worker 更新
  if ('serviceWorker' in navigator) {
    const { registerSW } = await import('virtual:pwa-register')
    
    updateSW.value = registerSW({
      immediate: true,
      onNeedRefresh() {
        needRefresh.value = true
      },
      onOfflineReady() {
        console.log('应用已准备好离线使用')
      }
    })
  }
})

function handleUpdate() {
  if (updateSW.value) {
    updateSW.value(true) // true 表示立即刷新
  }
}

function handleDismiss() {
  needRefresh.value = false
}
</script>

<template>
  <Transition name="slide-up">
    <div v-if="needRefresh" class="update-prompt">
      <div class="update-content">
        <div class="update-icon">
          <RefreshCw :size="24" />
        </div>
        <div class="update-text">
          <span class="update-title">发现新版本</span>
          <span class="update-desc">点击更新获取最新内容</span>
        </div>
        <button class="btn-update" @click="handleUpdate">
          立即更新
        </button>
        <button class="btn-dismiss" @click="handleDismiss">
          <X :size="20" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.update-prompt {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  background: var(--bg-white);
  border-top: 1px solid var(--border-light);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.update-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.update-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--hero-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.update-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.update-title {
  font-size: var(--font-md);
  font-weight: 700;
  color: var(--text-primary);
}

.update-desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

.btn-update {
  height: 40px;
  padding: 0 20px;
  background: var(--hero-blue);
  color: white;
  font-size: var(--font-md);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-update:hover {
  background: var(--hero-blue-dark);
}

.btn-update:active {
  transform: scale(0.95);
}

.btn-dismiss {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--text-secondary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-dismiss:hover {
  background: var(--bg-light);
  color: var(--text-primary);
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .update-icon {
    animation: none;
  }
  
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: none;
  }
}
</style>
