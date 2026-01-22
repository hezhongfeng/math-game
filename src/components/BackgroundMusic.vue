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
  <div class="music-control" ref="volumeControlRef">
    <!-- 音量控制面板 -->
    <Transition name="slide-up">
      <div v-if="showVolumeControl" class="volume-panel">
        <div class="volume-header">
          <div class="volume-icon-bg">
            <component :is="volumeIcon" :size="20" class="volume-icon" />
          </div>
          <span class="volume-text">{{ Math.round(volume * 100) }}%</span>
        </div>
        
        <div class="volume-slider-container">
          <input
            type="range"
            min="0"
            max="100"
            :value="volume * 100"
            @input="setVolume($event.target.value / 100)"
            class="volume-slider"
          >
        </div>
        
        <div class="volume-labels">
          <span>🔇</span>
          <span>🔊</span>
        </div>
      </div>
    </Transition>

    <!-- 音乐控制按钮 -->
    <button
      @click="togglePlay"
      class="music-btn"
      :class="[props.enabled && isPlaying ? 'music-btn-active' : 'music-btn-inactive']"
      :title="props.enabled && isPlaying ? '暂停音乐' : '播放音乐'"
    >
      <Music :size="28" />
    </button>
    
    <!-- 音量按钮 -->
    <button
      @click="showVolumeControl = !showVolumeControl"
      class="volume-btn"
      :class="[showVolumeControl ? 'volume-btn-active' : 'volume-btn-inactive']"
      title="音量控制"
    >
      <component 
        :is="volumeIcon" 
        :size="28"
      />
    </button>
  </div>
</template>

<style scoped>
.music-control {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-direction: column;
}

/* 音量面板样式 */
.volume-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  background: linear-gradient(135deg, #fff 0%, #F5F9FF 100%);
  border-radius: 24px;
  padding: 16px 20px;
  width: 160px;
  box-shadow: 
    0 8px 30px rgba(74, 144, 226, 0.2),
    0 4px 15px rgba(74, 144, 226, 0.1);
  border: 3px solid rgba(74, 144, 226, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin-bottom: 8px;
  animation: panelBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes panelBounce {
  0% { opacity: 0; transform: translateY(10px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.volume-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.volume-icon-bg {
  background: linear-gradient(135deg, #7AB8FF 0%, #4A90E2 100%);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 3px 0 rgba(42, 112, 194, 0.3),
    0 4px 10px rgba(74, 144, 226, 0.3);
}

.volume-icon {
  color: white;
}

.volume-text {
  font-size: 18px;
  font-weight: 700;
  color: #2A70C2;
  font-family: inherit;
}

.volume-slider-container {
  background: #E3F2FD;
  border-radius: 12px;
  padding: 6px 8px;
  margin-bottom: 10px;
}

.volume-slider {
  width: 100%;
  height: 8px;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #4A90E2 0%, #2A70C2 100%);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 
    0 3px 0 rgba(42, 112, 194, 0.4),
    0 4px 8px rgba(74, 144, 226, 0.4);
  transition: all 0.15s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 4px 0 rgba(42, 112, 194, 0.4),
    0 6px 12px rgba(74, 144, 226, 0.5);
}

.volume-slider::-webkit-slider-thumb:active {
  transform: translateY(1px);
  box-shadow: 
    0 1px 0 rgba(42, 112, 194, 0.4),
    0 2px 6px rgba(74, 144, 226, 0.3);
}

.volume-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #4A90E2 0%, #2A70C2 100%);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 
    0 3px 0 rgba(42, 112, 194, 0.4),
    0 4px 8px rgba(74, 144, 226, 0.4);
}

.volume-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #4A90E2;
  opacity: 0.7;
}

/* 音乐按钮 - 3D效果 */
.music-btn {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.15s ease;
  cursor: pointer;
}

.music-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(180deg, rgba(255,255,255,0.4), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* 激活状态 - 绿色 */
.music-btn-active {
  background: linear-gradient(180deg, #66BB6A 0%, #4CAF50 50%, #388E3C 100%);
  box-shadow: 
    0 6px 0 rgba(56, 142, 60, 0.5),
    0 8px 20px rgba(76, 175, 80, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
}

.music-btn-active:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 0 rgba(56, 142, 60, 0.5),
    0 12px 30px rgba(76, 175, 80, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.music-btn-active:active {
  transform: translateY(3px);
  box-shadow: 
    0 3px 0 rgba(56, 142, 60, 0.5),
    0 5px 15px rgba(76, 175, 80, 0.3),
    inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 未激活状态 - 蓝色 */
.music-btn-inactive {
  background: linear-gradient(180deg, #7AB8FF 0%, #4A90E2 50%, #2A70C2 100%);
  box-shadow: 
    0 6px 0 rgba(42, 112, 194, 0.5),
    0 8px 20px rgba(74, 144, 226, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
}

.music-btn-inactive:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 0 rgba(42, 112, 194, 0.5),
    0 12px 30px rgba(74, 144, 226, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.music-btn-inactive:active {
  transform: translateY(3px);
  box-shadow: 
    0 3px 0 rgba(42, 112, 194, 0.5),
    0 5px 15px rgba(74, 144, 226, 0.3),
    inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 音量按钮 - 3D效果 */
.volume-btn {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.15s ease;
  cursor: pointer;
}

.volume-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(180deg, rgba(255,255,255,0.4), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* 激活状态 - 蓝色 */
.volume-btn-active {
  background: linear-gradient(180deg, #7AB8FF 0%, #4A90E2 50%, #2A70C2 100%);
  box-shadow: 
    0 6px 0 rgba(42, 112, 194, 0.5),
    0 8px 20px rgba(74, 144, 226, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
}

.volume-btn-active:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 0 rgba(42, 112, 194, 0.5),
    0 12px 30px rgba(74, 144, 226, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.volume-btn-active:active {
  transform: translateY(3px);
  box-shadow: 
    0 3px 0 rgba(42, 112, 194, 0.5),
    0 5px 15px rgba(74, 144, 226, 0.3),
    inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 未激活状态 - 浅蓝色 */
.volume-btn-inactive {
  background: linear-gradient(180deg, #B3D4FF 0%, #7AB8FF 50%, #4A90E2 100%);
  box-shadow: 
    0 6px 0 rgba(42, 112, 194, 0.3),
    0 8px 20px rgba(74, 144, 226, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border: none;
  color: #2A70C2;
}

.volume-btn-inactive:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 0 rgba(42, 112, 194, 0.4),
    0 12px 30px rgba(74, 144, 226, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.volume-btn-inactive:active {
  transform: translateY(3px);
  box-shadow: 
    0 3px 0 rgba(42, 112, 194, 0.3),
    0 5px 15px rgba(74, 144, 226, 0.2),
    inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 滑入动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.9);
}
</style>
