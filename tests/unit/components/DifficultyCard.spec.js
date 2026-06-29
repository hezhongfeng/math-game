import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import DifficultyCard from '../../../src/components/DifficultyCard.vue'

const difficulty = {
  id: 1,
  description: '0-3 加法',
  helperText: '小数一起加一加',
  color: '#4A90E2'
}

describe('DifficultyCard.vue', () => {
  test('uses a labelled native button for an unlocked level', async () => {
    const wrapper = mount(DifficultyCard, {
      props: { difficulty }
    })
    const action = wrapper.get('[data-testid="difficulty-card-1"]')

    expect(action.element.tagName).toBe('BUTTON')
    expect(action.attributes('aria-label')).toContain('第1关')
    expect(action.element.disabled).toBe(false)

    await action.trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')[0][1]).toEqual(difficulty)
  })

  test('keeps a locked level disabled and non-actionable', async () => {
    const wrapper = mount(DifficultyCard, {
      props: {
        difficulty: { ...difficulty, id: 2 },
        isLocked: true
      }
    })
    const action = wrapper.get('[data-testid="difficulty-card-2"]')

    expect(action.element.disabled).toBe(true)
    expect(action.attributes('aria-label')).toBe('第2关，尚未解锁')

    await action.trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})
