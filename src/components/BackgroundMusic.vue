<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Music, Volume2, VolumeX, Volume1 } from 'lucide-vue-next'
import { useSound } from '../composables/useSound'
import { useSettingsStore } from '../stores/settings'
import { getAudioContext, closeAudioContext } from '../utils/audioContext'
import { createBackgroundMusicBuffer } from '../utils/audioSynthesis'
import { logAudioEvent, LOG_LEVELS, LOG_CATEGORIES } from '../utils/audioDebug'

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

let audioBuffer = null
let sourceNode = null
let gainNode = null

function createBackgroundMusic() {
  const ctx = getAudioContext()
  if (!ctx) {
    logAudioEvent(
      LOG_LEVELS.ERROR,
      LOG_CATEGORIES.PLAY,
      '背景音乐缓冲区创建失败：AudioContext 不存在'
    )
    return null
  }

  logAudioEvent(
    LOG_LEVELS.INFO,
    LOG_CATEGORIES.PLAY,
    '开始创建背景音乐缓冲区',
    { contextState: ctx.state }
  )

  const buffer = createBackgroundMusicBuffer(ctx)

  if (buffer) {
    logAudioEvent(
      LOG_LEVELS.SUCCESS,
      LOG_CATEGORIES.PLAY,
      '背景音乐缓冲区创建成功',
      { duration: buffer.duration, sampleRate: buffer.sampleRate, channels: buffer.numberOfChannels }
    )
  } else {
    logAudioEvent(
      LOG_LEVELS.ERROR,
      LOG_CATEGORIES.PLAY,
      '背景音乐缓冲区创建失败'
    )
  }

  return buffer
}

async function play() {
  if (!props.enabled || !audioBuffer) return
  const ctx = getAudioContext()
  if (!ctx) return

  logAudioEvent(LOG_LEVELS.INFO, LOG_CATEGORIES.PLAY, '开始播放背景音乐', { enabled: props.enabled })

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    if (sourceNode) {
      sourceNode.stop()
      sourceNode.disconnect()
    }

    sourceNode = ctx.createBufferSource()
    sourceNode.buffer = audioBuffer
    sourceNode.loop = true

    gainNode = ctx.createGain()
    gainNode.gain.value = 0

    sourceNode.connect(gainNode)
    gainNode.connect(ctx.destination)

    sourceNode.start()
    isPlaying.value = true

    gainNode.gain.linearRampToValueAtTime(settingsStore.musicVolume, ctx.currentTime + 0.3)

    logAudioEvent(LOG_LEVELS.SUCCESS, LOG_CATEGORIES.PLAY, '背景音乐播放成功')
  } catch (error) {
    logAudioEvent(LOG_LEVELS.ERROR, LOG_CATEGORIES.PLAY, '背景音乐播放失败', { error: error.message })
  }
}

function pause() {
  if (sourceNode && isPlaying.value) {
    logAudioEvent(LOG_LEVELS.INFO, LOG_CATEGORIES.PLAY, '暂停背景音乐')

    try {
      if (gainNode) {
        const ctx = getAudioContext()
        if (ctx) {
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2)
        }
      }

      setTimeout(() => {
        if (sourceNode) {
          sourceNode.stop()
          sourceNode.disconnect()
        }
        isPlaying.value = false
        logAudioEvent(LOG_LEVELS.SUCCESS, LOG_CATEGORIES.PLAY, '背景音乐暂停成功')
      }, 250)
    } catch (error) {
      logAudioEvent(LOG_LEVELS.ERROR, LOG_CATEGORIES.PLAY, '背景音乐暂停失败', { error: error.message })
    }
  }
}

async function togglePlay() {
  playSound('click')

  logAudioEvent(LOG_LEVELS.INFO, LOG_CATEGORIES.PLAY, '用户切换背景音乐播放状态', { isPlaying: isPlaying.value })

  if (!audioBuffer) {
    audioBuffer = createBackgroundMusic()
  }

  if (isPlaying.value) {
    pause()
  } else {
    await play()
  }

  settingsStore.toggleMusic()
}

function setVolume(newVolume) {
  const volume = Math.max(0, Math.min(1, newVolume))
  settingsStore.musicVolume = volume

  logAudioEvent(LOG_LEVELS.DEBUG, LOG_CATEGORIES.PLAY, '设置背景音乐音量', { volume })

  if (gainNode) {
    gainNode.gain.value = volume
  }
}

watch(() => props.enabled, async (enabled) => {
  if (enabled && !isPlaying.value) {
    // 确保音频缓冲区已创建
    if (!audioBuffer) {
      audioBuffer = createBackgroundMusic()
    }
    await play()
  } else if (!enabled && isPlaying.value) {
    pause()
  }
})

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

onMounted(() => {
  // 在桌面端尝试初始化背景音乐缓冲区
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (!isMobile && props.enabled) {
    audioBuffer = createBackgroundMusic()
    play().catch(() => {
      // 初始化失败继续
    })
  }

  document.addEventListener('click', handleClickOutside)

  // 添加全局用户交互监听器，用于初始化音频
  const handleFirstInteraction = async () => {
    if (!audioBuffer) {
      audioBuffer = createBackgroundMusic()
      if (props.enabled) {
        await play()
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
  closeAudioContext()
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
