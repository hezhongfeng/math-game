import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import QuestionCard from '../../../src/components/QuestionCard.vue'

describe('QuestionCard.vue', () => {
  const mockQuestion = {
    operand1: 12,
    operand2: 5,
    operator: '+',
    result: 17,
    answer: 17,
    missingPart: 'answer',
    isCorrect: null
  }

  test('renders standard addition question correctly', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: mockQuestion,
        userAnswer: '',
        currentIndex: 0,
        totalQuestions: 20
      }
    })

    const text = wrapper.text()
    expect(text).toContain('12')
    expect(text).toContain('+')
    expect(text).toContain('5')
    expect(text).toContain('=')
    expect(text).toContain('?') // 初始占位符
    expect(text).toContain('1 / 20') // 计数器
  })

  test('renders missing operand1 question correctly', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: { ...mockQuestion, missingPart: 'operand1' },
        userAnswer: '8'
      }
    })

    const expression = wrapper.find('[data-testid="question-expression"]')
    const children = expression.findAll('span')
    
    // 第一个 span 应该是 answer 区域（显示输入内容）
    expect(children[0].classes()).toContain('answer')
    expect(children[0].text()).toBe('8')
    // 最后一个 span 应该是结果数字
    expect(children[children.length - 1].text()).toBe('17')
  })

  test('shows user answer while typing', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: mockQuestion,
        userAnswer: '1'
      }
    })

    expect(wrapper.find('.answer').text()).toBe('1')

    await wrapper.setProps({ userAnswer: '17' })
    expect(wrapper.find('.answer').text()).toBe('17')
  })

  test('applies success styles when answer is correct', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: { ...mockQuestion, isCorrect: true },
        userAnswer: '17',
        showAnswer: true
      }
    })

    expect(wrapper.find('.answer').classes()).toContain('is-correct')
  })

  test('applies error styles when answer is incorrect', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: { ...mockQuestion, isCorrect: false },
        userAnswer: '99',
        showAnswer: true
      }
    })

    expect(wrapper.find('.answer').classes()).toContain('is-wrong')
    expect(wrapper.find('.answer').text()).toBe('99')
  })

  test('does not show strategy text in the question card', () => {
    const difficulty = { stage: 'pairsWithinFive' }
    const wrapper = mount(QuestionCard, {
      props: {
        difficulty,
        question: {
          operand1: 2,
          operand2: 2,
          operator: '+',
          answer: 4,
          missingPart: 'answer'
        }
      }
    })

    expect(wrapper.text()).not.toContain('5 的好朋友')
    expect(wrapper.text()).not.toContain('还差')
  })

  test('can hide number-bond visual hint for fluent practice', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        difficulty: { stage: 'gapWithinFive' },
        question: {
          operand1: 2,
          operand2: 3,
          operator: '+',
          result: 5,
          answer: 3,
          missingPart: 'operand2'
        }
      }
    })

    expect(wrapper.find('.number-bond-hint').exists()).toBe(true)

    await wrapper.setProps({ showNumberBondHint: false })
    expect(wrapper.find('.number-bond-hint').exists()).toBe(false)
  })
})
