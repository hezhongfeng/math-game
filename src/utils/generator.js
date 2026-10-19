import { GAME_CONFIG } from '../config/constants'
import { getQuestionSkill } from './questionSkills'

// 题目生成器 - 按儿童计算策略分阶段出题，确保减法结果为非负数

/**
 * 生成指定范围内的随机整数（包含边界）
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 范围 [min, max] 内的随机整数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 随机打乱数组
 * @param {Array} items - 原始数组
 * @returns {Array} 打乱后的新数组
 */
function shuffle(items) {
  const list = [...items]

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index)
    const current = list[index]
    list[index] = list[swapIndex]
    list[swapIndex] = current
  }

  return list
}

/**
 * 生成加法题池
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {Array} 题目池
 */
function createAdditionPool(min, max) {
  const pool = []

  for (let operand1 = min; operand1 <= max; operand1 += 1) {
    for (let operand2 = min; operand2 <= max; operand2 += 1) {
      pool.push({
        operand1,
        operand2,
        operator: '+',
        answer: operand1 + operand2
      })
    }
  }

  return pool
}

/**
 * 生成减法题池
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {Array} 题目池
 */
function createSubtractionPool(min, max) {
  const pool = []

  for (let operand1 = min; operand1 <= max; operand1 += 1) {
    for (let operand2 = min; operand2 <= operand1; operand2 += 1) {
      pool.push({
        operand1,
        operand2,
        operator: '-',
        answer: operand1 - operand2
      })
    }
  }

  return pool
}

/**
 * 生成加法缺项题池
 * @param {number} min - 最小值
 * @param {number} max - 和的最大值
 * @param {boolean} includeSecondMissing - 是否允许第二个加数缺失
 * @returns {Array} 题目池
 */
function createMissingAdditionPool(min, max, includeSecondMissing = false) {
  const pool = []

  for (let result = min; result <= max; result += 1) {
    for (let operand2 = min; operand2 <= result; operand2 += 1) {
      const operand1 = result - operand2

      pool.push({
        operand1,
        operand2,
        operator: '+',
        answer: operand1,
        result,
        missingPart: 'operand1'
      })

      if (includeSecondMissing) {
        pool.push({
          operand1,
          operand2,
          operator: '+',
          answer: operand2,
          result,
          missingPart: 'operand2'
        })
      }
    }
  }

  return pool
}

/**
 * 根据运算类型创建题池
 * @param {string} operation - 运算类型
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {Array} 题目池
 */
function createQuestionPool(operation, min, max) {
  if (operation === 'add') {
    return createAdditionPool(min, max)
  }

  if (operation === 'subtract') {
    return createSubtractionPool(min, max)
  }

  if (operation === 'missingAddStart') {
    return createMissingAdditionPool(min, max)
  }

  if (operation === 'missingAddMixed') {
    return createMissingAdditionPool(min, max, true)
  }

  if (operation !== 'mixed') {
    console.warn(`Unknown operation "${operation}", falling back to mixed pool`)
  }
  return [...createAdditionPool(min, max), ...createSubtractionPool(min, max)]
}

/**
 * 为综合关题目打上题型标签
 * @param {Array} questions - 原始题目
 * @param {string} mixBucket - 题型桶名称
 * @returns {Array} 带标签的题目
 */
function addMixBucket(questions, mixBucket) {
  return questions.map((question) => ({
    ...question,
    mixBucket
  }))
}

/**
 * 生成题目唯一键
 * @param {Object} question - 题目对象
 * @returns {string} 唯一键
 */
export function getQuestionKey(question) {
  const missingPart = question.missingPart || 'answer'
  const result = typeof question.result === 'number'
    ? question.result
    : question.operator === '+'
      ? question.operand1 + question.operand2
      : question.operand1 - question.operand2

  return `${question.operator}:${question.operand1}:${question.operand2}:${result}:${missingPart}:${question.answer}`
}

/**
 * 根据错误、慢答和近期掌握情况计算抽题权重
 * @param {Object} question - 薄弱题记录
 * @returns {number} 正权重
 */
function getWeakPriority(question) {
  if (Number.isFinite(question.priority) && question.priority > 0) {
    return question.priority
  }

  const base = Math.max(1, (question.wrongCount || 0) * 3 + (question.slowCount || 0) * 2)
  const streak = Math.min(question.correctStreak || 0, GAME_CONFIG.WEAK_MASTERY_STREAK)
  return base / Math.pow(4, streak)
}

