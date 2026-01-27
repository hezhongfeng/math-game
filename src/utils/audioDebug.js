/**
 * 音频调试日志系统
 * 用于追踪和诊断音频相关问题，特别是 iOS Safari 兼容性问题
 */

// 日志级别
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  SUCCESS: 'success'
}

// 日志类别
const LOG_CATEGORIES = {
  CONTEXT: 'context',           // AudioContext 相关
  PLAY: 'play',                 // 音效播放
  USER_INTERACTION: 'user-interaction', // 用户交互
  STATE: 'state',               // 状态变化
  ERROR: 'error',               // 错误
  DIAGNOSTIC: 'diagnostic'      // 诊断信息
}

// 调试状态
let debugMode = false
let maxLogEntries = 500

// 日志存储
const logs = []

// 环境信息缓存
let environmentInfo = null

// 用户交互记录
let userInteractionRecord = {
  detected: false,
  firstInteractionTime: null,
  lastInteractionTime: null,
  interactionCount: 0
}

/**
 * 初始化调试模式
 * 检查 URL 参数或环境变量
 */
function initDebugMode() {
  const urlParams = new URLSearchParams(window.location.search)
  const debugParam = urlParams.get('audioDebug') || urlParams.get('debug')
  
  if (debugParam === 'true' || debugParam === 'audio') {
    enableDebugMode(true)
  }
  
  // 开发环境默认启用
  if (import.meta.env?.DEV) {
    enableDebugMode(true)
  }
}

/**
 * 启用或禁用调试模式
 * @param {boolean} enabled - 是否启用
 */
export function enableDebugMode(enabled) {
  debugMode = enabled
  if (enabled) {
    console.log('%c[音频调试] 调试模式已启用', 'color: #2196F3; font-weight: bold')
    logDiagnostics()
  }
}

/**
 * 获取当前调试模式状态
 * @returns {boolean}
 */
export function isDebugMode() {
  return debugMode
}

/**
 * 收集浏览器环境信息
 * @returns {object}
 */
function getEnvironmentInfo() {
  if (environmentInfo) {
    return environmentInfo
  }
  
  const ua = navigator.userAgent
  environmentInfo = {
    userAgent: ua,
    platform: navigator.platform,
    vendor: navigator.vendor,
    isIOS: /iPad|iPhone|iPod/.test(ua) && !window.MSStream,
    isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
    safariVersion: null,
    iOSVersion: null
  }
  
  // 提取 Safari 版本
  const safariMatch = ua.match(/Version\/(\d+\.\d+)/)
  if (safariMatch) {
    environmentInfo.safariVersion = safariMatch[1]
  }
  
  // 提取 iOS 版本
  const iosMatch = ua.match(/OS (\d+_\d+)/)
  if (iosMatch) {
    environmentInfo.iOSVersion = iosMatch[1].replace('_', '.')
  }
  
  return environmentInfo
}

/**
 * 捕获当前音频状态
 * @param {AudioContext} ctx - AudioContext 实例
 * @returns {object}
 */
export function captureAudioState(ctx = null) {
  const env = getEnvironmentInfo()
  
  let audioContextInfo = {
    exists: false,
    state: 'unknown',
    sampleRate: null,
    baseLatency: null
  }
  
  if (ctx) {
    audioContextInfo = {
      exists: true,
      state: ctx.state,
      sampleRate: ctx.sampleRate,
      baseLatency: ctx.baseLatency,
      currentTime: ctx.currentTime
    }
  }
  
  return {
    audioContext: audioContextInfo,
    userInteraction: { ...userInteractionRecord },
    environment: env
  }
}

/**
 * 记录用户交互
 * @param {string} eventType - 事件类型
 */
export function recordUserInteraction(eventType) {
  const now = Date.now()
  
  if (!userInteractionRecord.detected) {
    userInteractionRecord.detected = true
    userInteractionRecord.firstInteractionTime = now
    logAudioEvent(
      LOG_LEVELS.INFO,
      LOG_CATEGORIES.USER_INTERACTION,
      `首次用户交互: ${eventType}`,
      { timestamp: now }
    )
  }
  
  userInteractionRecord.lastInteractionTime = now
  userInteractionRecord.interactionCount++
  
  logAudioEvent(
    LOG_LEVELS.DEBUG,
    LOG_CATEGORIES.USER_INTERACTION,
    `用户交互: ${eventType}`,
    {
      timestamp: now,
      count: userInteractionRecord.interactionCount
    }
  )
}

/**
 * 记录音频事件
 * @param {string} level - 日志级别
 * @param {string} category - 日志类别
 * @param {string} message - 日志消息
 * @param {object} data - 附加数据
 */
export function logAudioEvent(level, category, message, data = {}) {
  const logEntry = {
    id: generateLogId(),
    timestamp: Date.now(),
    level,
    category,
    message,
    data,
    state: null
  }
  
  // 捕获当前状态 - 延迟导入避免循环依赖
  try {
    // 使用动态 import
    import('./audioContext.js').then(module => {
      const ctx = module.getAudioContext()
      logEntry.state = captureAudioState(ctx)
    }).catch(() => {
      // AudioContext 不可用，忽略
    })
  } catch (error) {
    // 导入失败，忽略
  }
  
  // 添加到日志存储
  logs.push(logEntry)
  
  // 限制日志数量
  if (logs.length > maxLogEntries) {
    logs.shift()
  }
  
  // 调试模式下输出到控制台
  if (debugMode) {
    outputToConsole(logEntry)
  }
  
  return logEntry.id
}

