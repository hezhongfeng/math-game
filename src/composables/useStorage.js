import { computed, shallowRef } from 'vue'
import { useToast } from './useToast'
import { GAME_CONFIG, STORAGE_KEYS } from '../config/constants'

const STORAGE_KEY = STORAGE_KEYS.GAME_DATA

/**
 * 默认存档结构
 */
function createDefaultData() {
  return {
    bestScores: {},
    leaderboards: {},
    progress: {},
    stats: {
      totalAnswers: 0,
      totalCorrect: 0,
      mistakeLedger: {}, // { "5+3": { count: 2, lastAnswer: 7 } }
      difficultyStats: {} // { "1": { avgTime: 0, totalPlayed: 0 } }
    }
  }
}

/**
 * 兼容旧版本或部分损坏的存档结构
 * @param {Object} stats - 已存储的统计数据
 * @returns {Object} 规范化后的统计数据
 */
function normalizeStats(stats) {
  const defaultStats = createDefaultData().stats

  return {
    ...defaultStats,
    ...(stats || {}),
    mistakeLedger: stats?.mistakeLedger || defaultStats.mistakeLedger,
    difficultyStats: stats?.difficultyStats || defaultStats.difficultyStats
  }
}

/**
 * 兼容旧版本或部分损坏的完整存档结构
 * @param {Object} data - 已存储的游戏数据
 * @returns {Object} 规范化后的游戏数据
 */
function normalizeData(data) {
  return {
    bestScores: data?.bestScores || {},
    leaderboards: data?.leaderboards || {},
    progress: data?.progress || {},
    stats: normalizeStats(data?.stats)
  }
}

// 全局响应式缓存，避免重复读取 localStorage
const storageData = shallowRef(createDefaultData())
let isDataLoaded = false

