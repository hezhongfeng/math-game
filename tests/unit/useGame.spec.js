import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useGame } from '../../src/composables/useGame'

describe('useGame', () => {
  const mockDifficulty = {
    id: 1,
    name: '入门 10以内加减法',
    range: [0, 10],
    operation: 'addSubtract',
    questionCount: 5 // 测试时题目少一点比较快
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-30T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('initializes state correctly when starting game', () => {
    const { questions, currentIndex, score, isComplete, startGame } = useGame(mockDifficulty)
    
    expect(questions.value).toHaveLength(0)
    expect(currentIndex.value).toBe(0)
    expect(score.value).toBe(0)
    expect(isComplete.value).toBe(false)

    startGame()

    expect(questions.value).toHaveLength(5)
    expect(currentIndex.value).toBe(0)
    expect(score.value).toBe(0)
  })

  test('processes correct and incorrect answers', () => {
    const { questions, score, correctCount, incorrectQuestions, startGame, submitAnswer, nextQuestion } = useGame(mockDifficulty)
    
    startGame()
    
    // 强制修改第一道题以便测试
    questions.value[0] = {
      operand1: 2,
      operand2: 3,
      operator: '+',
      answer: 5,
      missingPart: 'answer'
    }

    // 正确回答
    const result1 = submitAnswer(5)
    expect(result1).toBe(true)
    expect(score.value).toBe(10)
    expect(correctCount.value).toBe(1)
    expect(incorrectQuestions.value).toHaveLength(0)

    nextQuestion() // 切换到第二题

    // 强制修改第二道题
    questions.value[1] = {
      id: 2,
      operand1: 10,
      operand2: 4,
      operator: '-',
      answer: 6,
      missingPart: 'answer'
    }

    // 错误回答
    const result2 = submitAnswer(99)
    expect(result2).toBe(false)
    expect(score.value).toBe(10) // 分数不增加
    expect(correctCount.value).toBe(1)
    expect(incorrectQuestions.value).toHaveLength(1)
    expect(incorrectQuestions.value[0].correctAnswer).toBe(6)
  })

  test('advances progress and completes game', () => {
    const { currentIndex, isComplete, startGame, nextQuestion } = useGame(mockDifficulty)
    
    startGame()
    
    // 手动推进到最后一题
    for (let i = 0; i < 4; i++) {
      nextQuestion()
    }
    expect(currentIndex.value).toBe(4)
    expect(isComplete.value).toBe(false)

    // 最后一题之后触发完成
    nextQuestion()
    expect(isComplete.value).toBe(true)
  })

  test('calculates duration correctly with timer mock', () => {
    const { duration, startGame, completeGame } = useGame(mockDifficulty)
    
    startGame()
    
    // 模拟过了 15 秒
    vi.advanceTimersByTime(15000)
    expect(duration.value).toBe(15)

    // 完成游戏并锁定时间
    completeGame()
    vi.advanceTimersByTime(10000)
    expect(duration.value).toBe(15) // 时间应该停止在完成时刻
  })

  test('records response time and result for every answered question', () => {
    const { startGame, submitAnswer, nextQuestion, getResult } = useGame(mockDifficulty)

    startGame({
      questions: [
        { operand1: 2, operand2: 3, operator: '+', answer: 5 },
        { operand1: 6, operand2: 2, operator: '-', answer: 4 }
      ]
    })

    vi.advanceTimersByTime(2400)
    submitAnswer(5)
    nextQuestion()
    vi.advanceTimersByTime(6100)
    submitAnswer(3)

    expect(getResult().questionResults).toEqual([
      expect.objectContaining({
        operand1: 2,
        isCorrect: true,
        answerDurationMs: 2400
      }),
      expect.objectContaining({
        operand1: 6,
        isCorrect: false,
        answerDurationMs: 6100
      })
    ])
  })

  test('calculates accuracy correctly', () => {
    const { accuracy, startGame, questions, submitAnswer, nextQuestion } = useGame(mockDifficulty)
    
    startGame() // 5 题
    
    // 答对 3 题，答错 2 题
    for (let i = 0; i < 5; i++) {
      const q = questions.value[i]
      if (i < 3) {
        submitAnswer(q.answer) 
      } else {
        submitAnswer(q.answer + 1) // 故意答错
      }
      nextQuestion()
    }

    expect(accuracy.value).toBe(60) // 3/5 = 60%
  })

  test('supports restarting with specific questions (retry mistakes)', () => {
    const { questions, startGame } = useGame(mockDifficulty)
    
    const mistakes = [
      { operand1: 1, operand2: 1, operator: '+', answer: 2 },
      { operand1: 5, operand2: 2, operator: '-', answer: 3 }
    ]

    startGame({ questions: mistakes })
    
    expect(questions.value).toHaveLength(2)
    expect(questions.value[0].operand1).toBe(1)
    expect(questions.value[1].operand2).toBe(2)
  })

  test('handles reactive difficulty changes', () => {
    const difficultyRef = ref({ ...mockDifficulty, questionCount: 10 })
    const { startGame, questions } = useGame(difficultyRef)
    
    startGame()
    expect(questions.value).toHaveLength(10)

    // 修改难度
    difficultyRef.value = { ...mockDifficulty, questionCount: 20 }
    startGame()
    expect(questions.value).toHaveLength(20)
  })
})
