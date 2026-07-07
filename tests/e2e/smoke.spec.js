import { expect, test } from '@playwright/test'

/**
 * E2E 冒烟测试：聚焦于高层级业务流和集成点
 */

async function openFirstLevel(page) {
  await page.goto('/')
  await page.getByTestId('start-challenge-btn').click()
  await expect(page).toHaveURL(/\/difficulty/)
  
  // 选择第一关（ID=1）
  await page.getByTestId('difficulty-card-1').click()
  await expect(page).toHaveURL(/\/game\/1/)
}

async function solveQuestion(page, isCorrect = true) {
  await expect(page.locator('.loading-overlay')).toBeHidden()
  const expression = page.locator('.question-card:not(.review-question) [data-testid="question-expression"]').first()
  await expect(expression).toBeVisible()
  
  const text = (await expression.textContent()) || ''
  
  if (isCorrect) {
    // 解析题目并输入正确答案
    const answer = getAnswerFromExpression(text)
    for (const digit of String(answer)) {
      await page.getByTestId(`num-btn-${digit}`).click()
    }
  } else {
    // 输入一个显然错误的答案，避免依赖移动端对多连击的处理差异
    const wrongAnswer = getWrongAnswerFromExpression(text)
    for (const digit of String(wrongAnswer)) {
      await page.getByTestId(`num-btn-${digit}`).click()
    }
  }
  
  await page.getByTestId('num-btn-submit').click()
}

async function getTotalQuestions(page) {
  const progressText = await page.locator('.question-card:not(.review-question) .counter-badge').first().textContent()
  const match = progressText?.match(/(\d+)\s*\/\s*(\d+)/)

  if (!match) {
    throw new Error(`Unable to read total question count from "${progressText}"`)
  }

  return Number(match[2])
}

async function dismissErrorFeedback(page) {
  const feedback = page.locator('.feedback-card.error')
  await expect(feedback).toBeVisible()
  await page.getByRole('button', { name: /继续下一题/ }).click()
  await expect(feedback).toBeHidden()
}

function getAnswerFromExpression(expressionText) {
  const text = expressionText.replace(/\s+/g, '')
  // 简单解析逻辑 (省略复杂分支以保持脚本整洁，主要支持标准和缺数模式)
  let match = text.match(/^(\d+)([+-])(\d+)=\?$/)
  if (match) return match[2] === '+' ? Number(match[1]) + Number(match[3]) : Number(match[1]) - Number(match[3])
  
  match = text.match(/^\?([+-])(\d+)=(\d+)$/)
  if (match) return match[1] === '+' ? Number(match[3]) - Number(match[2]) : Number(match[3]) + Number(match[2])
  
  match = text.match(/^(\d+)([+-])\?=(\d+)$/)
  if (match) return match[1] === '+' ? Number(match[3]) - Number(match[1]) : Number(match[1]) - Number(match[3])
  
  return null
}

function getWrongAnswerFromExpression(expressionText) {
  const correctAnswer = getAnswerFromExpression(expressionText)

  if (correctAnswer === 9) {
    return 8
  }

  return 9
}

