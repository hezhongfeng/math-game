import { ref, computed, toValue } from 'vue'
import { generateQuestions, checkAnswer, prepareQuestion } from '../utils/generator'
import { getQuestionSkill } from '../utils/questionSkills'

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
  const questionResults = ref([])
  const startTime = ref(null)
  const endTime = ref(null)
  const questionStartTime = ref(null)
  const isPageHidden = ref(false)
  const roundPausedAt = ref(null)
  const roundPausedMs = ref(0)
  const questionPausedAt = ref(null)
  const questionPausedMs = ref(0)
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
    return Math.floor(durationMs.value / 1000)
  })

  const durationMs = computed(() => {
    if (startTime.value === null) return 0
    const end = endTime.value ?? Date.now()
    const currentPause = roundPausedAt.value === null ? 0 : Math.max(0, end - roundPausedAt.value)
    const result = end - startTime.value - roundPausedMs.value - currentPause
    return isNaN(result) ? 0 : Math.max(0, result)
  })

  /** 开始当前题的前台计时；在后台自动切题时同时标记中断。 */
  function startQuestionTiming() {
    questionStartTime.value = Date.now()
    questionPausedMs.value = 0
    questionPausedAt.value = isPageHidden.value ? questionStartTime.value : null
    if (currentQuestion.value && isPageHidden.value) currentQuestion.value.wasInterrupted = true
  }

  /**
   * 响应页面前后台切换，排除后台停留时间，不重复计算同一段暂停。
   * @param {boolean} hidden - 页面是否不可见
   */
  function setPageHidden(hidden) {
    if (isPageHidden.value === hidden) return
    isPageHidden.value = hidden
    if (startTime.value === null || isComplete.value) return
    const now = Date.now()
    if (hidden) {
      roundPausedAt.value = now
      if (currentQuestion.value?.isCorrect === null) {
        questionPausedAt.value = now
        currentQuestion.value.wasInterrupted = true
      }
    } else {
      if (roundPausedAt.value !== null) roundPausedMs.value += Math.max(0, now - roundPausedAt.value)
      if (questionPausedAt.value !== null) questionPausedMs.value += Math.max(0, now - questionPausedAt.value)
      roundPausedAt.value = null
      questionPausedAt.value = null
    }
  }

  /** 标记当前题作答前曾展示小球，关闭提示后仍保留使用记录。 */
  function markHintUsed() {
    if (currentQuestion.value?.isCorrect === null && !isPageHidden.value) currentQuestion.value.usedHint = true
  }

  /**
   * 开始游戏
   */
  function startGame(options = {}) {
    const customQuestions = Array.isArray(options.questions) ? options.questions : null
    const weakQuestions = Array.isArray(options.weakQuestions) ? options.weakQuestions : []
    questions.value = customQuestions
      ? customQuestions.map((question, index) => prepareQuestion(question, index))
      : generateQuestions(difficultyValue.value, { weakQuestions })
    currentIndex.value = 0
    score.value = 0
    isComplete.value = false
    correctCount.value = 0
    incorrectQuestions.value = []  // 重置错题记录
    questionResults.value = []
    startTime.value = Date.now()
    roundPausedMs.value = 0
    roundPausedAt.value = isPageHidden.value ? startTime.value : null
    startQuestionTiming()
    endTime.value = null
  }

  /**
   * 提交答案
   * @param {number} answer - 用户输入的答案
   */
  function submitAnswer(answer) {
    const question = currentQuestion.value
    if (!question || question.isCorrect === true || question.isCorrect === false) return

    const isCorrect = checkAnswer(question, answer)
    const answerDurationMs = questionStartTime.value === null
      ? 0
      : Math.max(0, Date.now() - questionStartTime.value - questionPausedMs.value -
        (questionPausedAt.value === null ? 0 : Math.max(0, Date.now() - questionPausedAt.value)))
    question.userAnswer = answer
    question.isCorrect = isCorrect
    question.answerDurationMs = answerDurationMs

    questionResults.value.push({
      id: question.id,
      operand1: question.operand1,
      operand2: question.operand2,
      operator: question.operator,
      result: question.result,
      missingPart: question.missingPart,
      answer: question.answer,
      userAnswer: answer,
      isCorrect,
      answerDurationMs,
      skillId: getQuestionSkill(question),
      usedHint: question.usedHint === true,
      wasInterrupted: question.wasInterrupted === true,
      mixBucket: question.mixBucket,
      isWeakReview: question.isWeakReview === true,
      weakReason: question.weakReason
    })

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
      startQuestionTiming()
    }
  }

  /**
   * 完成游戏
   */
  function completeGame() {
    endTime.value = Date.now()
    if (roundPausedAt.value !== null) {
      roundPausedMs.value += Math.max(0, endTime.value - roundPausedAt.value)
      roundPausedAt.value = null
    }
    questionStartTime.value = null
    questionPausedAt.value = null
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
      durationMs: durationMs.value,
      difficulty: difficultyValue.value,
      completedAt: new Date().toISOString(),
      incorrectQuestions: incorrectQuestions.value,
      questionResults: questionResults.value
    }
  }

  return {
    // 状态
    questions,
    currentIndex,
    score,
    isComplete,
    correctCount,
    incorrectQuestions,
    questionResults,
    startTime,
    endTime,
    // 计算属性
    currentQuestion,
    progress,
    accuracy,
    duration,
    durationMs,
    // 方法
    startGame,
    submitAnswer,
    nextQuestion,
    completeGame,
    getResult,
    setPageHidden,
    markHintUsed
  }
}
