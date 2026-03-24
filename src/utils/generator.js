// 题目生成器 - 生成更有训练价值的算术题，确保减法结果为非负数

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
 * 判断是否为低范围阶段
 * @param {number} max - 题目最大值
 * @returns {boolean} 是否为低范围阶段
 */
function isEarlyStage(max) {
  return max <= 5
}

/**
 * 为题目打分，分数越高越值得进入练习集合
 * @param {Object} question - 题目对象
 * @param {number} max - 当前关卡最大值
 * @returns {number} 训练价值分数
 */
function getQuestionWeight(question, max) {
  const { operand1, operand2, operator, answer } = question
  let weight = 1

  if (operator === '+') {
    if (operand1 === 0 && operand2 === 0) {
      weight -= 0.7
    }

    if ((operand1 === 0 || operand2 === 0) && !isEarlyStage(max)) {
      weight -= 0.35
    }

    if (operand1 === operand2) {
      weight += 0.2
    }

    if (answer === 10) {
      weight += 0.9
    }

    if (max >= 10 && answer > 10) {
      weight += 0.45
    }
  }

  if (operator === '-') {
    if (answer === 0 && !isEarlyStage(max)) {
      weight -= 0.45
    }

    if (operand2 === 0 && !isEarlyStage(max)) {
      weight -= 0.4
    }

    if (answer === 10) {
      weight += 0.75
    }

    if (max >= 10 && operand1 >= 10) {
      weight += 0.35
    }
  }

  if (Math.max(operand1, operand2) >= Math.ceil(max * 0.7)) {
    weight += 0.3
  }

  if (answer >= Math.ceil(max * 0.6)) {
    weight += 0.15
  }

  return Math.max(weight, 0.15)
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
    for (let operand2 = operand1; operand2 <= max; operand2 += 1) {
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

  return [...createAdditionPool(min, max), ...createSubtractionPool(min, max)]
}

/**
 * 从题池中按训练价值抽取题目
 * @param {Array} pool - 候选题池
 * @param {number} questionCount - 目标题数
 * @param {number} max - 当前关卡最大值
 * @returns {Array} 抽取后的题目列表
 */
function selectQuestions(pool, questionCount, max) {
  const weightedPool = shuffle(pool).map((question) => ({
    ...question,
    weight: getQuestionWeight(question, max)
  }))

  weightedPool.sort((left, right) => right.weight - left.weight)

  const primaryCount = Math.min(questionCount, Math.max(Math.ceil(questionCount * 0.65), 6))
  const primaryPool = weightedPool.slice(0, Math.max(primaryCount * 2, primaryCount))
  const secondaryPool = weightedPool.slice(Math.max(primaryCount * 2, primaryCount))

  const selectedPrimary = shuffle(primaryPool).slice(0, primaryCount)
  const selectedSecondary = shuffle(secondaryPool).slice(0, questionCount - selectedPrimary.length)
  const selectedQuestions = [...selectedPrimary, ...selectedSecondary]

  if (selectedQuestions.length < questionCount) {
    const fallbackQuestions = shuffle(weightedPool)
      .slice(0, questionCount - selectedQuestions.length)
    selectedQuestions.push(...fallbackQuestions)
  }

  return shuffle(selectedQuestions).slice(0, questionCount).map(({ weight, ...question }) => question)
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

  const questions = selectQuestions(pool, questionCount, max)

  return questions.map((question, index) => ({
    ...question,
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
