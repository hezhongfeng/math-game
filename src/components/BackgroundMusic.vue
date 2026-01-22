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
const volume = ref(0.3) // 默认音量30%
const showVolumeControl = ref(false)
const volumeControlRef = ref(null)

// 音量等级图标
const volumeIcon = computed(() => {
  if (volume.value === 0) return VolumeX
  if (volume.value < 0.5) return Volume1
  return Volume2
})

// 创建音频上下文和音频元素
let audioContext = null
let audioBuffer = null
let sourceNode = null
let gainNode = null

// 生成欢快的背景音乐（明亮的大调进行 + 活泼旋律）
function createBackgroundMusic() {
  if (!audioContext) return

  const duration = 6 // 6秒循环，更快节奏
  const sampleRate = audioContext.sampleRate
  const buffer = audioContext.createBuffer(2, duration * sampleRate, sampleRate)

  // 明亮的和弦进行: C - F - G - C (I-IV-V-I 非常欢快)
  const chords = [
    { freq: [261.63, 329.63, 392.00], time: 0 },    // C
    { freq: [349.23, 440.00, 523.25], time: 1.5 },  // F
    { freq: [392.00, 493.88, 587.33], time: 3 },    // G
    { freq: [261.63, 329.63, 392.00], time: 4.5 }   // C
  ]

  // 活泼的旋律音符
  const melody = [
    { freq: 523.25, time: 0.2 },    // C5
    { freq: 587.33, time: 0.5 },    // D5
    { freq: 659.25, time: 0.8 },    // E5
    { freq: 523.25, time: 1.2 },    // C5
    { freq: 783.99, time: 1.7 },    // G5
    { freq: 659.25, time: 2.0 },    // E5
    { freq: 523.25, time: 2.5 },    // C5
    { freq: 440.00, time: 3.2 },    // A4
    { freq: 493.88, time: 3.5 },    // B4
    { freq: 523.25, time: 3.8 },    // C5
    { freq: 587.33, time: 4.2 },    // D5
    { freq: 659.25, time: 4.7 },    // E5
    { freq: 698.46, time: 5.0 },    // F5
    { freq: 659.25, time: 5.3 },    // E5
    { freq: 523.25, time: 5.6 },    // C5
  ]

  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel)

    // 播放和弦（背景）
    chords.forEach(chord => {
      const startSample = Math.floor(chord.time * sampleRate)
      const endSample = Math.floor((chord.time + 1.4) * sampleRate)

      for (let i = startSample; i < endSample && i < channelData.length; i++) {
        let sample = 0

        chord.freq.forEach((freq, index) => {
          const amplitude = 0.08 / (index + 1)
          sample += Math.sin(2 * Math.PI * freq * i / sampleRate) * amplitude
        })

        // 更活泼的包络 - 快速起音，轻柔衰减
        const t = (i - startSample) / sampleRate
        const envelope = Math.exp(-t * 0.8) * (0.5 + 0.5 * Math.sin(t * Math.PI * 3))
        channelData[i] += sample * envelope
      }
    })

    // 播放旋律（前景）
    melody.forEach(note => {
      const startSample = Math.floor(note.time * sampleRate)
      const noteDuration = 0.25 // 每个音符的持续时间

      for (let i = startSample; i < startSample + noteDuration * sampleRate && i < channelData.length; i++) {
        const t = (i - startSample) / sampleRate
        // 欢快的旋律包络 - 短促清脆
        const envelope = Math.exp(-t * 5) * (1 - t * 0.3)
        const sample = Math.sin(2 * Math.PI * note.freq * i / sampleRate) * 0.15
        channelData[i] += sample * envelope
      }
    })
  }

  return buffer
}

// 播放背景音乐
function play() {
  if (!props.enabled || !audioBuffer || !audioContext) return

  try {
    // 停止之前的播放
    if (sourceNode) {
      sourceNode.stop()
      sourceNode.disconnect()
    }

    // 创建新的音频源
    sourceNode = audioContext.createBufferSource()
    sourceNode.buffer = audioBuffer
    sourceNode.loop = true

    // 创建增益节点控制音量
    gainNode = audioContext.createGain()
    gainNode.gain.value = volume.value

    // 连接音频节点
    sourceNode.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // 开始播放
    sourceNode.start()
    isPlaying.value = true
  } catch (error) {
    console.warn('背景音乐播放失败:', error)
  }
}

// 暂停背景音乐
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

