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
    // 输入一个显然错误的答案
    await page.getByTestId('num-btn-9').click({ clickCount: 3 })
  }
  
  await page.getByTestId('num-btn-submit').click()
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

test.describe('E2E Smoke - Core Game Loops', () => {
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
    await page.locator('.feedback-wrap.is-error').click()
    await expect(feedback).toBeHidden()
  })

  test('complete a full session and return home', async ({ page }) => {
    test.setTimeout(120_000)
    await page.goto('/game/1')
    
    // 快速完成一局（这里全部答错以节省脚本逻辑复杂度，验证流程通畅即可）
    for (let i = 0; i < 20; i++) {
      if (await page.getByTestId('result-modal').isVisible()) break
      await solveQuestion(page, false)
      // 处理反馈遮罩
      await page.locator('.feedback-wrap.is-error').click()
    }
    
    // 验证结算面板
    await expect(page.getByTestId('result-modal')).toBeVisible()
    
    // 点击返回首页
    await page.getByTestId('result-home-btn').click()
    await expect(page).toHaveURL(/\/difficulty/)
  })

  test('PWA manifest and metadata', async ({ page }) => {
    await page.goto('/')
    const manifestLink = page.locator('link[rel="manifest"]')
    await expect(manifestLink).toHaveAttribute('href', /manifest\.json/)
    
    const themeColor = page.locator('meta[name="theme-color"]').first()
    await expect(themeColor).toHaveAttribute('content', /#/)
  })
})
