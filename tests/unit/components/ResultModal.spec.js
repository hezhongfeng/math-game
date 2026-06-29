import { afterEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ResultModal from '../../../src/components/ResultModal.vue'

const result = {
  accuracy: 100,
  correctCount: 20,
  totalCount: 20,
  duration: 30,
  durationMs: 30000,
  incorrectQuestions: []
}

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

describe('ResultModal.vue', () => {
  test('announces itself as a modal and moves focus to the primary action', async () => {
    const wrapper = mount(ResultModal, {
      attachTo: document.body,
      props: {
        show: true,
        result,
        difficultyId: 1
      }
    })

    await nextTick()
    const dialog = document.querySelector('[data-testid="result-modal"]')
    const retryButton = document.querySelector('[data-testid="result-retry-btn"]')

    expect(dialog?.getAttribute('role')).toBe('dialog')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(document.activeElement).toBe(retryButton)

    dialog?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(wrapper.emitted('home')).toHaveLength(1)

    wrapper.unmount()
  })

  test('uses review language and hides the leaderboard for mistake practice', async () => {
    const wrapper = mount(ResultModal, {
      attachTo: document.body,
      props: {
        show: true,
        result: {
          ...result,
          isReviewRound: true
        },
        difficultyId: 1,
        leaderboard: [{ durationMs: 30000, completedAt: '2026-06-29' }]
      }
    })

    await nextTick()

    expect(document.querySelector('.result-chip')?.textContent).toContain('错题复习')
    expect(document.querySelector('.result-title')?.textContent).toBe('复习完成')
    expect(document.querySelector('.leaderboard-panel')).toBeNull()

    wrapper.unmount()
  })
})