/**
 * 按权重抽取一个元素
 * @param {Array} items - 候选列表
 * @returns {Object|null} 抽中的元素
 */
function pickWeighted(items) {
  if (!items.length) {
    return null
  }

  const totalWeight = items.reduce((total, item) => total + getWeakPriority(item), 0)
  let cursor = Math.random() * totalWeight

  for (const item of items) {
    cursor -= getWeakPriority(item)

    if (cursor <= 0) {
      return item
    }
  }

  return items[items.length - 1]
}

/**
 * 先覆盖不同薄弱题，再按权重重复选取来源用于生成同类变式
 * @param {Array} items - 同一原因的薄弱题
 * @param {number} count - 需要的来源数量
 * @returns {Array} 薄弱题来源计划
 */
function buildWeakSourcePlan(items, count) {
  if (!items.length || count <= 0) {
    return []
  }

  const remaining = [...items]
  const selected = []

  while (remaining.length && selected.length < count) {
    const item = pickWeighted(remaining)
    selected.push(item)
    remaining.splice(remaining.indexOf(item), 1)
  }

  while (selected.length < count) {
    selected.push(pickWeighted(items))
  }

  return selected
}

/**
 * 判断持久化题目是否仍是结构完整的算术题
 * @param {Object} question - 待检查题目
 * @returns {boolean} 是否有效
 */
function isValidWeakQuestion(question) {
  if (!question || !['+', '-'].includes(question.operator)) {
    return false
  }

  if (![question.operand1, question.operand2, question.answer].every(Number.isFinite)) {
    return false
  }

  const missingPart = question.missingPart || 'answer'
  const result = question.operator === '+'
    ? question.operand1 + question.operand2
    : question.operand1 - question.operand2

  if (missingPart === 'answer') {
    return question.answer === result && result >= 0
  }

  if (question.operator !== '+' || !['operand1', 'operand2'].includes(missingPart)) {
    return false
  }

  return question.answer === question[missingPart] &&
    (typeof question.result !== 'number' || question.result === result)
}

/**
 * 判断候选题是否是指定薄弱题的同类变式
 * @param {Object} candidate - 正常题候选
 * @param {Object} source - 薄弱题来源
 * @returns {boolean} 是否属于同类题
 */
function matchesWeakPattern(candidate, source) {
  return getQuestionSkill(candidate) === getQuestionSkill(source)
}

/**
 * 去除持久化统计字段，只保留可作答题目数据
 * @param {Object} question - 带薄弱统计的题目
 * @returns {Object} 题目快照
 */
function toQuestionSnapshot(question) {
  return {
    operand1: question.operand1,
    operand2: question.operand2,
    operator: question.operator,
    answer: question.answer,
    result: typeof question.result === 'number' ? question.result : undefined,
    missingPart: question.missingPart || 'answer',
    ...(question.mixBucket ? { mixBucket: question.mixBucket } : {})
  }
}

/**
 * 在教学配额内按能力复习，目标 50%；配额容量不足时保留正常题。
 * @param {Array} normalQuestions - 按教学配额生成的题目
 * @param {Array} weakQuestions - 历史薄弱题
 * @param {number} questionCount - 本轮题量
 * @param {Array} plan - 每个教学配额的候选题池
 * @returns {Array} 保持教学配额的混合题目
 */
