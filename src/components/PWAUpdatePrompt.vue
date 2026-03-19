<script setup>
import { onMounted, ref } from 'vue'
import { BellRing, RefreshCw, X } from 'lucide-vue-next'

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
    <div
      v-if="needRefresh"
      class="update-wrap"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="update-prompt" aria-label="应用有新版本可更新">
        <div class="update-badge">
          <BellRing :size="14" />
          <span>新版本可用</span>
        </div>

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
  top: max(12px, calc(env(safe-area-inset-top) + 8px));
  right: 12px;
  left: 12px;
  z-index: 9999;
}

.update-prompt {
  width: min(100%, 620px);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 14px 12px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 107, 107, 0.36);
  border-top: 4px solid var(--candy-pink);
  box-shadow: var(--shadow-md), var(--glow-pink);
  animation: notice-pop var(--duration-normal) var(--ease-out);
}

.update-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--candy-pink-soft);
  color: var(--candy-pink-dark);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
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
  flex: 1;
  width: 100%;
}

.update-icon {
  width: 40px;
  height: 40px;
  justify-content: center;
  border-radius: 14px;
  background: var(--candy-pink-soft);
  color: var(--candy-pink-dark);
  flex-shrink: 0;
  animation: spin 1.6s linear infinite;
}

.update-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.update-title {
  color: var(--text-primary);
  font-size: var(--font-md);
  font-weight: 800;
  line-height: 1.35;
}

.update-desc {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.5;
}

.update-actions {
  width: 100%;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.btn-update,
.btn-dismiss {
  justify-content: center;
  border: none;
}

.btn-update {
  min-height: 48px;
  min-width: 120px;
  padding: 0 18px;
  border-radius: 16px;
  background: var(--candy-pink);
  color: white;
  font-size: var(--font-base);
  font-weight: 800;
}

.btn-dismiss {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(93, 111, 136, 0.12);
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
  transform: translateY(-10px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes notice-pop {
  0% {
    transform: translateY(-8px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .update-prompt {
    border-radius: 20px;
  }

  .update-actions {
    width: 100%;
    justify-content: stretch;
  }

  .btn-update {
    flex: 1;
  }
}

@media (hover: hover) {
  .btn-update:hover {
    transform: translateY(-1px);
    background: var(--candy-pink-dark);
    box-shadow: var(--shadow-sm), var(--glow-pink);
  }

  .btn-dismiss:hover {
    background: rgba(93, 111, 136, 0.2);
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

  .update-prompt {
    animation: none;
  }
}
</style>
