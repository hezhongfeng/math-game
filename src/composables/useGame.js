import { ref, computed, toValue } from 'vue'
import { generateQuestions, checkAnswer } from '../utils/generator'

/**
 * 游戏核心逻辑 Composable
 * @param {Object|Ref<Object>} difficulty - 难度配置对象，支持响应式
 */
export function useGame(difficulty) {
  // 使用 toValue 获取实际值，支持响应式参数
  const difficultyValue = computed(() => toValue(difficulty))
  
  // 游戏状态
  const questions = ref([])
  const currentIndex = ref(0)
  const score = ref(0)
  const isComplete = ref(false)
  const correctCount = ref(0)
  const incorrectQuestions = ref([])  // 记录错题
  const startTime = ref(null)
  const endTime = ref(null)
  const currentQuestion = computed(() => questions.value[currentIndex.value])

  // 计算属性
  const progress = computed(() => {
    if (!questions.value.length) return 0
    return ((currentIndex.value) / questions.value.length) * 100
  })

  const accuracy = computed(() => {
    if (!questions.value.length) return 0
    const result = Math.round((correctCount.value / questions.value.length) * 100)
    return isNaN(result) ? 0 : result
  })

  const duration = computed(() => {
    if (!startTime.value) return 0
    const end = endTime.value || Date.now()
    const result = Math.floor((end - startTime.value) / 1000)
    return isNaN(result) ? 0 : result
  })

  function cloneQuestion(question, index) {
    return {
      ...question,
      result: typeof question.result === 'number' ? question.result : question.answer,
      missingPart: question.missingPart || 'answer',
      id: index + 1,
      userAnswer: null,
      isCorrect: null
    }
  }

  /**
   * 开始游戏
   */
  function startGame(options = {}) {
    const customQuestions = Array.isArray(options.questions) ? options.questions : null
    questions.value = customQuestions
      ? customQuestions.map((question, index) => cloneQuestion(question, index))
      : generateQuestions(difficultyValue.value)
    currentIndex.value = 0
    score.value = 0
    isComplete.value = false
    correctCount.value = 0
    incorrectQuestions.value = []  // 重置错题记录
    startTime.value = Date.now()
    endTime.value = null
  }

  /**
   * 提交答案
   * @param {number} answer - 用户输入的答案
   */
  function submitAnswer(answer) {
    const question = currentQuestion.value
    if (!question) return

    const isCorrect = checkAnswer(question, answer)
    question.userAnswer = answer
    question.isCorrect = isCorrect

    if (isCorrect) {
      score.value += 10
      correctCount.value++
    } else {
      // 记录错题
      incorrectQuestions.value.push({
        id: question.id,
        operand1: question.operand1,
        operand2: question.operand2,
        operator: question.operator,
        result: question.result,
        missingPart: question.missingPart,
        userAnswer: answer,
        correctAnswer: question.answer,
        answer: question.answer
      })
    }

    // 不在这里切换到下一题，由外部控制
    return isCorrect
  }

  /**
   * 切换到下一题
   */
  function nextQuestion() {
    if (currentIndex.value >= questions.value.length - 1) {
      completeGame()
    } else {
      currentIndex.value++
    }
  }

  /**
   * 完成游戏
   */
  function completeGame() {
    endTime.value = Date.now()
    isComplete.value = true
  }

  /**
   * 获取游戏结果
   */
  function getResult() {
    return {
      score: score.value,
      correctCount: correctCount.value,
      totalCount: questions.value.length,
      accuracy: accuracy.value,
      duration: duration.value,
      difficulty: difficultyValue.value,
      completedAt: new Date().toISOString(),
      incorrectQuestions: incorrectQuestions.value  // 返回错题列表
    }
  }

  return {
    // 状态
    questions,
    currentIndex,
    score,
    isComplete,
    correctCount,
    startTime,
    endTime,
    // 计算属性
    currentQuestion,
    progress,
    accuracy,
    duration,
    // 方法
    startGame,
    submitAnswer,
    nextQuestion,
    completeGame,
    getResult
  }
}
