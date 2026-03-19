import { expect, test } from '@playwright/test'

async function openFirstLevel(page) {
  await page.goto('/')
  await page.getByTestId('start-challenge-btn').click()
  await expect(page).toHaveURL(/\/difficulty/)
  await page.getByTestId('difficulty-card-1').click()
  await expect(page).toHaveURL(/\/game\/1/)
  await expect(page.getByTestId('question-expression')).toBeVisible()
}

async function answerQuestionWithCorrectResult(page) {
  const expression = page.getByTestId('question-expression')
  const expressionText = (await expression.textContent()) || ''
  const match = expressionText.match(/(\d+)\s*([+-])\s*(\d+)/)

  if (!match) {
    throw new Error(`无法解析题目文本: ${expressionText}`)
  }

  const left = Number(match[1])
  const operator = match[2]
  const right = Number(match[3])
  const answer = operator === '+' ? left + right : left - right

  for (const digit of String(answer)) {
    await page.getByTestId(`num-btn-${digit}`).click()
    await page.waitForTimeout(120)
  }

  await page.getByTestId('num-btn-submit').click()
}

test.describe('E2E Smoke', () => {
  test('home to game navigation works', async ({ page }) => {
    await openFirstLevel(page)
  })

  test('answering a question advances progress', async ({ page }) => {
    await openFirstLevel(page)
    await expect(page.getByText('进度 0/20')).toBeVisible()

    await answerQuestionWithCorrectResult(page)
    await expect(page.getByText('进度 1/20')).toBeVisible({ timeout: 5_000 })
  })

  test('can finish one full round and see result modal', async ({ page }) => {
    test.setTimeout(120_000)

    await page.goto('/game/1')
    await expect(page.getByTestId('question-expression')).toBeVisible()

    for (let i = 0; i < 36; i += 1) {
      if (await page.getByTestId('result-modal').isVisible()) {
        break
      }

      await page.getByTestId('num-btn-9').click()
      await page.waitForTimeout(120)
      await page.getByTestId('num-btn-9').click()
      await page.waitForTimeout(120)
      await page.getByTestId('num-btn-9').click()
      await page.getByTestId('num-btn-submit').click()

      if (await page.getByTestId('result-modal').isVisible()) {
        break
      }

      const errorFeedbackCard = page.locator('.feedback-card.error')
      await expect(errorFeedbackCard).toBeVisible({ timeout: 3_000 })
      await page.locator('.feedback-continue-btn').click()
    }

    await expect(page.getByTestId('result-modal')).toBeVisible()
    await page.getByTestId('result-home-btn').click()
    await expect(page).toHaveURL(/\/difficulty/)
  })
})
