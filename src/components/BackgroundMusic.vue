<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Music, Volume2, VolumeX, Volume1 } from 'lucide-vue-next'
import { useSound } from '../composables/useSound'
import { useSettingsStore } from '../stores/settings'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: false
  }
})

const { playSound } = useSound()
const settingsStore = useSettingsStore()
const isPlaying = ref(false)
const showVolumeControl = ref(false)
const volumeControlRef = ref(null)

const volumeValue = computed(() => settingsStore.musicVolume || 0.8)

const volumeIcon = computed(() => {
  const vol = settingsStore.musicVolume || 0.8
  if (vol === 0) return VolumeX
  if (vol < 0.5) return Volume1
  return Volume2
})

let audioContext = null
let audioBuffer = null
let sourceNode = null
let gainNode = null
let isAudioContextInitialized = false

function createBackgroundMusic() {
  if (!audioContext) return

  const duration = 8 // 8秒循环，两段体
  const sampleRate = audioContext.sampleRate
  const buffer = audioContext.createBuffer(2, duration * sampleRate, sampleRate)

  // A段 - 明亮上升 (前4秒)
  const partA = [
    { freq: 523.25, time: 0.0, dur: 0.5 },   // C5
    { freq: 523.25, time: 0.5, dur: 0.5 },   // C5
    { freq: 783.99, time: 1.0, dur: 0.5 },   // G5
    { freq: 783.99, time: 1.5, dur: 0.5 },   // G5
    { freq: 880.00, time: 2.0, dur: 0.5 },   // A5
    { freq: 880.00, time: 2.5, dur: 0.5 },   // A5
    { freq: 783.99, time: 3.0, dur: 0.5 },   // G5
    { freq: 698.46, time: 3.5, dur: 0.5 },   // F5
  ]

  // B段 - 柔和下落 (后4秒)
  const partB = [
    { freq: 659.25, time: 4.0, dur: 0.5 },   // E5
    { freq: 659.25, time: 4.5, dur: 0.5 },   // E5
    { freq: 587.33, time: 5.0, dur: 0.5 },   // D5
    { freq: 587.33, time: 5.5, dur: 0.5 },   // D5
    { freq: 523.25, time: 6.0, dur: 0.5 },   // C5
    { freq: 523.25, time: 6.5, dur: 0.5 },   // C5
    { freq: 659.25, time: 7.0, dur: 0.5 },   // E5
    { freq: 523.25, time: 7.5, dur: 0.5 },   // C5
  ]

  // 简单的低音
  const bass = [
    { freq: 196.00, time: 0 },   // G3
    { freq: 196.00, time: 1 },   // G3
    { freq: 220.00, time: 2 },   // A3
    { freq: 220.00, time: 3 },   // A3
    { freq: 196.00, time: 4 },   // G3
    { freq: 196.00, time: 5 },   // G3
    { freq: 164.81, time: 6 },   // E3
    { freq: 196.00, time: 7 },   // G3
  ]

  const melody = [...partA, ...partB]

  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel)

    // 主旋律
    melody.forEach(note => {
      const startSample = Math.floor(note.time * sampleRate)
      const noteDuration = Math.floor(note.dur * sampleRate)

      for (let i = startSample; i < startSample + noteDuration && i < channelData.length; i++) {
        const t = (i - startSample) / sampleRate
        
        const envelope = Math.exp(-t * 2.5) * (1 - t * 0.15)
        const sample = Math.sin(2 * Math.PI * note.freq * i / sampleRate) * 0.15 * envelope
        
        channelData[i] += sample
      }
    })

    // 低音伴奏
    bass.forEach(note => {
      const startSample = Math.floor(note.time * sampleRate)
      const noteDur = 1.0

      for (let i = startSample; i < startSample + noteDur * sampleRate && i < channelData.length; i++) {
        const t = (i - startSample) / sampleRate
        const envelope = Math.exp(-t * 1.2)
        const sample = Math.sin(2 * Math.PI * note.freq * i / sampleRate) * 0.06 * envelope
        const sample2 = Math.sin(2 * Math.PI * note.freq * 2 * i / sampleRate) * 0.03 * envelope
        
        channelData[i] += sample + sample2
      }
    })
  }

  return buffer
}

