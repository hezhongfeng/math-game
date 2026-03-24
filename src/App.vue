<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import PWAUpdatePrompt from './components/PWAUpdatePrompt.vue'
</script>

<template>
  <div class="app-shell">
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
  background:
    radial-gradient(circle at top left, rgba(49, 120, 246, 0.12), transparent 34%),
    radial-gradient(circle at bottom right, rgba(46, 196, 182, 0.12), transparent 32%),
    linear-gradient(180deg, #f4f8ff 0%, #edf4ff 48%, #e8f2ff 100%);
}
</style>
