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
}
</style>
