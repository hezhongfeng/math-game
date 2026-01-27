<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import BackgroundMusic from './components/BackgroundMusic.vue'
import AudioDiagnosticPanel from './components/AudioDiagnosticPanel.vue'
import { useSettingsStore } from './stores/settings'
import { isDebugMode } from './utils/audioDebug'

const settingsStore = useSettingsStore()

const showDiagnosticPanel = ref(false)

// 检查 URL 参数，自动显示诊断面板
onMounted(() => {
  settingsStore.loadSettings()
  
  // 检查 URL 参数
  const urlParams = new URLSearchParams(window.location.search)
  const audioDebug = urlParams.get('audioDebug') || urlParams.get('debug')
  
  if (audioDebug === 'true' || audioDebug === 'audio') {
    showDiagnosticPanel.value = true
  }
})

// 计算是否应该显示诊断面板
const shouldShowDiagnosticPanel = computed(() => {
  return showDiagnosticPanel.value && isDebugMode()
})

// 从外部接收显示诊断面板的指令（通过全局事件）
window.showAudioDiagnosticPanel = () => {
  showDiagnosticPanel.value = true
}

window.hideAudioDiagnosticPanel = () => {
  showDiagnosticPanel.value = false
}

window.toggleAudioDiagnosticPanel = () => {
  showDiagnosticPanel.value = !showDiagnosticPanel.value
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#BBDEFB] to-[#90CAF9]">
    <RouterView />
    <ToastContainer />
    <BackgroundMusic :enabled="settingsStore.musicEnabled" />
    <AudioDiagnosticPanel
      :show="shouldShowDiagnosticPanel"
      @close="showDiagnosticPanel = false"
    />
  </div>
</template>
