<script setup>
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-vue-next'

defineProps({
  soundEnabled: {
    type: Boolean,
    default: true
  },
  speechEnabled: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggleSound', 'toggleSpeech'])
</script>

<template>
  <div class="settings-panel bg-white rounded-cute-lg shadow-cute p-3 flex gap-3">
    <button
      @click="$emit('toggleSound')"
      class="flex items-center gap-2 px-3 py-2 rounded-cute-lg transition-all hover:scale-105 active:scale-95"
      :class="soundEnabled ? 'bg-peppa-green/20 text-peppa-green' : 'bg-gray-200 text-gray-500'"
      :title="soundEnabled ? '关闭音效' : '开启音效'"
    >
      <Volume2 v-if="soundEnabled" :size="20" />
      <VolumeX v-else :size="20" />
      <span class="text-sm font-medium font-rounded">音效</span>
    </button>

    <button
      @click="$emit('toggleSpeech')"
      class="flex items-center gap-2 px-3 py-2 rounded-cute-lg transition-all hover:scale-105 active:scale-95"
      :class="speechEnabled ? 'bg-peppa-blue/20 text-peppa-blue' : 'bg-gray-200 text-gray-500'"
      :title="speechEnabled ? '关闭语音' : '开启语音'"
    >
      <Mic v-if="speechEnabled" :size="20" />
      <MicOff v-else :size="20" />
      <span class="text-sm font-medium font-rounded">语音</span>
    </button>
  </div>
</template>
