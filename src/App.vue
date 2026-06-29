<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import PWAUpdatePrompt from './components/PWAUpdatePrompt.vue'
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <ErrorBoundary>
      <RouterView />
    </ErrorBoundary>
    <ToastContainer />
    <PWAUpdatePrompt />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.skip-link {
  position: fixed;
  top: max(8px, env(safe-area-inset-top));
  left: 12px;
  z-index: 10000;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: var(--text-primary);
  color: white;
  font-weight: 800;
  transform: translateY(-160%);
  transition: transform var(--duration-fast) var(--ease-out);
}

.skip-link:focus-visible {
  transform: translateY(0);
}
</style>
