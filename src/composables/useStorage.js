import { computed, shallowRef } from 'vue'
import { useToast } from './useToast'
import { GAME_CONFIG, STORAGE_KEYS } from '../config/constants'
import { getQuestionKey } from '../utils/generator'
import { getQuestionSkill } from '../utils/questionSkills'

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
      difficultyStats: {}, // { "1": { avgTime: 0, totalPlayed: 0 } }
      weakQuestionLedger: {} // { "1:+:5:3:8:answer:8": { question, wrongCount, slowCount } }
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
  const storedStats = stats && typeof stats === 'object' && !Array.isArray(stats) ? stats : {}
  const normalizeRecord = (value, fallback) => (
    value && typeof value === 'object' && !Array.isArray(value) ? value : fallback
  )

  return {
    ...defaultStats,
    ...storedStats,
    mistakeLedger: normalizeRecord(storedStats.mistakeLedger, defaultStats.mistakeLedger),
    difficultyStats: normalizeRecord(storedStats.difficultyStats, defaultStats.difficultyStats),
    weakQuestionLedger: normalizeRecord(storedStats.weakQuestionLedger, defaultStats.weakQuestionLedger)
  }
}

/**
 * 计算数值列表中位数，用于首轮逐题速度基线
 * @param {number[]} values - 有效毫秒数
 * @returns {number} 中位数
 */
function getMedian(values) {
  if (!values.length) {
    return 0
  }

  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

/** 读取非负有限统计值，损坏字段按零处理。 */
function nonNegative(value) {
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : 0
}

/** 兼容没有能力统计的旧存档，并隔离损坏的嵌套字段。 */
function normalizeSkillResponseStats(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, {
    avgResponseTimeMs: nonNegative(entry?.avgResponseTimeMs),
    responseSampleCount: Math.floor(nonNegative(entry?.responseSampleCount)),
    assistedCount: Math.floor(nonNegative(entry?.assistedCount)),
    interruptedCount: Math.floor(nonNegative(entry?.interruptedCount))
  }]))
}

/** 只有独立、未中断且计时有效的作答能用于速度与掌握判断。 */
function hasReliableResponse(question) {
  return question?.usedHint !== true && question?.wasInterrupted !== true &&
    Number.isFinite(Number(question?.answerDurationMs)) && Number(question.answerDurationMs) > 0
}

/**
 * 创建可长期保存的题目快照
 * @param {Object} question - 作答题目
 * @returns {Object} 精简题目数据
 */
