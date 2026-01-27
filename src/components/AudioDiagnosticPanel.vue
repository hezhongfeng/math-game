<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, Copy, Trash, Download, Minimize2, Maximize2, Volume2, Info, Smartphone, Globe } from 'lucide-vue-next'
import { getAudioDiagnostics, isDebugMode, clearLogs, exportDebugLogs } from '../utils/audioDebug'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const isMinimized = ref(false)
const diagnostics = ref(null)
const updateInterval = ref(null)

// 格式化时间戳
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const ms = String(date.getMilliseconds()).padStart(3, '0')
  return `${hours}:${minutes}:${seconds}.${ms}`
}

// 获取日志级别颜色
const getLogColor = (level) => {
  const colors = {
    debug: '#9E9E9E',
    info: '#2196F3',
    warn: '#FF9800',
    error: '#F44336',
    success: '#4CAF50'
  }
  return colors[level] || '#ffffff'
}

// 获取日志级别图标
const getLogIcon = (level) => {
  const icons = {
    debug: '🔍',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    success: '✅'
  }
  return icons[level] || '📝'
}

// 更新诊断信息
const updateDiagnostics = () => {
  diagnostics.value = getAudioDiagnostics()
}

// 复制诊断信息
const copyDiagnostics = async () => {
  const data = JSON.stringify(diagnostics.value, null, 2)
  try {
    await navigator.clipboard.writeText(data)
    alert('诊断信息已复制到剪贴板')
  } catch (error) {
    alert('复制失败: ' + error.message)
  }
}

// 导出完整日志
const exportLogs = () => {
  const data = exportDebugLogs()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audio-debug-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 清除日志
const clearAllLogs = () => {
  if (confirm('确定要清除所有日志吗？')) {
    clearLogs()
    updateDiagnostics()
  }
}

// 切换最小化/展开
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
}

// 状态指示器
const stateIndicator = computed(() => {
  if (!diagnostics.value?.state?.audioContext?.exists) {
    return { text: '未创建', color: '#F44336', icon: '❌' }
  }
  
  const state = diagnostics.value.state.audioContext.state
  switch (state) {
    case 'running':
      return { text: '运行中', color: '#4CAF50', icon: '✅' }
    case 'suspended':
      return { text: '已暂停', color: '#FF9800', icon: '⏸️' }
    case 'closed':
      return { text: '已关闭', color: '#F44336', icon: '🔴' }
    default:
      return { text: state, color: '#9E9E9E', icon: '❓' }
  }
})

// 用户交互指示器
const interactionIndicator = computed(() => {
  const detected = diagnostics.value?.userInteraction?.detected
  return {
    text: detected ? '已检测' : '未检测',
    color: detected ? '#4CAF50' : '#F44336',
    icon: detected ? '✅' : '❌'
  }
})

onMounted(() => {
  updateDiagnostics()
  // 每1秒更新一次诊断信息
  updateInterval.value = setInterval(updateDiagnostics, 1000)
})

onUnmounted(() => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value)
  }
})
</script>

