/**
 * 星星评级工具函数
 * 统一游戏结算和历史记录的评级标准
 */

/**
 * 根据正确率计算星星数量
 * @param {number} accuracy - 正确率 (0-100)
 * @returns {number} 星星数量 (0-3)
 */
export function getStarCount(accuracy) {
  if (accuracy === 100) return 3  // 完美通关
  if (accuracy >= 80) return 2    // 优秀
  if (accuracy >= 60) return 1    // 及格
  return 0                        // 不及格
}

/**
 * 获取评级文案
 * @param {number} accuracy - 正确率 (0-100)
 * @returns {string} 评级文案
 */
export function getRatingText(accuracy) {
  if (accuracy === 100) return '🏆 完美！'
  if (accuracy >= 80) return '⭐ 优秀！'
  if (accuracy >= 60) return '👍 不错！'
  return '💪 继续加油！'
}

/**
 * 获取庆祝表情
 * @param {number} accuracy - 正确率 (0-100)
 * @returns {string} 表情符号
 */
export function getCelebrationEmoji(accuracy) {
  if (accuracy === 100) return '🎉'
  if (accuracy >= 80) return '👏'
  if (accuracy >= 60) return '💪'
  return '📚'
}
