<script setup>
import { onMounted, ref } from 'vue'
import { RefreshCw, X } from 'lucide-vue-next'

const needRefresh = ref(false)
const updateSW = ref(null)

onMounted(async () => {
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
    updateSW.value(true)
  }
}

function handleDismiss() {
  needRefresh.value = false
}
</script>

<template>
  <Transition name="slide-up">
    <div v-if="needRefresh" class="update-wrap">
      <div class="update-prompt">
        <div class="update-main">
          <div class="update-icon">
            <RefreshCw :size="20" />
          </div>
          <div class="update-copy">
            <span class="update-title">发现新版本</span>
            <span class="update-desc">刷新后即可使用最新内容</span>
          </div>
        </div>

        <div class="update-actions">
          <button class="btn-update" @click="handleUpdate">立即更新</button>
          <button class="btn-dismiss" aria-label="关闭更新提示" @click="handleDismiss">
            <X :size="18" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.update-wrap {
  position: fixed;
  right: 16px;
  bottom: max(16px, env(safe-area-inset-bottom));
  left: 16px;
  z-index: 9999;
}

.update-prompt {
  width: min(100%, 560px);
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px;
  border-radius: 24px;
  background: var(--bg-panel-strong);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(18px);
}

.update-main,
.update-icon,
.update-actions,
.btn-update,
.btn-dismiss {
  display: flex;
  align-items: center;
}

.update-main {
  gap: 12px;
  min-width: 0;
}

.update-icon {
  width: 40px;
  height: 40px;
  justify-content: center;
  border-radius: 14px;
  background: var(--hero-blue-soft);
  color: var(--hero-blue-dark);
  flex-shrink: 0;
  animation: spin 1.4s linear infinite;
}

.update-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.update-title {
  color: var(--text-primary);
  font-size: var(--font-base);
  font-weight: 800;
}

.update-desc {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.5;
}

.update-actions {
  gap: 10px;
  flex-shrink: 0;
}

.btn-update,
.btn-dismiss {
  justify-content: center;
  border: none;
}

.btn-update {
  height: 44px;
  padding: 0 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--hero-blue) 0%, var(--hero-blue-dark) 100%);
  color: white;
  font-size: var(--font-base);
  font-weight: 800;
}

.btn-dismiss {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.76);
  color: var(--text-secondary);
}

.btn-update:active,
.btn-dismiss:active {
  transform: scale(0.98);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .update-prompt {
    flex-direction: column;
    align-items: stretch;
  }

  .update-actions {
    width: 100%;
  }

  .btn-update {
    flex: 1;
  }
}

@media (hover: hover) {
  .btn-update:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md), var(--glow-blue);
  }

  .btn-dismiss:hover {
    background: rgba(255, 255, 255, 0.92);
    color: var(--text-primary);
  }
}

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
