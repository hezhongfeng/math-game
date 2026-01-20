<script setup>
import { Volume2, VolumeX, Mic, MicOff, Music } from 'lucide-vue-next'

defineProps({
  soundEnabled: {
    type: Boolean,
    default: true
  },
  speechEnabled: {
    type: Boolean,
    default: true
  },
  musicEnabled: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggleSound', 'toggleSpeech', 'toggleMusic'])
</script>

<template>
  <div class="settings-panel bg-white rounded-cute-lg shadow-cute p-3 flex gap-3">
    <button
      @click="$emit('toggleSound')"
      class="flex items-center gap-2 px-3 py-2 rounded-cute-lg transition-all hover:scale-105 active:scale-95 border-2 shadow-cute"
      :class="soundEnabled ? 'bg-peppa-green/20 text-peppa-green border-peppa-green/30' : 'bg-gray-200 text-gray-500 border-gray-300'"
      :title="soundEnabled ? '关闭音效' : '开启音效'"
    >
      <Volume2 v-if="soundEnabled" :size="20" />
      <VolumeX v-else :size="20" />
      <span class="text-sm font-medium font-rounded">音效</span>
    </button>

    <button
      @click="$emit('toggleSpeech')"
      class="flex items-center gap-2 px-3 py-2 rounded-cute-lg transition-all hover:scale-105 active:scale-95 border-2 shadow-cute"
      :class="speechEnabled ? 'bg-peppa-blue/20 text-peppa-blue border-peppa-blue/30' : 'bg-gray-200 text-gray-500 border-gray-300'"
      :title="speechEnabled ? '关闭语音' : '开启语音'"
    >
      <Mic v-if="speechEnabled" :size="20" />
      <MicOff v-else :size="20" />
      <span class="text-sm font-medium font-rounded">语音</span>
    </button>
    
    <button
      @click="$emit('toggleMusic')"
      class="flex items-center gap-2 px-3 py-2 rounded-cute-lg transition-all hover:scale-105 active:scale-95 border-2 shadow-cute"
      :class="musicEnabled ? 'bg-peppa-yellow/20 text-peppa-yellow border-peppa-yellow/30' : 'bg-gray-200 text-gray-500 border-gray-300'"
      :title="musicEnabled ? '关闭音乐' : '开启音乐'"
    >
      <Music :size="20" :class="musicEnabled ? 'text-peppa-yellow' : 'text-gray-500'" />
      <span class="text-sm font-medium font-rounded">音乐</span>
    </button>
  </div>
</template>
