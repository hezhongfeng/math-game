<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Music, Volume2, VolumeX, Volume1 } from 'lucide-vue-next'
import { useSound } from '../composables/useSound'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle', 'volumeChange'])

const { playSound } = useSound()
const isPlaying = ref(false)
const volume = ref(0.3)
const showVolumeControl = ref(false)
const volumeControlRef = ref(null)

const volumeIcon = computed(() => {
  if (volume.value === 0) return VolumeX
  if (volume.value < 0.5) return Volume1
  return Volume2
})

let audioContext = null
let audioBuffer = null
let sourceNode = null
let gainNode = null

function createBackgroundMusic() {
  if (!audioContext) return

  const duration = 6
  const sampleRate = audioContext.sampleRate
  const buffer = audioContext.createBuffer(2, duration * sampleRate, sampleRate)

  const chords = [
    { freq: [261.63, 329.63, 392.00], time: 0 },
    { freq: [349.23, 440.00, 523.25], time: 1.5 },
    { freq: [392.00, 493.88, 587.33], time: 3 },
    { freq: [261.63, 329.63, 392.00], time: 4.5 }
  ]

  const melody = [
    { freq: 523.25, time: 0.2 },
    { freq: 587.33, time: 0.5 },
    { freq: 659.25, time: 0.8 },
    { freq: 523.25, time: 1.2 },
    { freq: 783.99, time: 1.7 },
    { freq: 659.25, time: 2.0 },
    { freq: 523.25, time: 2.5 },
    { freq: 440.00, time: 3.2 },
    { freq: 493.88, time: 3.5 },
    { freq: 523.25, time: 3.8 },
    { freq: 587.33, time: 4.2 },
    { freq: 659.25, time: 4.7 },
    { freq: 698.46, time: 5.0 },
    { freq: 659.25, time: 5.3 },
    { freq: 523.25, time: 5.6 },
  ]

  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel)

    chords.forEach(chord => {
      const startSample = Math.floor(chord.time * sampleRate)
      const endSample = Math.floor((chord.time + 1.4) * sampleRate)

      for (let i = startSample; i < endSample && i < channelData.length; i++) {
        let sample = 0

        chord.freq.forEach((freq, index) => {
          const amplitude = 0.08 / (index + 1)
          sample += Math.sin(2 * Math.PI * freq * i / sampleRate) * amplitude
        })

        const t = (i - startSample) / sampleRate
        const envelope = Math.exp(-t * 0.8) * (0.5 + 0.5 * Math.sin(t * Math.PI * 3))
        channelData[i] += sample * envelope
      }
    })

    melody.forEach(note => {
      const startSample = Math.floor(note.time * sampleRate)
      const noteDuration = 0.25

      for (let i = startSample; i < startSample + noteDuration * sampleRate && i < channelData.length; i++) {
        const t = (i - startSample) / sampleRate
        const envelope = Math.exp(-t * 5) * (1 - t * 0.3)
        const sample = Math.sin(2 * Math.PI * note.freq * i / sampleRate) * 0.15
        channelData[i] += sample * envelope
      }
    })
  }

  return buffer
}

function play() {
  if (!props.enabled || !audioBuffer || !audioContext) return

  try {
    if (sourceNode) {
      sourceNode.stop()
      sourceNode.disconnect()
    }

    sourceNode = audioContext.createBufferSource()
    sourceNode.buffer = audioBuffer
    sourceNode.loop = true

    gainNode = audioContext.createGain()
    gainNode.gain.value = volume.value

    sourceNode.connect(gainNode)
    gainNode.connect(audioContext.destination)

    sourceNode.start()
    isPlaying.value = true
  } catch (error) {
    console.warn('背景音乐播放失败:', error)
  }
}

function pause() {
  if (sourceNode && isPlaying.value) {
    try {
      sourceNode.stop()
      isPlaying.value = false
    } catch (error) {
      console.warn('背景音乐暂停失败:', error)
    }
  }
}

