import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORAGE_KEYS } from '../config/constants'

export const useSettingsStore = defineStore('settings', () => {
  // 音效开关
  const soundEnabled = ref(true)

  // 切换音效开关
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  // 从 localStorage 加载设置
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (saved) {
        const settings = JSON.parse(saved)
        soundEnabled.value = settings.soundEnabled ?? true
      }
    } catch (error) {
      console.warn('加载设置失败:', error)
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

  return {
    soundEnabled,
    toggleSound,
    loadSettings,
    saveSettings
  }
})
