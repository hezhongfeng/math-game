import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORAGE_KEYS } from '../config/constants'

export const useSettingsStore = defineStore('settings', () => {
  const isLoaded = ref(false)

  function loadSettings() {
    if (isLoaded.value) {
      return
    }
    isLoaded.value = true
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({}))
    } catch (error) {
      console.warn('保存设置失败:', error)
    }
  }

  return {
    isLoaded,
    loadSettings,
    saveSettings
  }
})