function mixWeakQuestions(normalQuestions, weakQuestions, questionCount, plan) {
  const eligibleKeys = new Set(plan.flatMap(({ pool }) => pool.map(getQuestionKey)))
  const valid = weakQuestions.filter((question) => (
    isValidWeakQuestion(question) && eligibleKeys.has(getQuestionKey(question)) &&
    (question.correctStreak || 0) < GAME_CONFIG.WEAK_MASTERY_STREAK &&
    ((question.wrongCount || 0) > 0 || (question.slowCount || 0) > 0)
  ))
  if (!valid.length || !normalQuestions.length) return normalQuestions

  const target = Math.ceil(questionCount * GAME_CONFIG.WEAK_QUESTION_RATIO)
  const wrong = valid.filter((q) => (q.wrongCount || 0) > 0)
  const slow = valid.filter((q) => (q.wrongCount || 0) <= 0 && (q.slowCount || 0) > 0)
  const wrongTarget = !wrong.length ? 0 : !slow.length ? target : Math.round(target * GAME_CONFIG.WEAK_WRONG_RATIO)
  const sourcePlan = shuffle([
    ...buildWeakSourcePlan(wrong, wrongTarget),
    ...buildWeakSourcePlan(slow, target - wrongTarget)
  ])
  const candidatesBySkill = new Map()
  valid.forEach((source) => {
    const skill = getQuestionSkill(source)
    if (!candidatesBySkill.has(skill)) {
      candidatesBySkill.set(skill, plan.map(({ pool }) => pool.filter((q) => matchesWeakPattern(q, source))))
    }
  })
  const slots = shuffle(normalQuestions.map((_, index) => index))
  const assignments = new Map()

  // 必要时将已分配的来源挪到另一个兼容位置，避免占用其他能力唯一可用的配额。
  function assignSource(source, visited = new Set()) {
    const pools = candidatesBySkill.get(getQuestionSkill(source))
    for (const index of slots) {
      if (visited.has(index) || !pools[normalQuestions[index].samplingGroup]?.length) continue
      visited.add(index)
      if (!assignments.has(index) || assignSource(assignments.get(index), visited)) {
        assignments.set(index, source)
        return true
      }
    }
    return false
  }

  sourcePlan.forEach((source) => assignSource(source))
  while (assignments.size < target) {
    let placed = false
    for (const source of shuffle(valid)) {
      if (assignSource(source)) placed = true
      if (assignments.size >= target) break
    }
    if (!placed) break
  }

  const usedKeys = new Set()
  const frequencies = new Map()
  normalQuestions.forEach((question) => {
    const key = getQuestionKey(question)
    frequencies.set(key, (frequencies.get(key) || 0) + 1)
  })
  const maxCopies = Math.ceil(questionCount / 4)
  function createReplacement(question, source) {
    const originalKey = getQuestionKey(question)
    const candidates = candidatesBySkill.get(getQuestionSkill(source))[question.samplingGroup].filter((q) => (
      getQuestionKey(q) === originalKey || (frequencies.get(getQuestionKey(q)) || 0) < maxCopies
    ))
    if (!candidates.length) return null
    const sourceKey = getQuestionKey(source)
    const exact = candidates.find((q) => getQuestionKey(q) === sourceKey && !usedKeys.has(sourceKey))
    const chosen = exact || shuffle(candidates.filter((q) => !usedKeys.has(getQuestionKey(q))))[0] || shuffle(candidates)[0]
    const chosenKey = getQuestionKey(chosen)
    usedKeys.add(chosenKey)
    frequencies.set(originalKey, frequencies.get(originalKey) - 1)
    frequencies.set(chosenKey, (frequencies.get(chosenKey) || 0) + 1)
    return {
      ...toQuestionSnapshot(chosen),
      samplingGroup: question.samplingGroup,
      isWeakReview: true,
      weakReason: (source.wrongCount || 0) > 0 ? 'mistake' : 'slow',
      weakReviewKind: chosenKey === sourceKey ? 'exact' : 'variant'
    }
  }
  const result = normalQuestions.map((question, index) => (
    assignments.has(index) ? createReplacement(question, assignments.get(index)) || question : question
  ))
  let weakCount = result.filter((question) => question.isWeakReview).length
  let wrongCount = result.filter((question) => question.weakReason === 'mistake').length
  for (const index of slots) {
    if (weakCount >= target) break
    if (result[index].isWeakReview) continue
    const preferWrong = wrongCount < wrongTarget
    const sources = shuffle(valid).sort((a, b) => (
      Number(((b.wrongCount || 0) > 0) === preferWrong) - Number(((a.wrongCount || 0) > 0) === preferWrong)
    ))
    for (const source of sources) {
      if (!candidatesBySkill.get(getQuestionSkill(source))[result[index].samplingGroup]?.length) continue
      const replacement = createReplacement(result[index], source)
      if (!replacement) continue
      result[index] = replacement
      weakCount++
      if (replacement.weakReason === 'mistake') wrongCount++
      break
    }
  }
  return result
}

/**
 * 优先安排剩余次数较多的题，同题先尝试隔开三道，题池不足时逐步缩短间隔。
 * @param {Array} questions - 已完成配额和薄弱题混合的题目
 * @returns {Array} 保留原题目及统计标记的作答顺序
 */
