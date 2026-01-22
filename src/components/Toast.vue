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
    bg: 'bg-gradient-to-r from-peppa-green to-peppa-green-dark',
    text: 'text-white',
    shadow: 'shadow-peppa-green'
  },
  error: {
    bg: 'bg-gradient-to-r from-peppa-orange to-peppa-orange-dark',
    text: 'text-white',
    shadow: 'shadow-peppa-orange'
  },
  warning: {
    bg: 'bg-gradient-to-r from-peppa-yellow to-peppa-yellow-dark',
    text: 'text-gray-800',
    shadow: 'shadow-peppa-yellow'
  },
  info: {
    bg: 'bg-gradient-to-r from-peppa-blue to-peppa-blue-dark',
    text: 'text-white',
    shadow: 'shadow-peppa-blue'
  }
}
</script>

<template>
  <div
    class="toast-item flex items-center gap-3 px-5 py-4 rounded-cute-xl shadow-cute-lg min-w-[320px] max-w-md cursor-pointer hover:shadow-cute-lg hover:scale-102 transition-all duration-300"
    :class="[colors[toast.type].bg, colors[toast.type].text]"
    @click="$emit('remove', toast.id)"
  >
    <div class="icon-wrapper bg-white/20 rounded-full p-1.5 flex-shrink-0">
      <component :is="icons[toast.type]" :size="22" class="drop-shadow-md" />
    </div>
    <span class="flex-1 font-medium font-rounded text-base">{{ toast.message }}</span>
    <div class="close-btn opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-200 p-1">
      <X :size="18" />
    </div>
  </div>
</template>

<style scoped>
.toast-item {
  pointer-events: auto;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}

.icon-wrapper {
  backdrop-filter: blur(4px);
}

.drop-shadow-md {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}
</style>
