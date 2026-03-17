import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { STORAGE_KEYS } from '../config/constants'

export const useSettingsStore = defineStore('settings', () => {
  // 音效开关
  const soundEnabled = ref(true)
  const isLoaded = ref(false)

  // 切换音效开关
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  // 从 localStorage 加载设置
  function loadSettings() {
    if (isLoaded.value) {
      return
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (saved) {
        const settings = JSON.parse(saved)
        soundEnabled.value = settings.soundEnabled ?? true
      }
    } catch (error) {
      console.warn('加载设置失败:', error)
    } finally {
      isLoaded.value = true
    }
  }

  // 保存设置到 localStorage
  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
        soundEnabled: soundEnabled.value
      }))
    } catch (error) {
      console.warn('保存设置失败:', error)
    }
  }

  watch(soundEnabled, () => {
    if (isLoaded.value) {
      saveSettings()
    }
  })

  return {
    soundEnabled,
    isLoaded,
    toggleSound,
    loadSettings,
    saveSettings
  }
})
