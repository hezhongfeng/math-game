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

      if (includeSecondMissing && operand1 !== operand2) {
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

  return [...createAdditionPool(min, max), ...createSubtractionPool(min, max)]
}

/**
 * 生成题目唯一键
 * @param {Object} question - 题目对象
 * @returns {string} 唯一键
 */
function getQuestionKey(question) {
  const result = typeof question.result === 'number' ? question.result : 'x'
  const missingPart = question.missingPart || 'answer'
  return `${question.operator}:${question.operand1}:${question.operand2}:${result}:${missingPart}:${question.answer}`
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
 * 从分段规则中抽取题目
 * @param {Array} pool - 候选题池
 * @param {Array} segments - 分段配置
 * @param {number} questionCount - 题目数量
 * @returns {Array} 抽取后的题目
 */
function selectBySegments(pool, segments, questionCount) {
  const selected = []
  const usedKeys = new Set()

  segments.forEach(({ count, predicate }) => {
    if (count <= 0) {
      return
    }

    const uniqueCandidates = shuffle(pool.filter((question) => predicate(question)))
      .filter((question) => !usedKeys.has(getQuestionKey(question)))
      .slice(0, count)

    uniqueCandidates.forEach((question) => {
      selected.push(question)
      usedKeys.add(getQuestionKey(question))
    })

    if (uniqueCandidates.length < count) {
      const needed = count - uniqueCandidates.length
      const repeatedCandidates = sampleWithRepeats(pool.filter((question) => predicate(question)), needed)
      selected.push(...repeatedCandidates)
    }
  })

  if (selected.length < questionCount) {
    const fallbackPool = shuffle(pool).filter((question) => !usedKeys.has(getQuestionKey(question)))
    const fallbackUnique = fallbackPool.slice(0, questionCount - selected.length)

    fallbackUnique.forEach((question) => {
      selected.push(question)
      usedKeys.add(getQuestionKey(question))
    })
  }

  if (selected.length < questionCount) {
    selected.push(...sampleWithRepeats(pool, questionCount - selected.length))
  }

  return shuffle(selected).slice(0, questionCount)
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
        { count: warmupCount, predicate: (q) => q.operand1 === q.operand2 && q.answer <= 6 },
        { count: coreCount, predicate: (q) => q.answer === 5 },
        { count: challengeCount, predicate: (q) => Math.abs(q.operand1 - q.operand2) <= 1 && q.answer <= 6 }
      ]

    case 'withinTenIntroAdd':
      return [
        { count: warmupCount, predicate: (q) => Math.min(q.operand1, q.operand2) <= 1 && q.answer <= 7 },
        { count: coreCount, predicate: (q) => Math.min(q.operand1, q.operand2) <= 2 && q.answer <= 9 },
        { count: challengeCount, predicate: (q) => Math.min(q.operand1, q.operand2) <= 3 && q.answer <= 10 }
      ]

    case 'withinTenIntroSubtract':
      return [
        { count: warmupCount, predicate: (q) => q.operand2 <= 2 },
        { count: coreCount, predicate: (q) => q.operand2 <= 3 && q.answer >= 2 },
        { count: challengeCount, predicate: (q) => q.operand1 >= 8 && q.operand2 <= 4 }
      ]

    case 'makeTen':
      return [
        { count: warmupCount, predicate: (q) => q.answer === 10 && Math.min(q.operand1, q.operand2) <= 2 },
        { count: coreCount, predicate: (q) => q.answer === 10 && Math.min(q.operand1, q.operand2) >= 3 },
        { count: challengeCount, predicate: (q) => q.answer === 10 }
      ]

    case 'withinTenAdd':
      return [
        { count: warmupCount, predicate: (q) => Math.min(q.operand1, q.operand2) <= 2 && q.answer <= 10 },
        { count: coreCount, predicate: (q) => (q.answer === 10 || q.operand1 === q.operand2) && q.answer <= 10 },
        { count: challengeCount, predicate: (q) => q.answer <= 10 }
      ]

    case 'withinTenSubtract':
      return [
        { count: warmupCount, predicate: (q) => q.operand2 <= 3 },
        { count: coreCount, predicate: (q) => q.answer <= 5 && q.operand1 <= 10 },
        { count: challengeCount, predicate: (q) => q.operand1 >= 8 }
      ]

    case 'teenAdd':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            (q.operand1 === 10 || q.operand2 === 10) &&
            Math.min(q.operand1, q.operand2) <= 2
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            (q.operand1 >= 10 || q.operand2 >= 10) &&
            Math.min(q.operand1, q.operand2) <= 3 &&
            q.answer <= 15
          )
        },
        { count: challengeCount, predicate: (q) => (q.operand1 >= 10 || q.operand2 >= 10) && q.answer <= 20 }
      ]

    case 'teenSubtract':
      return [
        { count: warmupCount, predicate: (q) => q.operand1 >= 10 && q.operand2 <= 3 && q.answer >= 10 },
        { count: coreCount, predicate: (q) => q.operand1 >= 10 && q.operand2 <= 5 && q.answer >= 10 },
        { count: challengeCount, predicate: (q) => q.operand1 >= 10 && q.answer >= 10 }
      ]

    case 'bridgeTenAdd':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            q.operand1 < 10 &&
            q.operand2 < 10 &&
            q.answer > 10 &&
            Math.min(q.operand1, q.operand2) <= 2 &&
            q.answer <= 12
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            q.operand1 < 10 &&
            q.operand2 < 10 &&
            q.answer > 10 &&
            Math.min(q.operand1, q.operand2) <= 4 &&
            q.answer <= 14
          )
        },
        { count: challengeCount, predicate: (q) => q.operand1 < 10 && q.operand2 < 10 && q.answer > 10 }
      ]

    case 'bridgeTenSubtract':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            q.operand1 >= 10 &&
            q.answer < 10 &&
            q.operand2 <= 3 &&
            q.operand1 <= 13
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            q.operand1 >= 10 &&
            q.answer < 10 &&
            q.operand2 <= 5 &&
            q.operand1 <= 15
          )
        },
        { count: challengeCount, predicate: (q) => q.operand1 >= 10 && q.answer < 10 }
      ]

    case 'withinTwentyMixed':
      return [
        {
          count: warmupCount,
          predicate: (q) => (
            (q.operator === '+' && (q.operand1 >= 10 || q.operand2 >= 10) && Math.min(q.operand1, q.operand2) <= 5) ||
            (q.operator === '-' && q.operand1 >= 10 && q.operand2 <= 5 && q.answer >= 10)
          )
        },
        {
          count: coreCount,
          predicate: (q) => (
            (q.operator === '+' && q.operand1 < 10 && q.operand2 < 10 && q.answer > 10) ||
            (q.operator === '-' && q.operand1 >= 10 && q.answer < 10)
          )
        },
        { count: challengeCount, predicate: (q) => q.answer <= 20 }
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
 * 根据难度配置生成题目列表
 * @param {Object} difficulty - 难度配置对象
 * @returns {Array} 题目列表
 */
export function generateQuestions(difficulty) {
  if (!difficulty || !difficulty.range) {
    console.warn('[generator] 无效的难度配置:', difficulty)
    return []
  }

  const { range, operation, questionCount } = difficulty
  const [min, max] = range
  const pool = createQuestionPool(operation, min, max)

  if (!pool.length) {
    return []
  }

  const questions = selectBySegments(pool, getStageSegments(difficulty), questionCount)

  return questions.map((question, index) => ({
    ...question,
    result: typeof question.result === 'number' ? question.result : question.answer,
    missingPart: question.missingPart || 'answer',
    id: index + 1,
    userAnswer: null,
    isCorrect: null
  }))
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
