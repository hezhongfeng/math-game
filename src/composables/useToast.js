import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const DEFAULT_DURATION = 3000

  function addToast(message, type = 'info', duration = DEFAULT_DURATION) {
    const id = Date.now()
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message, duration = DEFAULT_DURATION) {
    return addToast(message, 'success', duration)
  }

  function error(message, duration = DEFAULT_DURATION) {
    return addToast(message, 'error', duration)
  }

  function warning(message, duration = DEFAULT_DURATION) {
    return addToast(message, 'warning', duration)
  }

  function info(message, duration = DEFAULT_DURATION) {
    return addToast(message, 'info', duration)
  }

  function clear() {
    toasts.value = []
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clear
  }
}
