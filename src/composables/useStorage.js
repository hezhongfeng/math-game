import { ref, computed } from 'vue'
import { useToast } from './useToast'

const STORAGE_KEY = 'math-game-data'

// 内存缓存，避免重复读取 localStorage
let cachedData = null

/**
 * 本地存储 Composable
 * 用于保存和读取游戏进度和最佳成绩
 * 
 * 使用响应式数据，组件可以监听变化自动更新
 */
export function useStorage() {
  const { error: showError } = useToast()
  
  // 内部响应式状态
  const _data = ref(null)
  
  /**
   * 从 localStorage 读取数据
   * 优先使用内存缓存
   */
  function loadData() {
    if (cachedData) {
      return cachedData
    }
    
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      cachedData = raw ? JSON.parse(raw) : { bestScores: {}, progress: {} }
      _data.value = cachedData
      return cachedData
    } catch (error) {
      showError('读取游戏数据失败，请检查浏览器存储设置')
      cachedData = { bestScores: {}, progress: {} }
      _data.value = cachedData
      return cachedData
    }
  }
  
  /**
   * 保存数据到 localStorage
   * 同时更新内存缓存
   */
  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      cachedData = data
      _data.value = data
    } catch (error) {
      showError('保存游戏数据失败，存储空间可能已满')
    }
  }
  
  // 确保数据已加载
  loadData()
  
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
    return loadData().bestScores
  }
  
  /**
   * 获取已完成的难度列表
   * @returns {Array} 已完成的难度ID列表
   */
  function getCompletedDifficulties() {
    return Object.keys(loadData().bestScores).map(id => parseInt(id))
  }
  
  // 响应式计算属性
  const bestScores = computed(() => loadData().bestScores)
  const completedIds = computed(() => getCompletedDifficulties())
  const completedCount = computed(() => completedIds.value.length)
  
  return {
    // 方法
    getBestScore,
    updateBestScore,
    getAllBestScores,
    getCompletedDifficulties,
    // 响应式数据
    bestScores,
    completedIds,
    completedCount
  }
}