function spaceRepeatedQuestions(questions) {
  const groups = new Map()
  shuffle(questions).forEach((question) => {
    const key = getQuestionKey(question)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(question)
  })

  for (let gap = 3; gap >= 0; gap--) {
    const remaining = [...groups.values()].map((items) => ({ items: [...items], lastIndex: -Infinity }))
    const ordered = []
    while (ordered.length < questions.length) {
      const available = remaining.filter((group) => group.items.length && ordered.length - group.lastIndex > gap)
      if (!available.length) break
      available.sort((a, b) => b.items.length - a.items.length)
      const group = available[0]
      group.lastIndex = ordered.length
      ordered.push(group.items.pop())
    }
    if (ordered.length === questions.length) return ordered
  }
  return []
}

/**
 * 按需补齐数量，允许重复题目
 * @param {Array} pool - 候选题池
 * @param {number} count - 目标数量
 * @returns {Array} 题目列表
 */
function sampleWithRepeats(pool, count) {
  if (!pool.length || count <= 0) {
    return []
  }

  const selected = []

  while (selected.length < count) {
    const round = shuffle(pool)

    for (const question of round) {
      selected.push(question)

      if (selected.length >= count) {
        break
      }
    }
  }

  return selected
}

/**
 * 从指定题型桶中挑选题目
 * @param {Array} questions - 题型桶题目
 * @param {number} count - 目标数量
 * @param {Set<string>} usedKeys - 已使用题目
 * @param {number} samplingGroup - 本轮教学配额索引
 * @returns {Array} 抽取后的题目
 */
function selectFromBucket(questions, count, usedKeys, samplingGroup) {
  const picked = []

  shuffle(questions).forEach((question) => {
    const key = `${question.mixBucket}:${getQuestionKey(question)}`

    if (picked.length >= count || usedKeys.has(key)) {
      return
    }

    usedKeys.add(key)
    picked.push(question)
  })

  if (picked.length < count) {
    picked.push(...sampleWithRepeats(questions, count - picked.length))
  }

  return picked.map((question) => ({ ...question, samplingGroup }))
}

/**
 * 构建 10 以内综合关题型桶
 * @returns {Object} 题型桶
 */
function createWithinTenMixedBuckets() {
  const addPool = createAdditionPool(0, 10).filter((question) => question.answer <= 10)
  const subtractPool = createSubtractionPool(0, 10)
  const missingPool = createMissingAdditionPool(0, 10, true)

  return {
    direct: addMixBucket([...addPool, ...subtractPool], 'direct'),
    gap: addMixBucket(
      missingPool.filter((question) => (
        question.missingPart === 'operand2' &&
        question.operand1 >= 1 &&
        question.operand2 >= 1 &&
        question.result <= 10
      )),
      'gap'
    ),
    split: addMixBucket(
      missingPool.filter((question) => (
        question.missingPart === 'operand1' &&
        question.operand1 >= 1 &&
        question.operand2 >= 1 &&
        question.result <= 10
      )),
      'split'
    )
  }
}

/**
 * 用多种提问方式练习十的组成，入门先练右侧补数，复习再加入左侧缺项。
 * @param {string} stage - 组成或凑十复习阶段
 * @returns {Object} 非零十组成题型桶
 */
function createTenBondBuckets(stage) {
  const missingPool = createMissingAdditionPool(1, 10, true).filter((q) => (
    q.result === 10 && q.operand1 >= 1 && q.operand2 >= 1
  ))
  const buckets = {
    bondDirect: addMixBucket(createAdditionPool(1, 9).filter((q) => q.answer === 10), 'bondDirect'),
    bondGap: addMixBucket(missingPool.filter((q) => q.missingPart === 'operand2'), 'bondGap'),
    bondSubtract: addMixBucket(createSubtractionPool(1, 10).filter((q) => (
      q.operand1 === 10 && q.operand2 < 10
    )), 'bondSubtract')
  }
  if (stage === 'makeTenBridge') {
    buckets.bondSplit = addMixBucket(missingPool.filter((q) => q.missingPart === 'operand1'), 'bondSplit')
  }
  return buckets
}

/**
 * 构建 20 以内综合进阶关题型桶
 * @returns {Object} 题型桶
 */
