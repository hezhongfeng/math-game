import { ref, computed } from 'vue'
import { generateQuestions, checkAnswer } from '../utils/generator'

/**
 * 游戏核心逻辑 Composable
 * @param {Object} difficulty - 难度配置对象
 */
export function useGame(difficulty) {
  // 游戏状态
  const questions = ref([])
  const currentIndex = ref(0)
  const score = ref(0)
  const isComplete = ref(false)
  const correctCount = ref(0)
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
    return Math.round((correctCount.value / questions.value.length) * 100)
  })
  
  const duration = computed(() => {
    if (!startTime.value) return 0
    const end = endTime.value || Date.now()
    return Math.floor((end - startTime.value) / 1000)
  })
  
  /**
   * 开始游戏
   */
  function startGame() {
    questions.value = generateQuestions(difficulty)
    currentIndex.value = 0
    score.value = 0
    isComplete.value = false
    correctCount.value = 0
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
   * 重置游戏
   */
  function resetGame() {
    questions.value = []
    currentIndex.value = 0
    score.value = 0
    isComplete.value = false
    correctCount.value = 0
    startTime.value = null
    endTime.value = null
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
      difficulty: difficulty,
      completedAt: new Date().toISOString()
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