<template>
  <Transition name="slide-in">
    <div v-if="show" class="audio-diagnostic-panel">
      <!-- 最小化状态 -->
      <div v-if="isMinimized" class="minimized-panel">
        <div class="minimized-content">
          <Volume2 :size="16" class="minimized-icon" />
          <span class="minimized-text">{{ diagnostics?.totalLogs || 0 }} 日志</span>
        </div>
        <button @click="toggleMinimize" class="minimize-btn" title="展开">
          <Maximize2 :size="16" />
        </button>
      </div>

      <!-- 完整面板 -->
      <div v-else class="full-panel">
        <!-- 标题栏 -->
        <div class="panel-header">
          <div class="header-title">
            <Volume2 :size="18" class="header-icon" />
            <span>音频诊断</span>
          </div>
          <div class="header-actions">
            <button @click="toggleMinimize" class="header-btn" title="最小化">
              <Minimize2 :size="16" />
            </button>
            <button @click="emit('close')" class="header-btn" title="关闭">
              <X :size="16" />
            </button>
          </div>
        </div>

        <!-- 状态区域 -->
        <div class="status-section">
          <!-- AudioContext 状态 -->
          <div class="status-card">
            <div class="card-header">
              <Info :size="14" class="card-icon" />
              <span class="card-title">AudioContext</span>
            </div>
            <div class="card-content">
              <div class="status-row">
                <span class="status-label">状态:</span>
                <span class="status-value" :style="{ color: stateIndicator.color }">
                  {{ stateIndicator.icon }} {{ stateIndicator.text }}
                </span>
              </div>
              <div v-if="diagnostics?.state?.audioContext?.exists" class="status-row">
                <span class="status-label">采样率:</span>
                <span class="status-value">{{ diagnostics.state.audioContext.sampleRate }} Hz</span>
              </div>
              <div v-if="diagnostics?.state?.audioContext?.exists" class="status-row">
                <span class="status-label">延迟:</span>
                <span class="status-value">{{ diagnostics.state.audioContext.baseLatency?.toFixed(3) || 'N/A' }} s</span>
              </div>
            </div>
          </div>

          <!-- 用户交互检测 -->
          <div class="status-card">
            <div class="card-header">
              <Smartphone :size="14" class="card-icon" />
              <span class="card-title">用户交互</span>
            </div>
            <div class="card-content">
              <div class="status-row">
                <span class="status-label">检测状态:</span>
                <span class="status-value" :style="{ color: interactionIndicator.color }">
                  {{ interactionIndicator.icon }} {{ interactionIndicator.text }}
                </span>
              </div>
              <div v-if="diagnostics?.userInteraction?.firstInteractionTime" class="status-row">
                <span class="status-label">首次交互:</span>
                <span class="status-value">{{ formatTime(diagnostics.userInteraction.firstInteractionTime) }}</span>
              </div>
              <div v-if="diagnostics?.userInteraction?.lastInteractionTime" class="status-row">
                <span class="status-label">最近交互:</span>
                <span class="status-value">{{ formatTime(diagnostics.userInteraction.lastInteractionTime) }}</span>
              </div>
              <div v-if="diagnostics?.userInteraction" class="status-row">
                <span class="status-label">交互次数:</span>
                <span class="status-value">{{ diagnostics.userInteraction.interactionCount }}</span>
              </div>
            </div>
          </div>

          <!-- 环境信息 -->
          <div class="status-card">
            <div class="card-header">
              <Globe :size="14" class="card-icon" />
              <span class="card-title">环境</span>
            </div>
            <div class="card-content">
              <div class="status-row">
                <span class="status-label">平台:</span>
                <span class="status-value">{{ diagnostics?.state?.environment?.platform || 'Unknown' }}</span>
              </div>
              <div class="status-row">
                <span class="status-label">iOS:</span>
                <span class="status-value">{{ diagnostics?.state?.environment?.isIOS ? diagnostics.state.environment.iOSVersion : '否' }}</span>
              </div>
              <div class="status-row">
                <span class="status-label">微信:</span>
                <span class="status-value" :style="{ color: diagnostics?.state?.environment?.isWeChat ? '#4CAF50' : '#F44336' }">
                  {{ diagnostics?.state?.environment?.isWeChat ? `是 (${diagnostics.state.environment.weChatVersion})` : '否' }}
                </span>
              </div>
              <div class="status-row">
                <span class="status-label">Safari:</span>
                <span class="status-value">{{ diagnostics?.state?.environment?.isSafari ? diagnostics.state.environment.safariVersion : '否' }}</span>
              </div>
              <div class="status-row">
                <span class="status-label">日志总数:</span>
                <span class="status-value">{{ diagnostics?.totalLogs || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 日志区域 -->
        <div class="logs-section">
          <div class="logs-header">
            <span>最近日志 ({{ diagnostics?.recentLogs?.length || 0 }})</span>
          </div>
          <div class="logs-container">
            <div v-if="diagnostics?.recentLogs?.length === 0" class="logs-empty">
              暂无日志
            </div>
            <div v-else class="logs-list">
              <div v-for="(log, index) in diagnostics?.recentLogs" :key="log.id || index" class="log-entry">
                <div class="log-header">
                  <span class="log-time">{{ formatTime(log.timestamp) }}</span>
                  <span class="log-level" :style="{ color: getLogColor(log.level) }">
                    {{ getLogIcon(log.level) }} {{ log.level }}
                  </span>
                  <span class="log-category">[{{ log.category }}]</span>
                </div>
                <div class="log-message">{{ log.message }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作区域 -->
        <div class="actions-section">
          <button @click="copyDiagnostics" class="action-btn copy-btn">
            <Copy :size="14" />
            <span>复制诊断信息</span>
          </button>
          <button @click="exportLogs" class="action-btn export-btn">
            <Download :size="14" />
            <span>导出完整日志</span>
          </button>
          <button @click="clearAllLogs" class="action-btn clear-btn">
            <Trash :size="14" />
            <span>清除日志</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.audio-diagnostic-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
}

/* 最小化面板 */
.minimized-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.minimized-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.minimized-icon {
  color: #2196F3;
}

.minimized-text {
  font-size: 13px;
  font-weight: 500;
}

.minimize-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.minimize-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 完整面板 */
.full-panel {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
}

/* 标题栏 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.header-icon {
  color: #2196F3;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* 状态区域 */
.status-section {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.status-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-icon {
  color: #2196F3;
}

.card-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.card-content {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.status-label {
  color: rgba(255, 255, 255, 0.6);
}

.status-value {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* 日志区域 */
.logs-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 200px;
  max-height: 300px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logs-header {
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logs-container {
  overflow-y: auto;
  flex: 1;
  max-height: 250px;
}

.logs-empty {
  padding: 30px 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.logs-list {
  display: flex;
  flex-direction: column;
}

.log-entry {
  padding: 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  font-size: 11px;
}

.log-entry:hover {
  background: rgba(255, 255, 255, 0.02);
}

.log-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.log-time {
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 10px;
}

.log-level {
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
}

.log-category {
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
}

.log-message {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  padding-left: 8px;
}

/* 操作区域 */
.actions-section {
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.action-btn:active {
  transform: scale(0.95);
}

/* 动画 */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-in-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 滚动条样式 */
.full-panel::-webkit-scrollbar,
.logs-container::-webkit-scrollbar {
  width: 6px;
}

.full-panel::-webkit-scrollbar-track,
.logs-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.full-panel::-webkit-scrollbar-thumb,
.logs-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.full-panel::-webkit-scrollbar-thumb:hover,
.logs-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .audio-diagnostic-panel {
    left: 10px;
    right: 10px;
    top: 10px;
  }

  .full-panel {
    width: 100%;
    max-height: 70vh;
  }
}
</style>
