<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
import BackgroundMusic from './components/BackgroundMusic.vue'
import AudioDiagnosticPanel from './components/AudioDiagnosticPanel.vue'
import { useSettingsStore } from './stores/settings'
import { isDebugMode, enableDebugMode } from './utils/audioDebug'

const settingsStore = useSettingsStore()

const showDiagnosticPanel = ref(false)

// 检查 URL 参数，自动显示诊断面板
onMounted(() => {
  settingsStore.loadSettings()
  
  // 检查 URL 参数
  const urlParams = new URLSearchParams(window.location.search)
  const audioDebug = urlParams.get('audioDebug') || urlParams.get('debug')
  
  if (audioDebug === 'true' || audioDebug === 'audio') {
    enableDebugMode(true)
    showDiagnosticPanel.value = true
  }
})

// 计算是否应该显示诊断面板
const shouldShowDiagnosticPanel = computed(() => {
  return showDiagnosticPanel.value && isDebugMode()
})

// 从外部接收显示诊断面板的指令（通过全局事件）
window.showAudioDiagnosticPanel = () => {
  enableDebugMode(true)
  showDiagnosticPanel.value = true
}

window.hideAudioDiagnosticPanel = () => {
  showDiagnosticPanel.value = false
}

window.toggleAudioDiagnosticPanel = () => {
  enableDebugMode(true)
  showDiagnosticPanel.value = !showDiagnosticPanel.value
}

// 添加全局日志函数，方便在控制台调试
window.logAudioEvent = (message) => {
  const { logAudioEvent, LOG_LEVELS, LOG_CATEGORIES } = require('./utils/audioDebug')
  logAudioEvent(LOG_LEVELS.INFO, LOG_CATEGORIES.DIAGNOSTIC, message)
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
