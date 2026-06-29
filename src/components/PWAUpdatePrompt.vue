<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Sparkles } from 'lucide-vue-next'

const needRefresh = ref(false)
const isUpdating = ref(false)
const applyUpdate = ref(null)
const updateButtonRef = ref(null)
let previousActiveElement = null
let previousBodyOverflow = ''
let appWasInert = false

onMounted(async () => {
  if ('serviceWorker' in navigator) {
    try {
      const { registerSW } = await import('virtual:pwa-register')

      applyUpdate.value = registerSW({
        immediate: true,
        onNeedRefresh() {
          needRefresh.value = true
          isUpdating.value = false
        }
      })
    } catch (error) {
      console.error('注册 PWA 更新服务失败:', error)
    }
  }
})

watch(needRefresh, async (visible) => {
  const app = document.querySelector('#app')

  if (visible) {
    previousActiveElement = document.activeElement
    previousBodyOverflow = document.body.style.overflow
    appWasInert = app?.inert || false
    if (app) app.inert = true
    document.body.style.overflow = 'hidden'
    await nextTick()
    updateButtonRef.value?.focus()
    return
  }

  if (app) app.inert = appWasInert
  document.body.style.overflow = previousBodyOverflow
  if (previousActiveElement?.isConnected) previousActiveElement.focus()
  previousActiveElement = null
})

onUnmounted(() => {
  const app = document.querySelector('#app')
  if (app) app.inert = appWasInert
  document.body.style.overflow = previousBodyOverflow
})

async function handleUpdate() {
  if (isUpdating.value) {
    return
  }

  isUpdating.value = true

  try {
    if (applyUpdate.value) {
      await applyUpdate.value(true)
      return
    }

    window.location.reload()
  } catch (error) {
    console.error('应用 PWA 更新失败:', error)
    isUpdating.value = false
    needRefresh.value = true
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="needRefresh" class="overlay">
        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-update-title"
          aria-describedby="pwa-update-description"
          @keydown.tab.prevent="updateButtonRef?.focus()"
        >
          <div class="icon-wrap">
            <Sparkles :size="32" aria-hidden="true" />
          </div>
          <h2 id="pwa-update-title" class="title">发现新版本</h2>
          <p id="pwa-update-description" class="desc">更新后即可使用最新内容。</p>
          <button
            ref="updateButtonRef"
            class="btn-update"
            :disabled="isUpdating"
            :aria-busy="isUpdating"
            @click="handleUpdate"
          >
            {{ isUpdating ? '更新中…' : '立即更新' }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
}

.modal {
  width: min(100%, 320px);
  padding: 32px 28px;
  border-radius: var(--radius-xl);
  background: var(--bg-white);
  box-shadow: var(--shadow-lg);
  text-align: center;
  overscroll-behavior: contain;
}

.icon-wrap {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: var(--candy-yellow-soft);
  color: var(--candy-yellow-dark);
}

.title {
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: var(--font-lg);
  font-weight: 800;
}

.desc {
  margin-bottom: 24px;
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.5;
}

.btn-update {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--candy-blue);
  color: white;
  font-size: var(--font-base);
  font-weight: 800;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard);
}

.btn-update:disabled {
  opacity: 0.72;
  cursor: wait;
}

.btn-update:active {
  transform: scale(0.97);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal {
  animation: pop-in var(--duration-normal) var(--ease-out);
}

@keyframes pop-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