test.describe('E2E Smoke - Core Game Loops', () => {
  test('uses semantic links for home navigation', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('start-challenge-btn')).toHaveAttribute('href', '/difficulty')
    await expect(page.getByTestId('explore-btn')).toHaveAttribute('href', '/explore')
  })

  test('supports keyboard navigation from difficulty selection', async ({ page }) => {
    await page.goto('/difficulty')
    const firstLevel = page.getByTestId('difficulty-card-1')

    await firstLevel.focus()
    await expect(firstLevel).toBeFocused()
    await firstLevel.press('Enter')

    await expect(page).toHaveURL(/\/game\/1/)
  })

  test('keeps difficulty scroll position after returning from a deeper level', async ({ page }) => {
    await page.goto('/difficulty')
    await page.evaluate(() => {
      const bestScores = {}

      for (let id = 1; id <= 25; id += 1) {
        bestScores[id] = {
          score: 100,
          accuracy: 100,
          completedAt: new Date().toISOString()
        }
      }

      window.localStorage.setItem('math-game-data', JSON.stringify({
        bestScores,
        leaderboards: {},
        progress: {},
        stats: {
          totalAnswers: 0,
          totalCorrect: 0,
          mistakeLedger: {},
          difficultyStats: {}
        }
      }))
    })
    await page.reload()
    await page.getByTestId('difficulty-card-26').scrollIntoViewIfNeeded()
    const savedScrollY = await page.evaluate(() => window.scrollY)

    await page.getByTestId('difficulty-card-26').click()
    await expect(page).toHaveURL(/\/game\/26/)
    await page.getByLabel('返回关卡页').click()
    await expect(page).toHaveURL(/\/difficulty/)
    // 聚焦原生按钮时，移动浏览器可能为焦点环轻微调整视口；仍应返回同一关卡区域。
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(savedScrollY - 120)
  })

  test('successful navigation to game and first answer', async ({ page }) => {
    await openFirstLevel(page)
    
    // 验证初始状态：题量随关卡配置变化，不再写死为旧版 20 题。
    await expect(page.locator('.summary-pill .stat-value')).toHaveText(/0\/\d+/)
    
    // 正确回答一题
    await solveQuestion(page, true)
    
    // 验证进度更新（集成点：Game Logic -> UI Store -> UI Component）
    await expect(page.locator('.summary-pill .stat-value')).toHaveText(/1\/\d+/)
  })

  test('error feedback and recovery', async ({ page }) => {
    await openFirstLevel(page)
    
    // 故意答错
    await solveQuestion(page, false)
    
    // 验证反馈层出现
    const feedback = page.locator('.feedback-card.error')
    await expect(feedback).toBeVisible()
    
    // 恢复游戏
    await dismissErrorFeedback(page)
  })

  test('shows challenge input guidance and validation feedback', async ({ page }) => {
    await page.goto('/explore')
    await page.getByRole('button', { name: '猜数挑战' }).click()

    await expect(page.locator('.status-copy')).toContainText('挑战范围：1–10')
    await page.getByTestId('num-btn-0').click()
    await expect(page.locator('.status-copy')).toHaveText('请从 1 开始，不能只输入 0。')
  })

  test('adapts the exploration stage to the ball grid rows', async ({ page }) => {
    await page.goto('/explore')

    await page.locator('.quick-counts').getByRole('button', { name: '10', exact: true }).click()
    await page.getByTestId('num-btn-submit').click()

    const stage = page.getByTestId('result-ball-shell')
    const resultCounts = page.locator('.result-counts')
    const rotationToggle = page.getByTestId('rotation-toggle')

    await expect(stage).toHaveClass(/result-ball-shell--wide/)
    await expect(rotationToggle).toBeHidden()

    await resultCounts.getByRole('button', { name: '50', exact: true }).click()
    await expect(stage).toHaveClass(/result-ball-shell--landscape/)

    await resultCounts.getByRole('button', { name: '100', exact: true }).click()
    await expect(stage).toHaveClass(/result-ball-shell--square/)

    const canvas = stage.locator('canvas')
    const renderFallback = page.getByTestId('ball-render-fallback')

    await expect(canvas.or(renderFallback)).toBeVisible()
    if (await renderFallback.isVisible()) {
      await expect(page.getByTestId('ball-render-retry')).toBeVisible()
      return
    }

    await expect(rotationToggle).toHaveAttribute('aria-pressed', 'false')
    await expect(canvas).toHaveCSS('touch-action', 'pan-y')

    await rotationToggle.click()
    await expect(rotationToggle).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('rotation-reset')).toBeVisible()
    await expect(canvas).toHaveCSS('touch-action', 'none')

    await rotationToggle.click()
    await expect(rotationToggle).toHaveAttribute('aria-pressed', 'false')
    await expect(canvas).toHaveCSS('touch-action', 'pan-y')
  })

  test('complete a full session and return home', async ({ page }) => {
    test.setTimeout(120_000)
    await openFirstLevel(page)
    const totalQuestions = await getTotalQuestions(page)
    const counter = page.locator('.question-card:not(.review-question) .counter-badge').first()
    
    // 走完整的答题主流程，错误反馈已由单独用例覆盖。
    for (let i = 0; i < totalQuestions; i++) {
      if (await page.getByTestId('result-modal').isVisible()) break
      await solveQuestion(page, true)

      if (i === totalQuestions - 1) {
        break
      }

      await expect(counter).toHaveText(new RegExp(`^${i + 2}\\s*/\\s*${totalQuestions}$`))
    }
    
    // 验证结算面板
    await expect(page.getByTestId('result-modal')).toBeVisible()
    
    // 点击返回首页
    await page.getByTestId('result-home-btn').click()
    await expect(page).toHaveURL(/\/difficulty/)
  })

  test('PWA manifest and metadata', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('首页｜算一算')
    const manifestLink = page.locator('link[rel="manifest"]')
    await expect(manifestLink).toHaveAttribute('href', /manifest\.json/)
    
    const themeColor = page.locator('meta[name="theme-color"]').first()
    await expect(themeColor).toHaveAttribute('content', /#/)
  })
})
