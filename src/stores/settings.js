import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 音效开关
  const soundEnabled = ref(true)

  // 语音开关
  const speechEnabled = ref(true)

  // 切换音效开关
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  // 切换语音开关
  function toggleSpeech() {
    speechEnabled.value = !speechEnabled.value
  }

  // 设置音效开关
  function setSoundEnabled(enabled) {
    soundEnabled.value = enabled
  }

  // 设置语音开关
  function setSpeechEnabled(enabled) {
    speechEnabled.value = enabled
  }

  // 从 localStorage 加载设置
  function loadSettings() {
    try {
      const saved = localStorage.getItem('math-game-settings')
      if (saved) {
        const settings = JSON.parse(saved)
        soundEnabled.value = settings.soundEnabled ?? true
        speechEnabled.value = settings.speechEnabled ?? true
      }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }

  // 保存设置到 localStorage
  function saveSettings() {
    try {
      localStorage.setItem('math-game-settings', JSON.stringify({
        soundEnabled: soundEnabled.value,
        speechEnabled: speechEnabled.value
      }))
    } catch (error) {
      console.error('保存设置失败:', error)
    }
  }

  // 监听设置变化并自动保存
  function $reset() {
    soundEnabled.value = true
    speechEnabled.value = true
  }

  return {
    soundEnabled,
    speechEnabled,
    toggleSound,
    toggleSpeech,
    setSoundEnabled,
    setSpeechEnabled,
    loadSettings,
    saveSettings,
    $reset
  }
})
