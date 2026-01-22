import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 音效开关
  const soundEnabled = ref(true)

  // 语音开关
  const speechEnabled = ref(true)
  
  // 背景音乐开关
  const musicEnabled = ref(true)
  
  // 背景音乐音量
  const musicVolume = ref(0.3)

  // 切换音效开关
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  // 切换语音开关
  function toggleSpeech() {
    speechEnabled.value = !speechEnabled.value
  }
  
  // 切换背景音乐开关
  function toggleMusic() {
    musicEnabled.value = !musicEnabled.value
  }

  // 从 localStorage 加载设置
  function loadSettings() {
    try {
      const saved = localStorage.getItem('math-game-settings')
      if (saved) {
        const settings = JSON.parse(saved)
        soundEnabled.value = settings.soundEnabled ?? true
        speechEnabled.value = settings.speechEnabled ?? true
        musicEnabled.value = settings.musicEnabled ?? true
        musicVolume.value = settings.musicVolume ?? 0.3
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
        speechEnabled: speechEnabled.value,
        musicEnabled: musicEnabled.value,
        musicVolume: musicVolume.value
      }))
    } catch (error) {
      console.error('保存设置失败:', error)
    }
  }

  return {
    soundEnabled,
    speechEnabled,
    musicEnabled,
    musicVolume,
    toggleSound,
    toggleSpeech,
    toggleMusic,
    loadSettings,
    saveSettings
  }
})