function createWithinTwentyAdvancedBuckets() {
  const addPool = createAdditionPool(0, 20).filter((question) => question.answer <= 20)
  const subtractPool = createSubtractionPool(0, 20).filter((question) => question.answer <= 20)
  const missingPool = createMissingAdditionPool(0, 20, true)

  return {
    direct: addMixBucket(
      [
        ...addPool.filter((question) => (
          (question.operand1 >= 10 || question.operand2 >= 10) &&
          Math.min(question.operand1, question.operand2) <= 3
        )),
        ...subtractPool.filter((question) => (
          question.operand1 >= 10 &&
          question.operand2 <= 3 &&
          question.answer >= 10
        ))
      ],
      'direct'
    ),
    bridge: addMixBucket(
      [
        ...addPool.filter((question) => (
          question.operand1 < 10 &&
          question.operand2 < 10 &&
          question.answer > 10
        )),
        ...subtractPool.filter((question) => (
          question.operand1 >= 10 &&
          question.answer < 10 &&
          question.operand2 >= 1
        ))
      ],
      'bridge'
    ),
    blank: addMixBucket(
      missingPool.filter((question) => (
        question.missingPart === 'operand2' &&
        question.operand1 >= 1 &&
        question.operand2 >= 1 &&
        question.result <= 20
      )),
      'blank'
    ),
    bond: addMixBucket(
      addPool.filter((question) => (
        question.answer === 10 &&
        question.operand1 >= 1 &&
        question.operand2 >= 1
      )),
      'bond'
    )
  }
}

/**
 * 按教学配额抽题，并保留每道题可被替换的范围。
 * @param {Array} plan - 包含题池、数量的教学配额
 * @returns {Array} 基础题目
 */
function selectFromPlan(plan) {
  const usedKeys = new Set()
  return plan.flatMap(({ pool, count }, index) => selectFromBucket(pool, count, usedKeys, index))
}

/**
 * 构建当前关卡的分段出题规则
 * @param {Object} difficulty - 难度配置
 * @returns {Array} 分段规则
 */
