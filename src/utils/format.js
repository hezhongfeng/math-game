/**
 * 时间格式化工具函数
 */

/**
 * 格式化秒数为 M:SS 格式
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(seconds) {
  const duration = Math.max(0, Math.floor(seconds || 0))
  const minutes = Math.floor(duration / 60)
  const secs = duration % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * 格式化秒数为 MM:SS 格式（始终显示两位分钟）
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatTimePad(minutes) {
  const duration = Math.max(0, Math.floor(minutes || 0))
  const mins = Math.floor(duration / 60)
  const secs = duration % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
