// 题目生成器 - 生成随机算术题，确保减法结果为非负数

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机整数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成加法题目
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {Object} { operand1, operand2, operator, answer }
 */
function generateAddition(min, max) {
  const operand1 = randomInt(min, max)
  const operand2 = randomInt(min, max)
  return {
    operand1,
    operand2,
    operator: '+',
    answer: operand1 + operand2
  }
}

/**
 * 生成减法题目（确保结果为非负数）
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {Object} { operand1, operand2, operator, answer }
 */
function generateSubtraction(min, max) {
  const operand1 = randomInt(min, max)
  const operand2 = randomInt(min, operand1) // 确保结果为非负数
  return {
    operand1,
    operand2,
    operator: '-',
    answer: operand1 - operand2
  }
}

/**
 * 生成混合运算题目（随机选择加法或减法）
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {Object} { operand1, operand2, operator, answer }
 */
function generateMixed(min, max) {
  return Math.random() > 0.5 
    ? generateAddition(min, max)
    : generateSubtraction(min, max)
}

/**
 * 根据难度配置生成题目列表
 * @param {Object} difficulty - 难度配置对象
 * @returns {Array} 题目列表
 */
export function generateQuestions(difficulty) {
  // 防御性检查：如果 difficulty 无效，返回空数组
  if (!difficulty || !difficulty.range) {
    console.warn('[generator] 无效的难度配置:', difficulty)
    return []
  }

  const { range, operation, questionCount } = difficulty
  const [min, max] = range

  // 使用 Set 来跟踪已生成的题目，避免重复
  const questionSet = new Set()
  const questions = []
  let attempts = 0
  const maxAttempts = questionCount * 10 // 防止无限循环

  while (questions.length < questionCount && attempts < maxAttempts) {
    attempts++
    let question
    switch (operation) {
      case 'add':
        question = generateAddition(min, max)
        break
      case 'subtract':
        question = generateSubtraction(min, max)
        break
      case 'mixed':
        question = generateMixed(min, max)
        break
      default:
        question = generateAddition(min, max)
    }

    // 生成唯一标识符
    const key = `${question.operand1}${question.operator}${question.operand2}`

    // 如果题目未重复，则添加
    if (!questionSet.has(key)) {
      questionSet.add(key)
      questions.push({ ...question, id: questions.length + 1, userAnswer: null, isCorrect: null })
    }
  }

  // 如果去重后题目不够，允许重复（对于极小范围的情况）
  while (questions.length < questionCount) {
    let question
    switch (operation) {
      case 'add':
        question = generateAddition(min, max)
        break
      case 'subtract':
        question = generateSubtraction(min, max)
        break
      case 'mixed':
        question = generateMixed(min, max)
        break
      default:
        question = generateAddition(min, max)
    }
    questions.push({ ...question, id: questions.length + 1, userAnswer: null, isCorrect: null })
  }

  return questions
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
