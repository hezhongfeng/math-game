import { computed, shallowRef } from 'vue'
import { useToast } from './useToast'
import { GAME_CONFIG, STORAGE_KEYS } from '../config/constants'

const STORAGE_KEY = STORAGE_KEYS.GAME_DATA

/**
 * 默认存档结构
 * @returns {{bestScores: Object, progress: Object}}
 */
function createDefaultData() {
  return { bestScores: {}, progress: {} }
}

// 全局响应式缓存，避免重复读取 localStorage
const storageData = shallowRef(createDefaultData())
let isDataLoaded = false

// 监听其他标签页的 storage 变化，同步缓存
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      try {
        storageData.value = event.newValue ? JSON.parse(event.newValue) : createDefaultData()
        isDataLoaded = true
      } catch (error) {
        console.error('同步外部存储数据失败:', error)
        storageData.value = createDefaultData()
        isDataLoaded = true
      }
    }
  })
}

/**
 * 本地存储 Composable
 * 用于保存和读取游戏进度和最佳成绩
 */
export function useStorage() {
  const { error: showError } = useToast()
  
  /**
   * 从 localStorage 读取数据
   * 仅在首次调用时读取，后续使用响应式缓存
   */
  function loadData() {
    if (isDataLoaded) {
      return storageData.value
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      storageData.value = raw ? JSON.parse(raw) : createDefaultData()
    } catch (error) {
      showError('读取游戏数据失败，请检查浏览器存储设置')
      storageData.value = createDefaultData()
    }

    isDataLoaded = true
    return storageData.value
  }

  /**
   * 保存数据到 localStorage
   * 同时更新内存缓存
   */
  function saveData(data) {
    const normalizedData = {
      bestScores: { ...(data?.bestScores || {}) },
      progress: { ...(data?.progress || {}) }
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedData))
      storageData.value = normalizedData
      isDataLoaded = true
    } catch (error) {
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
      const updatedBestScores = {
        ...data.bestScores,
        [difficultyId]: {
        score: result.score,
        correctCount: result.correctCount,
        totalCount: result.totalCount,
        accuracy: result.accuracy,
        duration: result.duration,
        completedAt: result.completedAt
        }
      }

      saveData({
        ...data,
        bestScores: updatedBestScores
      })
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
   * 获取已通过的难度列表
   * 通过标准：最佳正确率达到最低通过线
   * @returns {Array} 已通过的难度ID列表
   */
  function getCompletedDifficulties() {
    return Object.entries(loadData().bestScores)
      .filter(([, score]) => (score?.accuracy || 0) >= GAME_CONFIG.PASS_ACCURACY)
      .map(([id]) => parseInt(id, 10))
  }
  
  // 响应式计算属性
  const bestScores = computed(() => {
    loadData()
    return storageData.value.bestScores
  })
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
