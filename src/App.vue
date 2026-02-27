<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import PWAUpdatePrompt from './components/PWAUpdatePrompt.vue'
import { useSettingsStore } from './stores/settings'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.loadSettings()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-game-neutral-bg via-game-neutral-bg-light to-game-neutral-bg-dark">
    <ErrorBoundary>
      <RouterView />
    </ErrorBoundary>
    <ToastContainer />
    <PWAUpdatePrompt />
  </div>
</template>
