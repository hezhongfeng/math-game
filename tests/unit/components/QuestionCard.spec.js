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

  test('keeps the card stable while switching the expression', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: { ...mockQuestion, id: 1 },
        currentIndex: 0,
        totalQuestions: 20
      }
    })
    const cardElement = wrapper.find('.question-card').element

    await wrapper.setProps({
      question: {
        id: 2,
        operand1: 8,
        operand2: 3,
        operator: '-',
        result: 5,
        answer: 5,
        missingPart: 'answer',
        isCorrect: null
      },
      currentIndex: 1
    })

    expect(wrapper.find('.question-card').element).toBe(cardElement)
    expect(wrapper.find('[data-testid="question-expression"]').text()).toContain('8')
    expect(wrapper.find('[data-testid="question-expression"]').text()).toContain('-')
    expect(wrapper.find('.counter-badge').text()).toBe('2 / 20')
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
        showNumberBondHint: true,
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

  test('keeps ball visual hint off by default', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: {
          operand1: 3,
          operand2: 2,
          operator: '+',
          answer: 5,
          missingPart: 'answer'
        }
      }
    })

    expect(wrapper.find('[data-testid="ball-hint"]').exists()).toBe(false)
  })

  test('shows addition balls as two groups', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        showNumberBondHint: true,
        question: {
          operand1: 3,
          operand2: 2,
          operator: '+',
          answer: 5,
          missingPart: 'answer'
        }
      }
    })

    const hint = wrapper.find('[data-testid="ball-hint"]')
    const slots = hint.findAll('.slot')

    expect(hint.classes()).toContain('is-addition')
    expect(slots).toHaveLength(5)
    expect(slots.filter(slot => slot.classes().includes('is-addend-one'))).toHaveLength(3)
    expect(slots.filter(slot => slot.classes().includes('is-addend-two'))).toHaveLength(2)
    expect(hint.attributes('style')).toContain('--slot-columns: 10')
  })

  test('shows subtraction balls with removed items', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        showNumberBondHint: true,
        question: {
          operand1: 5,
          operand2: 2,
          operator: '-',
          answer: 3,
          missingPart: 'answer'
        }
      }
    })

    const hint = wrapper.find('[data-testid="ball-hint"]')
    const slots = hint.findAll('.slot')

    expect(hint.classes()).toContain('is-subtraction')
    expect(slots).toHaveLength(5)
    expect(slots.slice(0, 3).every(slot => slot.classes().includes('is-remaining'))).toBe(true)
    expect(slots.slice(3).every(slot => slot.classes().includes('is-removed'))).toBe(true)
    expect(slots.filter(slot => slot.classes().includes('is-removed'))).toHaveLength(2)
    expect(slots.filter(slot => slot.classes().includes('is-remaining'))).toHaveLength(3)
  })

  test('shows missing first addend as leading empty slots', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        showNumberBondHint: true,
        question: {
          operand1: 3,
          operand2: 2,
          operator: '+',
          result: 5,
          answer: 3,
          missingPart: 'operand1'
        }
      }
    })

    const slots = wrapper.findAll('[data-testid="ball-hint"] .slot')

    expect(slots).toHaveLength(5)
    expect(slots.slice(0, 3).every(slot => slot.classes().includes('is-missing'))).toBe(true)
    expect(slots.slice(3).every(slot => slot.classes().includes('is-known'))).toBe(true)
  })

  test('shows missing second addend as trailing empty slots', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        showNumberBondHint: true,
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

    const slots = wrapper.findAll('[data-testid="ball-hint"] .slot')

    expect(slots).toHaveLength(5)
    expect(slots.slice(0, 2).every(slot => slot.classes().includes('is-known'))).toBe(true)
    expect(slots.slice(2).every(slot => slot.classes().includes('is-missing'))).toBe(true)
  })

  test('caps ball visual hint at 30 balls', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        showNumberBondHint: true,
        question: {
          operand1: 20,
          operand2: 20,
          operator: '+',
          answer: 40,
          missingPart: 'answer'
        }
      }
    })

    expect(wrapper.findAll('.slot')).toHaveLength(30)
    expect(wrapper.find('.overflow-badge').text()).toBe('+10')
  })

  test('renders quiet pill toggle in card header when supported', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        showNumberBondHint: false,
        showNumberBondHintToggle: true,
        question: {
          operand1: 3,
          operand2: 2,
          operator: '+',
          answer: 5,
          missingPart: 'answer'
        }
      }
    })

    const toggle = wrapper.find('[data-testid="number-bond-hint-toggle"]')

    expect(toggle.exists()).toBe(true)
    expect(toggle.attributes('aria-pressed')).toBe('false')
    expect(toggle.text()).toContain('小球')
    expect(toggle.text()).toContain('关')

    await toggle.trigger('click')
    expect(wrapper.emitted('toggle-number-bond-hint')).toHaveLength(1)
  })

  test('hides ball toggle when the current question has no visual hint', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: mockQuestion
      }
    })

    expect(wrapper.find('[data-testid="number-bond-hint-toggle"]').exists()).toBe(false)
  })
})