function getStageSegments(difficulty) {
  const { stage, questionCount } = difficulty
  const warmupCount = Math.floor(questionCount * 0.4)
  const coreCount = Math.floor(questionCount * 0.4)
  const challengeCount = questionCount - warmupCount - coreCount

  switch (stage) {
    case 'addTiny':
      return [
        { count: warmupCount, predicate: (q) => q.answer <= 2 },
        { count: coreCount, predicate: (q) => q.answer <= 3 },
        { count: challengeCount, predicate: (q) => q.answer === 3 }
      ]

    case 'subtractTiny':
      return [
        { count: warmupCount, predicate: (q) => q.operand2 <= 1 },
        { count: coreCount, predicate: (q) => q.answer <= 2 },
        { count: challengeCount, predicate: (q) => q.operand1 === 3 }
      ]

    case 'mixedTiny':
      return [
        { count: warmupCount, predicate: (q) => q.operator === '+' && q.answer <= 2 },
        { count: coreCount, predicate: (q) => q.operator === '-' && q.operand2 <= 1 },
        { count: challengeCount, predicate: (q) => q.answer <= 3 }
      ]

    case 'addWithinFive':
      return [
        { count: warmupCount, predicate: (q) => q.answer <= 4 },
        { count: coreCount, predicate: (q) => q.answer <= 5 && Math.min(q.operand1, q.operand2) <= 2 },
        { count: challengeCount, predicate: (q) => q.answer === 5 }
      ]

    case 'subtractWithinFive':
      return [
        { count: warmupCount, predicate: (q) => q.operand2 <= 2 },
        { count: coreCount, predicate: (q) => q.answer <= 3 },
        { count: challengeCount, predicate: (q) => q.operand1 >= 4 }
      ]

    case 'mixedWithinFive':
      return [
        { count: warmupCount, predicate: (q) => q.operator === '+' && q.answer <= 4 },
        { count: coreCount, predicate: (q) => q.operator === '-' && q.operand2 <= 2 },
        { count: challengeCount, predicate: (q) => Math.max(q.operand1, q.operand2) >= 4 }
      ]

    case 'pairsWithinFive':
      return [
        { count: warmupCount, predicate: (q) => q.operand1 === q.operand2 && q.answer <= 5 },
        { count: coreCount, predicate: (q) => q.answer === 5 },
        { count: challengeCount, predicate: (q) => Math.abs(q.operand1 - q.operand2) <= 1 && q.answer <= 5 }
      ]

    case 'splitWithinFive':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            q.result <= 3 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            q.result <= 4 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        },
        {
          count: challengeCount,
          predicate: (q) => (
            q.result <= 5 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        }
      ]

    case 'gapWithinFive':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            q.missingPart === 'operand2' &&
            q.result <= 3 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            q.missingPart === 'operand2' &&
            q.result <= 4 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        },
        {
          count: challengeCount,
          predicate: (q) => (
            q.missingPart === 'operand2' &&
            q.result <= 5 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        }
      ]

    case 'withinTenIntroAdd':
      return [
        { count: warmupCount, predicate: (q) => Math.min(q.operand1, q.operand2) <= 1 && q.answer <= 6 },
        { count: coreCount, predicate: (q) => Math.min(q.operand1, q.operand2) <= 2 && q.answer <= 8 },
        { count: challengeCount, predicate: (q) => Math.min(q.operand1, q.operand2) <= 3 && q.answer <= 9 }
      ]

    case 'withinTenIntroSubtract':
      return [
        { count: warmupCount, predicate: (q) => q.operand1 <= 7 && q.operand2 <= 2 && q.answer >= 1 },
        { count: coreCount, predicate: (q) => q.operand1 <= 8 && q.operand2 <= 3 && q.answer >= 2 },
        { count: challengeCount, predicate: (q) => q.operand1 <= 10 && q.operand2 <= 4 && q.answer >= 3 }
      ]

    case 'splitWithinTen':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            q.result <= 6 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            q.result <= 8 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        },
        {
          count: challengeCount,
          predicate: (q) => (
            q.result <= 10 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        }
      ]

    case 'gapWithinTen':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            q.missingPart === 'operand2' &&
            q.result <= 6 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            q.missingPart === 'operand2' &&
            q.result <= 8 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        },
        {
          count: challengeCount,
          predicate: (q) => (
            q.missingPart === 'operand2' &&
            q.result <= 10 &&
            q.answer >= 1 &&
            q.operand1 >= 1 &&
            q.operand2 >= 1
          )
        }
      ]

    case 'withinTenAdd':
      return [
        { count: warmupCount, predicate: (q) => Math.min(q.operand1, q.operand2) <= 2 && q.answer <= 8 },
        { count: coreCount, predicate: (q) => (q.answer === 10 || q.operand1 === q.operand2) && q.answer <= 10 },
        { count: challengeCount, predicate: (q) => q.answer <= 10 && Math.min(q.operand1, q.operand2) <= 4 }
      ]

    case 'withinTenSubtract':
      return [
        { count: warmupCount, predicate: (q) => q.operand2 <= 2 },
        { count: coreCount, predicate: (q) => q.operand2 >= 3 && q.operand2 <= 5 },
        { count: challengeCount, predicate: (q) => q.operand2 >= 6 }
      ]

    case 'teenAdd':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            Math.max(q.operand1, q.operand2) >= 10 &&
            Math.max(q.operand1, q.operand2) <= 14 &&
            Math.min(q.operand1, q.operand2) <= 2 && q.answer <= 15
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            (q.operand1 >= 10 || q.operand2 >= 10) &&
            Math.min(q.operand1, q.operand2) <= 5 &&
            q.answer <= 20
          )
        },
        {
          count: challengeCount,
          predicate: (q) => (
            (q.operand1 >= 10 || q.operand2 >= 10) &&
            Math.min(q.operand1, q.operand2) >= 6 &&
            Math.min(q.operand1, q.operand2) <= 9 &&
            q.answer <= 20
          )
        }
      ]

    case 'teenSubtract':
      return [
        { count: warmupCount, predicate: (q) => q.operand1 <= 19 && q.operand2 >= 1 && q.operand2 <= 2 && q.answer >= 10 },
        { count: coreCount, predicate: (q) => q.operand1 <= 19 && q.operand2 >= 3 && q.operand2 <= 5 && q.answer >= 10 },
        { count: challengeCount, predicate: (q) => q.operand1 <= 19 && q.operand2 >= 6 && q.operand2 <= 9 && q.answer >= 10 }
      ]

    case 'bridgeTenAdd':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            q.operand1 < 10 &&
            q.operand2 < 10 &&
            q.answer > 10 &&
            Math.min(q.operand1, q.operand2) <= 3 &&
            q.answer <= 12
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            q.operand1 < 10 &&
            q.operand2 < 10 &&
            q.answer > 10 &&
            Math.min(q.operand1, q.operand2) <= 6 &&
            q.answer <= 15
          )
        },
        {
          count: challengeCount,
          predicate: (q) => (
            q.operand1 < 10 &&
            q.operand2 < 10 &&
            q.answer > 10 &&
            Math.min(q.operand1, q.operand2) >= 6 &&
            q.answer <= 18
          )
        }
      ]

    case 'subtractFromTen':
      return [
        { count: warmupCount, predicate: (q) => q.operand1 === 10 && q.operand2 <= 2 && q.operand2 >= 1 },
        { count: coreCount, predicate: (q) => q.operand1 === 10 && q.operand2 <= 5 && q.operand2 >= 1 },
        { count: challengeCount, predicate: (q) => q.operand1 <= 12 && q.operand2 <= 3 && q.operand2 >= 1 && q.answer >= 8 }
      ]

    case 'bridgeTenSubtract':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            q.operand1 >= 11 &&
            q.answer < 10 &&
            q.operand2 <= 5 &&
            q.operand1 <= 14
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            q.operand1 >= 11 &&
            q.answer < 10 &&
            q.operand2 <= 7 &&
            q.operand1 <= 16
          )
        },
        {
          count: challengeCount,
          predicate: (q) => (
            q.operand1 >= 11 &&
            q.answer < 10 &&
            q.operand2 >= 8 && q.operand2 <= 9 &&
            q.operand1 <= 18
          )
        }
      ]

    case 'withinTwentyMixed':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            (q.operator === '+' &&
              (q.operand1 >= 10 || q.operand2 >= 10) &&
              Math.min(q.operand1, q.operand2) <= 2 &&
              Math.max(q.operand1, q.operand2) <= 13) ||
            (q.operator === '-' &&
              q.operand1 >= 10 &&
              q.operand1 <= 12 &&
              q.operand2 <= 2 &&
              q.answer >= 10)
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            (q.operator === '+' &&
              q.operand1 < 10 &&
              q.operand2 < 10 &&
              q.answer > 10 &&
              Math.min(q.operand1, q.operand2) <= 2 &&
              q.answer <= 12) ||
            (q.operator === '-' &&
              q.operand1 >= 10 &&
              q.operand1 <= 13 &&
              q.operand2 <= 3 &&
              q.answer < 10)
          )
        },
        {
          count: challengeCount,
          predicate: (q) => (
            q.answer <= 16 &&
            (
              (q.operator === '+' && (
                (q.operand1 >= 10 || q.operand2 >= 10) ||
                Math.min(q.operand1, q.operand2) <= 5
              )) ||
              (q.operator === '-' && q.operand1 <= 16 && q.operand2 <= 5)
            )
          )
        }
      ]

    case 'missingNumberIntro':
      return [
        { count: warmupCount, predicate: (q) => q.missingPart === 'operand1' && q.result <= 10 },
        { count: coreCount, predicate: (q) => q.missingPart === 'operand1' && q.result <= 12 },
        { count: challengeCount, predicate: (q) => q.result <= 12 }
      ]

    default:
      return [{ count: questionCount, predicate: () => true }]
  }
}