// 切换播放状态
function togglePlay() {
  playSound('click')
  emit('toggle', !isPlaying.value)
  
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

// 设置音量
function setVolume(newVolume) {
  volume.value = Math.max(0, Math.min(1, newVolume))
  emit('volumeChange', volume.value)
  
  if (gainNode) {
    gainNode.gain.value = volume.value
  }
}

// 调整音量
function adjustVolume(delta) {
  const newVolume = volume.value + delta
  setVolume(newVolume)
}

// 点击外部关闭音量控制
function handleClickOutside(event) {
  if (volumeControlRef.value && !volumeControlRef.value.contains(event.target)) {
    showVolumeControl.value = false
  }
}

// 监听音量变化
watch(volume, (newVolume) => {
  if (gainNode) {
    gainNode.gain.value = newVolume
  }
})

// 监听启用状态变化
watch(() => props.enabled, (enabled) => {
  if (enabled && !isPlaying.value) {
    play()
  } else if (!enabled && isPlaying.value) {
    pause()
  }
})

onMounted(() => {
  // 初始化音频上下文
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    audioBuffer = createBackgroundMusic()
    
    // 自动开始播放
    if (props.enabled) {
      play()
    }
  } catch (error) {
    console.warn('音频上下文初始化失败:', error)
  }

  // 监听点击事件
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  pause()
  
  if (audioContext) {
    audioContext.close()
  }
  
  document.removeEventListener('click', handleClickOutside)
})

// 暴露方法给父组件
defineExpose({
  play,
  pause,
  setVolume
})
</script>

<template>
  <div class="music-control fixed bottom-6 right-6 z-50" ref="volumeControlRef">
    <!-- 音量控制面板 -->
    <Transition name="slide-up">
      <div v-if="showVolumeControl" class="volume-panel absolute bottom-20 right-0 bg-white rounded-cute-xl shadow-cute-lg border-4 border-peppa-blue-light p-5 w-52">
        <div class="flex items-center gap-3 mb-4">
          <div class="icon-bg bg-peppa-blue/10 rounded-full p-2">
            <component :is="volumeIcon" :size="22" class="text-peppa-blue-dark" />
          </div>
          <span class="text-lg font-bold text-peppa-blue-dark font-rounded">
            {{ Math.round(volume * 100) }}%
          </span>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          :value="volume * 100"
          @input="setVolume($event.target.value / 100)"
          class="w-full h-3 bg-peppa-blue-light/30 rounded-cute-lg appearance-none cursor-pointer slider"
        >
        
        <div class="flex justify-between text-xs text-peppa-blue-dark/70 mt-3 font-rounded font-medium">
          <span>静音</span>
          <span>最大</span>
        </div>
      </div>
    </Transition>

    <!-- 音乐控制按钮 -->
    <div class="button-group flex gap-3">
      <!-- 音量按钮 -->
      <button
        @click="showVolumeControl = !showVolumeControl"
        class="control-btn bg-white rounded-cute-full shadow-cute-lg hover:shadow-cute-xl active:scale-95 transition-all duration-300 p-4 border-4"
        :class="[showVolumeControl ? 'bg-peppa-blue/20 border-peppa-blue' : 'border-peppa-blue-light/50']"
        title="音量控制"
      >
        <component 
          :is="volumeIcon" 
          :size="26" 
           :class="volume > 0 ? 'text-peppa-blue-dark animate-float' : 'text-gray-400'"
           style="animation-duration: 3s"
        />
      </button>
      
      <!-- 播放/暂停按钮 -->
      <button
        @click="togglePlay"
        class="control-btn bg-white rounded-cute-full shadow-cute-lg hover:shadow-cute-xl active:scale-95 transition-all duration-300 p-4 border-4"
        :class="[props.enabled && isPlaying ? 'bg-peppa-green/20 border-peppa-green' : 'border-peppa-blue-light/50']"
        :title="props.enabled && isPlaying ? '暂停音乐' : '播放音乐'"
      >
        <Music 
          :size="26" 
          :class="props.enabled && isPlaying ? 'text-peppa-green animate-float' : 'text-gray-400'"
          style="animation-duration: 3s"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 音量面板滑入动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

/* 控制按钮基础样式 */
.control-btn {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.control-btn:hover {
  transform: translateY(-3px);
}

/* 音量面板样式 */
.volume-panel {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.icon-bg {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #4A90E2, #2A70C2);
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.5);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #4A90E2, #2A70C2);
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
}
</style>