// 监听其他标签页的 storage 变化，同步缓存
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      try {
        const parsed = event.newValue ? JSON.parse(event.newValue) : createDefaultData()
        storageData.value = normalizeData(parsed)
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

  function getDurationMs(entry) {
    if (!entry) {
      return Number.POSITIVE_INFINITY
    }

    if (typeof entry.durationMs === 'number') {
      return entry.durationMs
    }

    if (typeof entry.duration === 'number') {
      return entry.duration * 1000
    }

    return Number.POSITIVE_INFINITY
  }
  
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
      if (raw) {
        const parsed = JSON.parse(raw)
        storageData.value = normalizeData(parsed)
      } else {
        storageData.value = createDefaultData()
      }
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
    const normalizedData = normalizeData(data)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedData))
      storageData.value = normalizedData
      isDataLoaded = true
    } catch (error) {
      showError('保存游戏数据失败，存储空间可能已满')
    }
  }
  
  /**
   * 更新游戏统计信息
   * @param {number} difficultyId - 难度ID
   * @param {Object} sessionResult - 游戏结果
   */
  function updateStats(difficultyId, sessionResult) {
    const data = loadData()
    const stats = { ...data.stats }

    // 1. 更新累计计数
    stats.totalAnswers += sessionResult.totalCount
    stats.totalCorrect += sessionResult.correctCount

    // 2. 更新错题本
    sessionResult.incorrectQuestions.forEach(q => {
      const key = `${q.operand1}${q.operator}${q.operand2}`
      if (!stats.mistakeLedger[key]) {
        stats.mistakeLedger[key] = { count: 0, lastAnswer: null }
      }
      stats.mistakeLedger[key].count += 1
      stats.mistakeLedger[key].lastAnswer = q.userAnswer
    })

    // 3. 更新难度相关统计（计算平均耗时）
    if (!stats.difficultyStats[difficultyId]) {
      stats.difficultyStats[difficultyId] = { avgTime: 0, totalPlayed: 0 }
    }
    
    const dStats = stats.difficultyStats[difficultyId]
    const currentAvg = dStats.avgTime
    const n = dStats.totalPlayed
    
    if (sessionResult.correctCount > 0 && sessionResult.duration > 0) {
      const sessionAvg = sessionResult.duration / sessionResult.totalCount
      dStats.avgTime = n === 0 ? sessionAvg : (currentAvg * n + sessionAvg) / (n + 1)
    }
    dStats.totalPlayed += 1

    saveData({
      ...data,
      stats
    })
  }
  
  /**
   * 获取分析数据
   */
  function getAnalysis() {
    const { stats } = loadData()
    // 获取错误最频繁的前 3 个题目
    const topMistakes = Object.entries(stats.mistakeLedger)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([key, data]) => ({ question: key, ...data }))

    return {
      totalAnswers: stats.totalAnswers,
      totalCorrect: stats.totalCorrect,
      topMistakes
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
   * 获取某关的计时榜单
   * @param {number} difficultyId - 难度ID
   * @returns {Array} 榜单列表
   */
  function getLeaderboard(difficultyId) {
    const data = loadData()
    return data.leaderboards[difficultyId] || []
  }

  /**
   * 判断本局是否满足上榜条件
   * @param {Object} result - 游戏结果
   * @returns {boolean} 是否满足条件
   */
  function isEligibleForLeaderboard(result) {
    return (result?.accuracy || 0) >= GAME_CONFIG.PASS_ACCURACY && (result?.durationMs || 0) > 0
  }

  /**
   * 更新每关前十计时榜
   * @param {number} difficultyId - 难度ID
   * @param {Object} result - 游戏结果
   * @returns {Object} 榜单结果
   */
  function updateLeaderboard(difficultyId, result) {
    const data = loadData()
    const currentBoard = getLeaderboard(difficultyId)

    if (!isEligibleForLeaderboard(result)) {
      return {
        leaderboard: currentBoard,
        isLeaderboard: false,
        leaderboardRank: null
      }
    }

    const nextEntry = {
      durationMs: result.durationMs,
      completedAt: result.completedAt
    }

    const nextBoard = [...currentBoard, nextEntry]
      .sort((left, right) => {
        if (left.durationMs !== right.durationMs) {
          return left.durationMs - right.durationMs
        }

        return String(left.completedAt).localeCompare(String(right.completedAt))
      })
      .slice(0, 10)

    const leaderboardRank = nextBoard.findIndex((item) => (
      item.durationMs === nextEntry.durationMs && item.completedAt === nextEntry.completedAt
    ))

    if (leaderboardRank === -1) {
      return {
        leaderboard: currentBoard,
        isLeaderboard: false,
        leaderboardRank: null
      }
    }

    saveData({
      ...data,
      leaderboards: {
        ...data.leaderboards,
        [difficultyId]: nextBoard
      }
    })

    return {
      leaderboard: nextBoard,
      isLeaderboard: true,
      leaderboardRank: leaderboardRank + 1
    }
  }
  
  /**
   * 更新最佳成绩
   * @param {number} difficultyId - 难度ID
   * @param {Object} result - 游戏结果
   * @returns {Object} 最佳成绩与计时榜更新结果
   */
  function updateBestScore(difficultyId, result) {
    // 首先更新全局统计
    updateStats(difficultyId, result)

    const data = loadData()
    const currentBest = data.bestScores[difficultyId]
    const leaderboardResult = updateLeaderboard(difficultyId, result)
    const nextData = loadData()
    
    // 判断是否超过最佳成绩
    const isNewBest = !currentBest || result.score > currentBest.score ||
      (result.score === currentBest.score && getDurationMs(result) < getDurationMs(currentBest))
    
    if (isNewBest) {
      const updatedBestScores = {
        ...nextData.bestScores,
        [difficultyId]: {
          score: result.score,
          correctCount: result.correctCount,
          totalCount: result.totalCount,
          accuracy: result.accuracy,
          duration: result.duration,
          durationMs: result.durationMs,
          completedAt: result.completedAt
        }
      }

      saveData({
        ...nextData,
        bestScores: updatedBestScores
      })
      return {
        isNewBest: true,
        ...leaderboardResult
      }
    }
    
    return {
      isNewBest: false,
      ...leaderboardResult
    }
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
  const leaderboards = computed(() => {
    loadData()
    return storageData.value.leaderboards
  })
  const stats = computed(() => {
    loadData()
    return storageData.value.stats
  })
  const completedIds = computed(() => getCompletedDifficulties())
  const completedCount = computed(() => completedIds.value.length)
  
  return {
    // 方法
    getBestScore,
    getLeaderboard,
    updateBestScore,
    getAllBestScores,
    getCompletedDifficulties,
    getAnalysis,
    // 响应式数据
    bestScores,
    leaderboards,
    stats,
    completedIds,
    completedCount
  }
}
