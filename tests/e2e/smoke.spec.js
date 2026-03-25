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
  const expressionText = ((await expression.textContent()) || '').replace(/\s+/g, '')
  const answer = getAnswerFromExpression(expressionText)

  if (answer === null) {
    throw new Error(`无法解析题目文本: ${expressionText}`)
  }

  for (const digit of String(answer)) {
    await page.getByTestId(`num-btn-${digit}`).click()
    await page.waitForTimeout(120)
  }

  await page.getByTestId('num-btn-submit').click()
}

function getAnswerFromExpression(expressionText) {
  const standardMatch = expressionText.match(/^(\d+)([+-])(\d+)=\?$/)

  if (standardMatch) {
    const left = Number(standardMatch[1])
    const operator = standardMatch[2]
    const right = Number(standardMatch[3])

    return operator === '+' ? left + right : left - right
  }

  const missingLeftMatch = expressionText.match(/^\?([+-])(\d+)=(\d+)$/)

  if (missingLeftMatch) {
    const operator = missingLeftMatch[1]
    const known = Number(missingLeftMatch[2])
    const result = Number(missingLeftMatch[3])

    return operator === '+' ? result - known : result + known
  }

  const missingRightMatch = expressionText.match(/^(\d+)([+-])\?=(\d+)$/)

  if (missingRightMatch) {
    const left = Number(missingRightMatch[1])
    const operator = missingRightMatch[2]
    const result = Number(missingRightMatch[3])

    return operator === '+' ? result - left : left - result
  }

  return null
}

async function answerQuestionWithObviouslyWrongResult(page, expectedProgressText, options = {}) {
  const nineButton = page.getByTestId('num-btn-9')

  await expect(nineButton).toBeEnabled()
  await nineButton.click()
  await page.waitForTimeout(120)
  await nineButton.click()
  await page.waitForTimeout(120)
  await nineButton.click()
  await page.getByTestId('num-btn-submit').click()

  await expect(page.locator('.feedback-card.error')).toBeVisible({ timeout: 3_000 })

  if (expectedProgressText) {
    await expect(page.getByText(expectedProgressText)).toBeVisible({ timeout: 5_000 })
  }

  if (options.clickContinueIfVisible) {
    const continueButton = page.locator('.feedback-continue-btn')

    if (await continueButton.isVisible()) {
      await continueButton.click()
    }
  }

  if (await page.getByTestId('result-modal').isVisible()) {
    return
  }

  await expect(nineButton).toBeEnabled({ timeout: 5_000 })
}

test.describe('E2E Smoke', () => {
  test('home to game navigation works', async ({ page }) => {
    await openFirstLevel(page)
  })

  test('answering a question advances progress', async ({ page }) => {
    await openFirstLevel(page)
    await expect(page.getByText('0/12')).toBeVisible()

    await answerQuestionWithCorrectResult(page)
    await expect(page.getByText('1/12')).toBeVisible({ timeout: 5_000 })
  })

  test('wrong answers show feedback and can continue', async ({ page }) => {
    await openFirstLevel(page)
    await expect(page.getByText('0/12')).toBeVisible()

    await answerQuestionWithObviouslyWrongResult(page, '0/12', { clickContinueIfVisible: true })
  })

  test('missing-number level accepts correct answers', async ({ page }) => {
    await page.goto('/game/16')
    await expect(page.getByTestId('question-expression')).toBeVisible()

    const expressionText = ((await page.getByTestId('question-expression').textContent()) || '').replace(/\s+/g, '')
    expect(expressionText.includes('?')).toBeTruthy()

    await answerQuestionWithCorrectResult(page)
    await expect(page.getByText('1/8')).toBeVisible({ timeout: 5_000 })
  })

  test('can finish one full round and see result modal', async ({ page }) => {
    test.setTimeout(120_000)

    await page.goto('/game/1')
    await expect(page.getByTestId('question-expression')).toBeVisible()

    for (let i = 0; i < 36; i += 1) {
      if (await page.getByTestId('result-modal').isVisible()) {
        break
      }

      await answerQuestionWithObviouslyWrongResult(page, null, { clickContinueIfVisible: true })

      if (await page.getByTestId('result-modal').isVisible()) {
        break
      }
    }

    await expect(page.getByTestId('result-modal')).toBeVisible()
    await page.getByTestId('result-home-btn').click()
    await expect(page).toHaveURL(/\/difficulty/)
  })

  test('retry mistakes restarts only the incorrect subset', async ({ page }) => {
    test.setTimeout(120_000)

    await page.goto('/game/1')
    await expect(page.getByTestId('question-expression')).toBeVisible()

    for (let i = 0; i < 36; i += 1) {
      if (await page.getByTestId('result-modal').isVisible()) {
        break
      }

      await answerQuestionWithObviouslyWrongResult(page, null, { clickContinueIfVisible: true })

      if (await page.getByTestId('result-modal').isVisible()) {
        break
      }
    }

    await expect(page.getByTestId('result-modal')).toBeVisible()

    const mistakesText = (await page.getByText(/有 \d+ 题答错了。/).textContent()) || ''
    const mistakesMatch = mistakesText.match(/(\d+)/)

    if (!mistakesMatch) {
      throw new Error(`无法解析错题数量: ${mistakesText}`)
    }

    const mistakeCount = Number(mistakesMatch[1])
    expect(mistakeCount).toBeGreaterThan(0)

    await page.getByTestId('result-retry-mistakes-btn').click()
    await expect(page.getByTestId('question-expression')).toBeVisible()
    await expect(page.locator('.summary-pill .stat-value')).toHaveText(`0/${mistakeCount}`)
  })
})
