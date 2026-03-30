import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberPad from '../../../src/components/NumberPad.vue'

describe('NumberPad.vue', () => {
  test('emits input event when number buttons are clicked', async () => {
    const wrapper = mount(NumberPad)
    
    // 点击数字 7
    await wrapper.find('[data-testid="num-btn-7"]').trigger('click')
    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input[0]).toEqual([7])

    // 点击数字 0
    await wrapper.find('[data-testid="num-btn-0"]').trigger('click')
    expect(wrapper.emitted().input).toHaveLength(2)
    expect(wrapper.emitted().input[1]).toEqual([0])
  })

  test('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(NumberPad)
    
    await wrapper.find('[data-testid="num-btn-delete"]').trigger('click')
    expect(wrapper.emitted().delete).toBeTruthy()
  })

  test('emits submit event when submit button is clicked', async () => {
    const wrapper = mount(NumberPad)
    
    await wrapper.find('[data-testid="num-btn-submit"]').trigger('click')
    expect(wrapper.emitted().submit).toBeTruthy()
  })

  test('does not emit any events when disabled', async () => {
    const wrapper = mount(NumberPad, {
      props: {
        disabled: true
      }
    })

    // 尝试点击数字
    await wrapper.find('[data-testid="num-btn-5"]').trigger('click')
    expect(wrapper.emitted().input).toBeFalsy()

    // 尝试点击删除
    await wrapper.find('[data-testid="num-btn-delete"]').trigger('click')
    expect(wrapper.emitted().delete).toBeFalsy()

    // 尝试点击提交
    const submitBtn = wrapper.find('[data-testid="num-btn-submit"]')
    expect(submitBtn.element.disabled).toBe(true)
    await submitBtn.trigger('click')
    expect(wrapper.emitted().submit).toBeFalsy()
  })

  test('applies is-disabled class when disabled prop is true', () => {
    const wrapper = mount(NumberPad, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
