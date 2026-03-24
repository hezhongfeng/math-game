/**
 * 星星评级工具函数
 * 统一游戏结算和历史记录的评级标准
 */

/**
 * 根据正确率计算星星数量
 * @param {number} accuracy - 正确率 (0-100)
 * @returns {number} 星星数量 (0-5)
 */
export function getStarCount(accuracy) {
  if (accuracy >= 98) return 5
  if (accuracy >= 90) return 4
  if (accuracy >= 80) return 3
  if (accuracy >= 70) return 2
  if (accuracy >= 60) return 1
  return 0
}

/**
 * 获取评级文案
 * @param {number} accuracy - 正确率 (0-100)
 * @returns {string} 评级文案
 */
export function getRatingText(accuracy) {
  if (accuracy >= 98) return '太棒了！'
  if (accuracy >= 90) return '非常优秀！'
  if (accuracy >= 80) return '表现很棒！'
  if (accuracy >= 70) return '进步明显！'
  if (accuracy >= 60) return '继续加油！'
  return '再接再厉！'
}

/**
 * 获取庆祝表情
 * @param {number} accuracy - 正确率 (0-100)
 * @returns {string} 表情符号
 */
export function getCelebrationEmoji(accuracy) {
  if (accuracy >= 98) return '🎉'
  if (accuracy >= 90) return '✨'
  if (accuracy >= 80) return '👏'
  if (accuracy >= 70) return '👍'
  if (accuracy >= 60) return '🙂'
  return '📚'
}