/**
 * 输出日志到控制台
 * @param {object} logEntry - 日志条目
 */
function outputToConsole(logEntry) {
  const { level, category, message, data, timestamp, state } = logEntry
  const timeStr = new Date(timestamp).toISOString().split('T')[1].slice(0, -1)
  
  let style = ''
  let prefix = ''
  
  switch (level) {
    case LOG_LEVELS.DEBUG:
      style = 'color: #9E9E9E'
      prefix = '🔍'
      break
    case LOG_LEVELS.INFO:
      style = 'color: #2196F3'
      prefix = 'ℹ️'
      break
    case LOG_LEVELS.WARN:
      style = 'color: #FF9800'
      prefix = '⚠️'
      break
    case LOG_LEVELS.ERROR:
      style = 'color: #F44336'
      prefix = '❌'
      break
    case LOG_LEVELS.SUCCESS:
      style = 'color: #4CAF50'
      prefix = '✅'
      break
  }
  
  console.groupCollapsed(
    `%c[音频调试] ${timeStr} ${prefix} [${category.toUpperCase()}] ${message}`,
    style
  )
  
  if (Object.keys(data).length > 0) {
    console.log('数据:', data)
  }
  
  if (state) {
    console.log('音频状态:', {
      context: state.audioContext,
      userInteraction: state.userInteraction,
      platform: state.environment.platform,
      browser: state.environment.isIOS ? 'iOS' : 'Other',
      safari: state.environment.isSafari ? `Safari ${state.environment.safariVersion}` : 'Other'
    })
  }
  
  console.groupEnd()
}

/**
 * 获取诊断信息
 * @returns {object}
 */
export function getAudioDiagnostics() {
  // 延迟导入避免循环依赖
  let ctx = null
  try {
    // 这里不能直接 import，因为会导致循环依赖
    // 改为捕获状态时不依赖 audioContext
    // 如果 audioContext 可用，它会在其他地方被传入
  } catch (error) {
    // 忽略错误
  }
  
  return {
    timestamp: Date.now(),
    debugMode,
    state: captureAudioState(ctx),
    recentLogs: logs.slice(-20).reverse(), // 最近的20条日志
    totalLogs: logs.length,
    userInteraction: { ...userInteractionRecord }
  }
}

/**
 * 记录完整的诊断信息
 */
export function logDiagnostics() {
  const diagnostics = getAudioDiagnostics()
  
  console.group('%c[音频诊断] 完整诊断信息', 'color: #2196F3; font-weight: bold; font-size: 14px')
  
  console.log('调试模式:', diagnostics.debugMode ? '✅ 已启用' : '❌ 未启用')
  console.log('日志总数:', diagnostics.totalLogs)
  
  console.group('📱 环境信息')
  console.log('平台:', diagnostics.state.environment.platform)
  console.log('iOS:', diagnostics.state.environment.isIOS ? `是 (${diagnostics.state.environment.iOSVersion})` : '否')
  console.log('Safari:', diagnostics.state.environment.isSafari ? `是 (${diagnostics.state.environment.safariVersion})` : '否')
  console.groupEnd()
  
  console.group('🎵 AudioContext')
  if (diagnostics.state.audioContext.exists) {
    console.log('状态:', diagnostics.state.audioContext.state)
    console.log('采样率:', diagnostics.state.audioContext.sampleRate)
    console.log('延迟:', diagnostics.state.audioContext.baseLatency)
  } else {
    console.log('状态: ❌ 未创建')
  }
  console.groupEnd()
  
  console.group('👆 用户交互')
  console.log('已检测:', diagnostics.userInteraction.detected ? '✅ 是' : '❌ 否')
  if (diagnostics.userInteraction.firstInteractionTime) {
    console.log('首次交互时间:', new Date(diagnostics.userInteraction.firstInteractionTime).toISOString())
    console.log('最近交互时间:', new Date(diagnostics.userInteraction.lastInteractionTime).toISOString())
    console.log('交互次数:', diagnostics.userInteraction.interactionCount)
  }
  console.groupEnd()
  
  console.group('📝 最近日志 (20条)')
  diagnostics.recentLogs.forEach(log => {
    const icon = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅'
    }[log.level]
    
    const time = new Date(log.timestamp).toISOString().split('T')[1].slice(0, -1)
    console.log(`${time} ${icon} [${log.category}] ${log.message}`)
  })
  console.groupEnd()
  
  console.groupEnd()
}

/**
 * 导出所有日志
 * @returns {string} JSON 格式的日志
 */
export function exportDebugLogs() {
  const diagnostics = getAudioDiagnostics()
  
  return JSON.stringify({
    exportTime: new Date().toISOString(),
    diagnostics,
    allLogs: logs
  }, null, 2)
}

/**
 * 清除所有日志
 */
export function clearLogs() {
  logs.length = 0
  userInteractionRecord = {
    detected: false,
    firstInteractionTime: null,
    lastInteractionTime: null,
    interactionCount: 0
  }
  
  console.log('%c[音频调试] 日志已清除', 'color: #FF9800')
}

/**
 * 获取所有日志
 * @returns {Array}
 */
export function getAllLogs() {
  return [...logs]
}

/**
 * 生成唯一日志ID
 * @returns {string}
 */
function generateLogId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 导出常量
 */
export { LOG_LEVELS, LOG_CATEGORIES }

// 初始化调试模式
initDebugMode()

// 监听 URL 参数变化（用于动态启用调试模式）
window.addEventListener('popstate', initDebugMode)
window.addEventListener('hashchange', initDebugMode)
