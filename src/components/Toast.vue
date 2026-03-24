<script setup>
import { AlertTriangle, Check, Info, X } from 'lucide-vue-next'

defineProps({
  toast: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['remove'])

const icons = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info
}

const styles = {
  success: {
    card: 'toast-success',
    icon: 'icon-success'
  },
  error: {
    card: 'toast-error',
    icon: 'icon-error'
  },
  warning: {
    card: 'toast-warning',
    icon: 'icon-warning'
  },
  info: {
    card: 'toast-info',
    icon: 'icon-info'
  }
}

function getStyle(type) {
  return styles[type] || styles.info
}

function getIcon(type) {
  return icons[type] || icons.info
}
</script>

<template>
  <div class="toast-item" :class="getStyle(toast.type).card" @click="emit('remove', toast.id)">
    <div class="icon-wrapper" :class="getStyle(toast.type).icon">
      <component :is="getIcon(toast.type)" :size="18" />
    </div>
    <span class="message">{{ toast.message }}</span>
    <button class="close-btn" type="button" aria-label="关闭提示">
      <X :size="16" />
    </button>
  </div>
</template>

<style scoped>
.toast-item {
  width: min(100%, 360px);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 20px;
  background: var(--bg-panel-strong);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(18px);
  pointer-events: auto;
  cursor: pointer;
}

.icon-wrapper,
.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  flex-shrink: 0;
}

.message {
  flex: 1;
  color: var(--text-primary);
  font-size: var(--font-base);
  font-weight: 700;
  line-height: 1.5;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--text-muted);
}

.toast-success {
  border-color: rgba(18, 185, 129, 0.24);
}

.toast-error {
  border-color: rgba(239, 83, 80, 0.22);
}

.toast-warning {
  border-color: rgba(255, 122, 69, 0.24);
}

.toast-info {
  border-color: rgba(49, 120, 246, 0.28);
}

.icon-success {
  color: var(--candy-mint-dark);
  background: var(--candy-mint-soft);
}

.icon-error {
  color: var(--candy-red-dark);
  background: rgba(255, 107, 107, 0.12);
}

.icon-warning {
  color: var(--candy-peach-dark);
  background: var(--candy-peach-soft);
}

.icon-info {
  color: var(--candy-pink-dark);
  background: rgba(49, 120, 246, 0.12);
}
</style>
