<script setup>
import { Check, X, AlertTriangle, Info } from 'lucide-vue-next'

defineProps({
  toast: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['remove'])

const icons = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info
}

const colors = {
  success: {
    bg: 'bg-peppa-green',
    text: 'text-white'
  },
  error: {
    bg: 'bg-peppa-orange',
    text: 'text-white'
  },
  warning: {
    bg: 'bg-peppa-yellow',
    text: 'text-gray-800'
  },
  info: {
    bg: 'bg-peppa-blue',
    text: 'text-white'
  }
}
</script>

<template>
  <Transition name="toast">
    <div
      class="flex items-center gap-3 px-4 py-3 rounded-cute-lg shadow-cute-lg min-w-[300px] max-w-md"
      :class="[colors[toast.type].bg, colors[toast.type].text]"
    >
      <component :is="icons[toast.type]" :size="20" />
      <span class="flex-1 font-medium font-rounded">{{ toast.message }}</span>
      <button
        @click="$emit('remove', toast.id)"
        class="opacity-70 hover:opacity-100 transition-opacity"
      >
        <X :size="16" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