/**
 * 构建十组成和综合关的教学配额
 * @param {string} stage - 当前阶段
 * @param {number} questionCount - 题量
 * @returns {Array|null} 教学配额或空
 */
function getSpecialSamplingPlan(stage, questionCount) {
  if (stage === 'makeTen' || stage === 'makeTenBridge') {
    const buckets = createTenBondBuckets(stage)
    const directCount = Math.floor(questionCount * 0.2)
    const subtractCount = Math.floor(questionCount * 0.2)
    const splitCount = stage === 'makeTenBridge' ? Math.floor(questionCount * 0.2) : 0
    const gapCount = questionCount - directCount - subtractCount - splitCount
    return [
      { pool: buckets.bondDirect, count: directCount },
      { pool: buckets.bondGap, count: gapCount },
      { pool: buckets.bondSubtract, count: subtractCount },
      { pool: buckets.bondSplit || [], count: splitCount }
    ]
  }

  if (stage === 'withinTenMixed') {
    const buckets = createWithinTenMixedBuckets()

    return [
      { pool: buckets.direct.filter((q) => q.answer <= 6 || q.operand2 <= 2), count: 6 },
      { pool: buckets.direct.filter((q) => q.answer <= 9 || q.operand2 <= 4), count: 5 },
      { pool: buckets.direct.filter((q) => q.answer <= 10), count: 5 },
      { pool: buckets.gap.filter((q) => q.result <= 6), count: 3 },
      { pool: buckets.gap.filter((q) => q.result <= 8), count: 3 },
      { pool: buckets.gap.filter((q) => q.result <= 10), count: 2 },
      { pool: buckets.split.filter((q) => q.result <= 6), count: 3 },
      { pool: buckets.split.filter((q) => q.result <= 8), count: 3 },
      { pool: buckets.split.filter((q) => q.result <= 10), count: 2 }
    ]
  }

  if (stage === 'withinTwentyMixedAdvanced') {
    const buckets = createWithinTwentyAdvancedBuckets()

    return [
      { pool: buckets.direct.filter((q) => q.answer <= 12), count: 6 },
      { pool: buckets.direct.filter((q) => q.answer <= 16), count: 6 },
      { pool: buckets.direct.filter((q) => q.answer <= 20), count: 4 },
      { pool: buckets.bridge.filter((q) => q.answer <= 12), count: 3 },
      { pool: buckets.bridge.filter((q) => q.answer <= 16), count: 4 },
      { pool: buckets.bridge.filter((q) => q.answer <= 20), count: 3 },
      { pool: buckets.blank.filter((q) => q.result <= 12), count: 3 },
      { pool: buckets.blank.filter((q) => q.result <= 16), count: 3 },
      { pool: buckets.blank.filter((q) => q.result <= 20), count: 2 },
      { pool: buckets.bond.filter((q) => Math.min(q.operand1, q.operand2) <= 2), count: 2 },
      { pool: buckets.bond.filter((q) => Math.min(q.operand1, q.operand2) <= 4), count: 2 },
      { pool: buckets.bond, count: 2 }
    ]
  }

  return null
}

