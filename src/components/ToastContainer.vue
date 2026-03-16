<script setup>
import Toast from './Toast.vue'
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          @remove="removeToast"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: max(16px, env(safe-area-inset-top));
  right: 16px;
  left: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  pointer-events: none;
}

.toast-enter-active {
  animation: toastSlideIn 0.28s var(--ease-out);
}

.toast-leave-active {
  animation: toastSlideOut 0.22s var(--ease-standard);
}

@keyframes toastSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toastSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
}

@media (max-width: 640px) {
  .toast-container {
    align-items: stretch;
  }
}
</style>
