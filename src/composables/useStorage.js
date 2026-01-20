import { useToast } from './useToast'

const STORAGE_KEY = 'math-game-data'

/**
 * 本地存储 Composable
 * 用于保存和读取游戏进度和最佳成绩
 */
export function useStorage() {
  const { error: showError } = useToast()
  // 从 localStorage 读取数据
  function loadData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : { bestScores: {}, progress: {} }
    } catch (error) {
      console.error('读取本地存储失败:', error)
      showError('读取游戏数据失败，请检查浏览器存储设置')
      return { bestScores: {}, progress: {} }
    }
  }
  
  // 保存数据到 localStorage
  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('保存到本地存储失败:', error)
      showError('保存游戏数据失败，存储空间可能已满')
    }
  }
  
  /**
   * 获取某个难度的最佳成绩
   * @param {number} difficultyId - 难度ID
   * @returns {Object|null} 最佳成绩对象
   */
  function getBestScore(difficultyId) {
    const data = loadData()
    return data.bestScores[difficultyId] || null
  }
  
  /**
   * 更新最佳成绩
   * @param {number} difficultyId - 难度ID
   * @param {Object} result - 游戏结果
   * @returns {boolean} 是否更新了最佳成绩
   */
  function updateBestScore(difficultyId, result) {
    const data = loadData()
    const currentBest = data.bestScores[difficultyId]
    
    // 判断是否超过最佳成绩
    const isNewBest = !currentBest || result.score > currentBest.score ||
      (result.score === currentBest.score && result.duration < currentBest.duration)
    
    if (isNewBest) {
      data.bestScores[difficultyId] = {
        score: result.score,
        correctCount: result.correctCount,
        totalCount: result.totalCount,
        accuracy: result.accuracy,
        duration: result.duration,
        completedAt: result.completedAt
      }
      saveData(data)
      return true
    }
    
    return false
  }
  
  /**
   * 获取所有最佳成绩
   * @returns {Object} 所有最佳成绩
   */
  function getAllBestScores() {
    const data = loadData()
    return data.bestScores
  }
  
  /**
   * 清除所有数据
   */
  function clearAllData() {
    localStorage.removeItem(STORAGE_KEY)
  }
  
  /**
   * 获取某个难度的进度
   * @param {number} difficultyId - 难度ID
   * @returns {Object|null} 进度对象
   */
  function getProgress(difficultyId) {
    const data = loadData()
    return data.progress[difficultyId] || null
  }
  
  /**
   * 更新难度进度
   * @param {number} difficultyId - 难度ID
   * @param {Object} progress - 进度数据
   */
  function updateProgress(difficultyId, progress) {
    const data = loadData()
    data.progress[difficultyId] = progress
    saveData(data)
  }
  
  /**
   * 获取已完成的难度列表
   * @returns {Array} 已完成的难度ID列表
   */
  function getCompletedDifficulties() {
    const data = loadData()
    return Object.keys(data.bestScores).map(id => parseInt(id))
  }
  
  return {
    loadData,
    saveData,
    getBestScore,
    updateBestScore,
    getAllBestScores,
    clearAllData,
    getProgress,
    updateProgress,
    getCompletedDifficulties
  }
}