function togglePlay() {
  playSound('click')
  emit('toggle', !isPlaying.value)
  
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

function setVolume(newVolume) {
  volume.value = Math.max(0, Math.min(1, newVolume))
  emit('volumeChange', volume.value)
  
  if (gainNode) {
    gainNode.gain.value = volume.value
  }
}

function handleClickOutside(event) {
  if (volumeControlRef.value && !volumeControlRef.value.contains(event.target)) {
    showVolumeControl.value = false
  }
}

watch(volume, (newVolume) => {
  if (gainNode) {
    gainNode.gain.value = newVolume
  }
})

watch(() => props.enabled, (enabled) => {
  if (enabled && !isPlaying.value) {
    play()
  } else if (!enabled && isPlaying.value) {
    pause()
  }
})

onMounted(() => {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    audioBuffer = createBackgroundMusic()
    
    if (props.enabled) {
      play()
    }
  } catch (error) {
    console.warn('音频上下文初始化失败:', error)
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  pause()
  
  if (audioContext) {
    audioContext.close()
  }
  
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({
  play,
  pause,
  setVolume
})
</script>

<template>
  <div class="music-control" ref="volumeControlRef">
    <!-- 音量控制面板 -->
    <Transition name="fade">
      <div v-if="showVolumeControl" class="volume-panel">
        <div class="volume-header">
          <component :is="volumeIcon" :size="20" class="volume-icon" />
          <span class="volume-text">{{ Math.round(volume * 100) }}%</span>
        </div>
        
        <div class="volume-slider-wrap">
          <input
            type="range"
            min="0"
            max="100"
            :value="volume * 100"
            @input="setVolume($event.target.value / 100)"
            class="volume-slider"
          >
        </div>
      </div>
    </Transition>

    <!-- 控制按钮组 -->
    <div class="btn-group">
      <!-- 音乐开关 -->
      <button
        @click="togglePlay"
        class="ctrl-btn music-btn"
        :class="{ 'is-active': props.enabled && isPlaying }"
        :title="props.enabled && isPlaying ? '暂停音乐' : '播放音乐'"
      >
        <Music :size="22" />
      </button>
      
      <!-- 音量调节 -->
      <button
        @click="showVolumeControl = !showVolumeControl"
        class="ctrl-btn volume-btn"
        :class="{ 'is-active': showVolumeControl }"
        title="音量控制"
      >
        <component :is="volumeIcon" :size="22" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.music-control {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* 音量面板 */
.volume-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px 20px;
  width: 240px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.volume-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.volume-icon {
  color: #4A90E2;
}

.volume-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.volume-slider-wrap {
  background: #E3F2FD;
  border-radius: 10px;
  padding: 5px 8px;
}

.volume-slider {
  width: 100%;
  height: 16px;
  appearance: none;
  background: linear-gradient(90deg, #4A90E2 0%, #7AB8FF 100%);
  border-radius: 10px;
  cursor: pointer;
  position: relative;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #fff 0%, #f0f7ff 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.15),
    0 0 0 3px #4A90E2;
  transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 
    0 3px 8px rgba(0, 0, 0, 0.2),
    0 0 0 4px #4A90E2;
}

.volume-slider::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

.volume-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #fff 0%, #f0f7ff 100%);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.15),
    0 0 0 3px #4A90E2;
}

/* 按钮组 */
.btn-group {
  display: flex;
  gap: 8px;
}

.ctrl-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

/* 音乐按钮 */
.music-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #666;
}

.music-btn:hover {
  background: #fff;
  color: #4CAF50;
}

.music-btn.is-active {
  background: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.music-btn.is-active:hover {
  background: #43A047;
}

/* 音量按钮 */
.volume-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #666;
}

.volume-btn:hover {
  background: #fff;
  color: #4A90E2;
}

.volume-btn.is-active {
  background: #4A90E2;
  border-color: #4A90E2;
  color: white;
}

.volume-btn.is-active:hover {
  background: #3a7bc8;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