/**
 * 构建关卡完整有效题池，同时约束新题和旧薄弱记录的范围与教学阶段。
 * @param {Object} difficulty - 难度配置
 * @returns {Array} 当前关卡允许出现的题目
 */
function createStageQuestionPool(difficulty) {
  const { stage, operation, range } = difficulty
  const [min, max] = range
  let pool
  if (stage === 'makeTen' || stage === 'makeTenBridge') {
    pool = Object.values(createTenBondBuckets(stage)).flat()
  } else if (stage === 'withinTenMixed') {
    pool = Object.values(createWithinTenMixedBuckets()).flat()
  } else if (stage === 'withinTwentyMixedAdvanced') {
    pool = Object.values(createWithinTwentyAdvancedBuckets()).flat()
  } else {
    const segments = getStageSegments(difficulty)
    pool = createQuestionPool(operation, min, max)
      .filter((question) => segments.some(({ predicate }) => predicate(question)))
  }

  return pool.filter((question) => {
    const result = question.operator === '+'
      ? question.operand1 + question.operand2
      : question.operand1 - question.operand2
    return result >= min && result <= max
  })
}

/**
 * 准备单道题目：补齐 result/missingPart/id，清空作答状态
 * @param {Object} question - 原始题目对象
 * @param {number} index - 题目索引
 * @returns {Object} 标准化后的题目
 */
export function prepareQuestion(question, index) {
  return {
    ...question,
    skillId: getQuestionSkill(question),
    result: typeof question.result === 'number' ? question.result : question.answer,
    missingPart: question.missingPart || 'answer',
    id: index + 1,
    userAnswer: null,
    isCorrect: null,
    usedHint: false,
    wasInterrupted: false
  }
}

/**
 * 根据难度配置生成题目列表
 * @param {Object} difficulty - 难度配置对象
 * @param {Object} [options] - 可选组卷参数
 * @param {Array} [options.weakQuestions] - 当前关卡历史薄弱题
 * @returns {Array} 题目列表
 */
export function generateQuestions(difficulty, options = {}) {
  if (!difficulty || !difficulty.range) {
    console.warn('[generator] 无效的难度配置:', difficulty)
    return []
  }

  const { questionCount, stage } = difficulty
  const pool = createStageQuestionPool(difficulty)
  if (!pool.length) return []

  const eligibleKeys = new Set(pool.map(getQuestionKey))
  const plan = getSpecialSamplingPlan(stage, questionCount) || getStageSegments(difficulty)
    .map(({ count, predicate }) => ({ count, pool: pool.filter(predicate) }))
  let remainingCount = questionCount
  plan.forEach((group) => {
    group.pool = group.pool.filter((question) => eligibleKeys.has(getQuestionKey(question)))
    group.count = Math.min(group.count, remainingCount)
    remainingCount -= group.count
  })
  const weakQuestions = Array.isArray(options.weakQuestions) ? options.weakQuestions : []
  const questions = selectFromPlan(plan)

  return spaceRepeatedQuestions(mixWeakQuestions(questions, weakQuestions, questionCount, plan))
    .map((question, index) => prepareQuestion(question, index))
}

/**
 * 验证答案
 * @param {Object} question - 题目对象
 * @param {number} userAnswer - 用户输入的答案
 * @returns {boolean} 是否正确
 */
export function checkAnswer(question, userAnswer) {
  return question.answer === userAnswer
}