async function play() {
  if (!props.enabled || !audioBuffer || !audioContext) return

  try {
    // 确保 AudioContext 已恢复（移动端需要用户交互）
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    if (sourceNode) {
      sourceNode.stop()
      sourceNode.disconnect()
    }

    sourceNode = audioContext.createBufferSource()
    sourceNode.buffer = audioBuffer
    sourceNode.loop = true

    gainNode = audioContext.createGain()
    gainNode.gain.value = 0 // 初始音量为0，用于淡入

    sourceNode.connect(gainNode)
    gainNode.connect(audioContext.destination)

    sourceNode.start()
    isPlaying.value = true

    // 快速淡入
    gainNode.gain.linearRampToValueAtTime(settingsStore.musicVolume, audioContext.currentTime + 0.3)
  } catch (error) {
    console.warn('背景音乐播放失败:', error)
  }
}

function pause() {
  if (sourceNode && isPlaying.value) {
    try {
      // 快速淡出
      if (gainNode) {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2)
      }
      
      setTimeout(() => {
        if (sourceNode) {
          sourceNode.stop()
          sourceNode.disconnect()
        }
        isPlaying.value = false
      }, 250)
    } catch (error) {
      console.warn('背景音乐暂停失败:', error)
    }
  }
}

async function togglePlay() {
  playSound('click')
  
  // 首次点击时初始化 AudioContext
  if (!isAudioContextInitialized) {
    await initAudioContext()
  }
  
  // 切换播放状态
  if (isPlaying.value) {
    pause()
  } else {
    await play()
  }
  
  // 同步更新 store 中的音乐开关状态
  settingsStore.toggleMusic()
}

function setVolume(newVolume) {
  settingsStore.musicVolume = Math.max(0, Math.min(1, newVolume))
  
  if (gainNode) {
    gainNode.gain.value = settingsStore.musicVolume
  }
}

async function initAudioContext() {
  if (isAudioContextInitialized) return true
  
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // 如果 AudioContext 被暂停，尝试恢复
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }
    
    audioBuffer = createBackgroundMusic()
    isAudioContextInitialized = true
    
    console.log('AudioContext 初始化成功，状态:', audioContext.state)
    return true
  } catch (error) {
    console.warn('音频上下文初始化失败:', error)
    return false
  }
}

function handleClickOutside(event) {
  if (volumeControlRef.value && !volumeControlRef.value.contains(event.target)) {
    showVolumeControl.value = false
  }
}

// 监听 store 音量变化
watch(() => settingsStore.musicVolume, (newVolume) => {
  if (gainNode) {
    gainNode.gain.value = newVolume
  }
})

watch(() => props.enabled, async (enabled) => {
  if (enabled && !isPlaying.value) {
    // 确保 AudioContext 已初始化
    if (!isAudioContextInitialized) {
      await initAudioContext()
    }
    await play()
  } else if (!enabled && isPlaying.value) {
    pause()
  }
})

onMounted(() => {
  // 在移动端不自动初始化 AudioContext，等待用户交互
  // 在桌面端尝试初始化（因为桌面端自动播放限制较少）
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  if (!isMobile) {
    initAudioContext().then(success => {
      if (success && props.enabled) {
        play()
      }
    })
  }

  document.addEventListener('click', handleClickOutside)
  
  // 添加全局用户交互监听器，用于初始化音频
  const handleFirstInteraction = async () => {
    if (!isAudioContextInitialized) {
      await initAudioContext()
      if (props.enabled && !isPlaying.value) {
        play()
      }
      // 移除监听器，只需要初始化一次
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('click', handleFirstInteraction)
    }
  }
  
  // 监听首次用户交互
  document.addEventListener('touchstart', handleFirstInteraction, { once: true })
  document.addEventListener('click', handleFirstInteraction, { once: true })
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
          <span class="volume-text">{{ Math.round((settingsStore.musicVolume || 0.8) * 100) }}%</span>
        </div>
        
        <div class="volume-slider-wrap">
          <input
            type="range"
            min="0"
            max="100"
            :value="(settingsStore.musicVolume || 0.8) * 100"
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