function createQuestionSnapshot(question) {
  return {
    operand1: question.operand1,
    operand2: question.operand2,
    operator: question.operator,
    result: question.result,
    missingPart: question.missingPart || 'answer',
    answer: question.answer,
    skillId: getQuestionSkill(question),
    ...(question.mixBucket ? { mixBucket: question.mixBucket } : {})
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
function handleStorageEvent(event) {
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
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', handleStorageEvent)
}

/**
 * 移除跨标签页 storage 事件监听，用于测试清理
 */
export function offStorageChange() {
  if (typeof window !== 'undefined') {
    window.removeEventListener('storage', handleStorageEvent)
  }
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
   * 只保留与当前题量一致的榜单记录
   * @param {Array} leaderboard - 原始榜单
   * @param {number|null} totalCount - 当前题量
   * @returns {Array} 过滤后的榜单
   */
  function filterLeaderboardByTotalCount(leaderboard, totalCount) {
    if (typeof totalCount !== 'number') {
      return leaderboard
    }

    return leaderboard.filter((item) => item?.totalCount === totalCount)
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
      showError('进度读取失败，请刷新后再试')
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
      showError('进度暂时没有保存，请稍后再试')
    }
  }
  
  /**
   * 更新游戏统计信息
   * @param {number} difficultyId - 难度ID
   * @param {Object} sessionResult - 游戏结果
   * @param {Object} [options] - 更新范围
   * @param {boolean} [options.includeTotals] - 是否计入累计答题数
   * @param {boolean} [options.includeDifficulty] - 是否更新关卡速度统计
   */
  function updateStats(difficultyId, sessionResult, options = {}) {
    const includeTotals = options.includeTotals !== false
    const includeDifficulty = options.includeDifficulty !== false
    const data = loadData()
    const stats = {
      ...data.stats,
      mistakeLedger: { ...data.stats.mistakeLedger },
      difficultyStats: { ...data.stats.difficultyStats },
      weakQuestionLedger: { ...data.stats.weakQuestionLedger }
    }
    const incorrectQuestions = Array.isArray(sessionResult.incorrectQuestions)
      ? sessionResult.incorrectQuestions
      : []
    const questionResults = Array.isArray(sessionResult.questionResults) && sessionResult.questionResults.length
      ? sessionResult.questionResults
      : incorrectQuestions.map((question) => ({ ...question, isCorrect: false }))

    // 1. 更新累计计数
    if (includeTotals) {
      stats.totalAnswers += sessionResult.totalCount
      stats.totalCorrect += sessionResult.correctCount
    }

    // 2. 更新错题本
    incorrectQuestions.forEach(q => {
      const key = `${q.operand1}${q.operator}${q.operand2}`
      if (!stats.mistakeLedger[key]) {
        stats.mistakeLedger[key] = { count: 0, lastAnswer: null }
      }
      stats.mistakeLedger[key].count += 1
      stats.mistakeLedger[key].lastAnswer = q.userAnswer
    })

    // 3. 按能力建立独立速度基线；旧版整关均值只保留为汇总，不跨能力混用。
    const existingDifficultyStats = stats.difficultyStats[difficultyId] || {}
    const skillStats = normalizeSkillResponseStats(existingDifficultyStats.responseStatsBySkill)
    const durationsBySkill = new Map()
    const correctDurations = []
    questionResults.forEach((question) => {
      if (question?.isCorrect !== true || !hasReliableResponse(question)) return
      const skillId = getQuestionSkill(question)
      if (skillId === 'unknown') return
      const durationMs = Number(question.answerDurationMs)
      if (!durationsBySkill.has(skillId)) durationsBySkill.set(skillId, [])
      durationsBySkill.get(skillId).push(durationMs)
      correctDurations.push(durationMs)
    })
    const getSlowThreshold = (skillId) => {
      const previous = skillStats[skillId]
      const durations = durationsBySkill.get(skillId) || []
      const baseline = previous?.responseSampleCount >= GAME_CONFIG.SLOW_RESPONSE_MIN_SAMPLES
        ? previous.avgResponseTimeMs
        : durations.length >= GAME_CONFIG.SLOW_RESPONSE_MIN_SAMPLES ? getMedian(durations) : 0
      return Math.max(GAME_CONFIG.SLOW_RESPONSE_MIN_MS, baseline * GAME_CONFIG.SLOW_RESPONSE_MULTIPLIER)
    }

    // 4. 更新逐题薄弱记录：同时记录错题和慢答，连续快答后降低权重
    questionResults.forEach((question) => {
      if (!question || !Number.isFinite(question.operand1) || !Number.isFinite(question.operand2)) {
        return
      }

      const ledgerKey = `${difficultyId}:${getQuestionKey(question)}`
      const existing = stats.weakQuestionLedger[ledgerKey]
      const skillId = getQuestionSkill(question)
      if (skillId === 'unknown') return
      const reliable = hasReliableResponse(question)
      const isSlow = question.isCorrect === true && reliable &&
        Number(question.answerDurationMs) >= getSlowThreshold(skillId)

      if (!existing && question.isCorrect === true && !isSlow) {
        return
      }

      const entry = {
        question: createQuestionSnapshot(question),
        difficultyId: Number(difficultyId),
        skillId,
        assistedCount: nonNegative(existing?.assistedCount) + (question.usedHint === true ? 1 : 0),
        interruptedCount: nonNegative(existing?.interruptedCount) + (question.wasInterrupted === true ? 1 : 0),
        lastUsedHint: question.usedHint === true,
        lastWasInterrupted: question.wasInterrupted === true,
        wrongCount: existing?.wrongCount || 0,
        slowCount: existing?.slowCount || 0,
        correctStreak: existing?.correctStreak || 0,
        totalAttempts: (existing?.totalAttempts || 0) + 1,
        lastAnswer: question.userAnswer,
        lastSeenAt: sessionResult.completedAt || new Date().toISOString()
      }

      if (question.isCorrect !== true) {
        entry.wrongCount += 1
        entry.correctStreak = 0
      } else if (isSlow) {
        entry.slowCount += 1
        entry.correctStreak = 0
      } else if (question.usedHint === true) {
        entry.correctStreak = 0
      } else if (reliable) {
        entry.correctStreak = Math.min(
          GAME_CONFIG.WEAK_MASTERY_STREAK,
          entry.correctStreak + 1
        )
      }

      stats.weakQuestionLedger[ledgerKey] = entry
    })

    // 5. 正常回合更新关卡整局与逐题速度统计
    if (includeDifficulty) {
      const dStats = { ...existingDifficultyStats }
      const currentAvg = Number(dStats.avgTime) || 0
      const n = Number(dStats.totalPlayed) || 0

      if (sessionResult.correctCount > 0 && sessionResult.duration > 0) {
        const sessionAvg = sessionResult.duration / sessionResult.totalCount
        dStats.avgTime = n === 0 ? sessionAvg : (currentAvg * n + sessionAvg) / (n + 1)
      }

      if (correctDurations.length) {
        const previousCount = Number(dStats.responseSampleCount) || 0
        const durationTotal = correctDurations.reduce((total, durationMs) => total + durationMs, 0)
        dStats.avgResponseTimeMs = (
          nonNegative(dStats.avgResponseTimeMs) * previousCount + durationTotal
        ) / (previousCount + correctDurations.length)
        dStats.responseSampleCount = previousCount + correctDurations.length
      }

      const nextSkillStats = { ...skillStats }
      questionResults.forEach((question) => {
        const skillId = getQuestionSkill(question)
        if (skillId === 'unknown') return
        const entry = nextSkillStats[skillId] || {
          avgResponseTimeMs: 0, responseSampleCount: 0, assistedCount: 0, interruptedCount: 0
        }
        nextSkillStats[skillId] = {
          ...entry,
          assistedCount: entry.assistedCount + (question.usedHint === true ? 1 : 0),
          interruptedCount: entry.interruptedCount + (question.wasInterrupted === true ? 1 : 0)
        }
      })
      durationsBySkill.forEach((durations, skillId) => {
        const previous = nextSkillStats[skillId]
        const sampleCount = previous.responseSampleCount + durations.length
        nextSkillStats[skillId] = {
          ...previous,
          avgResponseTimeMs: (previous.avgResponseTimeMs * previous.responseSampleCount +
            durations.reduce((total, duration) => total + duration, 0)) / sampleCount,
          responseSampleCount: sampleCount
        }
      })
      dStats.responseStatsBySkill = nextSkillStats
      dStats.totalPlayed = n + 1
      stats.difficultyStats[difficultyId] = dStats
    }

    saveData({
      ...data,
      stats
    })
  }

  /**
   * 保存错题重练的薄弱变化，但不计入最佳成绩、累计数或计时榜
   * @param {number} difficultyId - 难度ID
   * @param {Object} sessionResult - 重练结果
   */
  function updatePracticeStats(difficultyId, sessionResult) {
    updateStats(difficultyId, sessionResult, {
      includeTotals: false,
      includeDifficulty: false
    })
  }

  /**
   * 获取某关可用于无感复习的薄弱题
   * @param {number} difficultyId - 难度ID
   * @returns {Array} 带抽题权重的题目列表
   */
  function getWeakQuestions(difficultyId) {
    const ledger = loadData().stats.weakQuestionLedger

    return Object.values(ledger)
      .filter((entry) => Number(entry?.difficultyId) === Number(difficultyId) && entry?.question)
      .map((entry) => {
        const wrongCount = Number(entry.wrongCount) || 0
        const slowCount = Number(entry.slowCount) || 0
        const correctStreak = Number(entry.correctStreak) || 0
        const basePriority = Math.max(1, wrongCount * 3 + slowCount * 2)
        const streak = Math.min(correctStreak, GAME_CONFIG.WEAK_MASTERY_STREAK)

        return {
          ...entry.question,
          skillId: getQuestionSkill(entry.question),
          wrongCount,
          slowCount,
          correctStreak,
          priority: basePriority / Math.pow(4, streak)
        }
      })
      .sort((left, right) => right.priority - left.priority)
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
   * @param {number} [totalCount] - 当前题量
   * @returns {Array} 榜单列表
   */
  function getLeaderboard(difficultyId, totalCount = null) {
    const data = loadData()
    return filterLeaderboardByTotalCount(data.leaderboards[difficultyId] || [], totalCount)
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
    const currentBoard = getLeaderboard(difficultyId, result.totalCount)

    if (!isEligibleForLeaderboard(result)) {
      return {
        leaderboard: currentBoard,
        isLeaderboard: false,
        leaderboardRank: null
      }
    }

    const nextEntry = {
      durationMs: result.durationMs,
      completedAt: result.completedAt,
      totalCount: result.totalCount
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
    updatePracticeStats,
    getWeakQuestions,
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
