# 阶段综合关 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为主线新增 `10 以内综合` 和 `20 以内综合进阶` 两个阶段收口关卡，并把总关卡数扩展到 `26`

**Architecture:** 继续沿用“配置文件定义关卡 + 生成器按 stage 出题”的现有结构，不增加新页面或新组件。配置层负责插入新关卡与重排 group，生成器层通过新增两个 stage 和轻量 `mixBucket` 标签来精确控制综合题比例，同时保持现有 UI 数据结构兼容。

**Tech Stack:** Vue 3, Vite, Vitest, Playwright

---

## 文件结构

```text
src/
├── config/
│   └── difficulty.js                 # 修改：新增两个综合关、更新 TOTAL_LEVELS 和 DIFFICULTY_GROUPS
├── utils/
│   └── generator.js                  # 修改：新增自定义 mixed stage 题池与分段规则
├── pages/
│   └── DifficultySelect.vue          # 不改逻辑，只依赖更新后的 TOTAL_LEVELS / DIFFICULTY_GROUPS
tests/
├── unit/
│   ├── difficulty.spec.js            # 修改：锁定 26 关配置与 group 顺序
│   └── generator.spec.js             # 修改：锁定两个综合关的题型比例与边界
└── e2e/
    └── smoke.spec.js                 # 修改：验证更深的关卡列表仍可滚动、进入、返回
docs/
└── DIFFICULTY_CURVE.md               # 修改：同步 26 关主线说明
```

---

### Task 1: 锁定 26 关配置与分组结构

**Files:**
- Modify: `tests/unit/difficulty.spec.js`
- Modify: `src/config/difficulty.js`

- [ ] **Step 1: 先写配置层失败测试**

把 `tests/unit/difficulty.spec.js` 改成下面这版，先锁住总关卡数、关键 stage 和 group 覆盖顺序：

```javascript
import { describe, expect, test } from 'vitest'
import { DIFFICULTY_GROUPS, TOTAL_LEVELS, getDifficultyById } from '../../src/config/difficulty'

describe('difficulty config', () => {
  test('exposes 26 ordered levels with the two new capstone stages', () => {
    const questionCounts = Array.from({ length: TOTAL_LEVELS }, (_, index) => {
      return getDifficultyById(index + 1).questionCount
    })

    expect(TOTAL_LEVELS).toBe(26)
    expect(questionCounts).toEqual([
      20, 20, 24, 24, 24, 30, 30, 24,
      24, 28, 28, 30, 28, 28, 30, 32,
      32, 32, 32, 32, 32, 32, 36, 36,
      40, 40
    ])

    expect(getDifficultyById(17).stage).toBe('withinTenMixed')
    expect(getDifficultyById(17).description).toBe('10 以内综合')
    expect(getDifficultyById(26).stage).toBe('withinTwentyMixedAdvanced')
    expect(getDifficultyById(26).description).toBe('20 以内综合进阶')
  })

  test('difficulty groups cover every level exactly once in order', () => {
    const flattened = DIFFICULTY_GROUPS.flatMap((group) => group.levels)

    expect(flattened).toEqual(Array.from({ length: TOTAL_LEVELS }, (_, index) => index + 1))
  })
})
```

- [ ] **Step 2: 运行单测，确认它先失败**

Run:

```bash
npm run test:unit -- tests/unit/difficulty.spec.js
```

Expected:

```text
FAIL  tests/unit/difficulty.spec.js
+ expected 24 to be 26
```

- [ ] **Step 3: 实现新的关卡配置与分组**

在 `src/config/difficulty.js` 中做三类改动：

1. 保留 `1-16` 不变。
2. 在原 `16` 和原 `17` 之间插入新关卡 `17: withinTenMixed`。
3. 把末尾扩展到 `26`，新增最终关 `26: withinTwentyMixedAdvanced`。

把尾部配置改成下面这组明确值：

```javascript
  {
    id: 17,
    name: '17',
    level: '6组',
    range: [0, 10],
    operation: 'mixed',
    stage: 'withinTenMixed',
    questionCount: 32,
    description: '10 以内综合',
    helperText: '把前面学过的方法一起用起来',
    color: 'var(--candy-lavender-light)',
    textColor: 'var(--candy-lavender-dark)',
    stars: 4
  },
  {
    id: 18,
    name: '18',
    level: '7组',
    range: [0, 20],
    operation: 'add',
    stage: 'teenAdd',
    questionCount: 32,
    description: '10几加几',
    helperText: '先从 10 开始往上加',
    color: 'var(--candy-lavender-light)',
    textColor: 'var(--candy-lavender-dark)',
    stars: 4
  },
  {
    id: 19,
    name: '19',
    level: '7组',
    range: [0, 20],
    operation: 'subtract',
    stage: 'teenSubtract',
    questionCount: 32,
    description: '10几减几',
    helperText: '从 10几里慢慢减掉',
    color: 'var(--candy-lavender)',
    textColor: 'var(--candy-lavender-dark)',
    stars: 4
  },
  {
    id: 20,
    name: '20',
    level: '7组',
    range: [0, 10],
    operation: 'add',
    stage: 'makeTenBridge',
    questionCount: 32,
    description: '凑到 10',
    helperText: '先把 10 凑稳',
    color: 'var(--candy-lavender-dark)',
    textColor: 'var(--candy-lavender-dark)',
    stars: 4
  },
  {
    id: 21,
    name: '21',
    level: '8组',
    range: [0, 20],
    operation: 'add',
    stage: 'bridgeTenAdd',
    questionCount: 32,
    description: '20 以内过十加',
    helperText: '先凑到 10，再往上加',
    color: 'var(--candy-lavender-dark)',
    textColor: 'var(--candy-lavender-dark)',
    stars: 5
  },
  {
    id: 22,
    name: '22',
    level: '8组',
    range: [0, 20],
    operation: 'subtract',
    stage: 'subtractFromTen',
    questionCount: 32,
    description: '从 10 往下减',
    helperText: '先练 10 附近减法',
    color: 'var(--candy-mint-light)',
    textColor: 'var(--candy-mint-dark)',
    stars: 4
  },
  {
    id: 23,
    name: '23',
    level: '8组',
    range: [0, 20],
    operation: 'subtract',
    stage: 'bridgeTenSubtract',
    questionCount: 36,
    description: '20 以内退位减',
    helperText: '先退回 10，再减下去',
    color: 'var(--candy-mint-light)',
    textColor: 'var(--candy-mint-dark)',
    stars: 5
  },
  {
    id: 24,
    name: '24',
    level: '9组',
    range: [0, 20],
    operation: 'mixed',
    stage: 'withinTwentyMixed',
    questionCount: 36,
    description: '20 以内加减',
    helperText: '把前面学过的都用起来',
    color: 'var(--candy-yellow-light)',
    textColor: 'var(--candy-yellow-dark)',
    stars: 5
  },
  {
    id: 25,
    name: '25',
    level: '9组',
    range: [0, 12],
    operation: 'missingAddMixed',
    stage: 'missingNumberIntro',
    questionCount: 40,
    description: '找空格',
    helperText: '想想哪一个数躲起来了',
    color: 'var(--candy-peach-light)',
    textColor: 'var(--candy-peach-dark)',
    stars: 5
  },
  {
    id: 26,
    name: '26',
    level: '9组',
    range: [0, 20],
    operation: 'mixed',
    stage: 'withinTwentyMixedAdvanced',
    questionCount: 40,
    description: '20 以内综合进阶',
    helperText: '把加减、找空格和凑十一起用起来',
    color: 'var(--candy-peach-light)',
    textColor: 'var(--candy-peach-dark)',
    stars: 5
  }
```

把 `DIFFICULTY_GROUPS` 同步改成：

```javascript
export const DIFFICULTY_GROUPS = [
  { name: '1组', levels: [1, 2, 3], color: 'mint' },
  { name: '2组', levels: [4, 5, 6], color: 'pink' },
  { name: '3组', levels: [7, 8, 9], color: 'yellow' },
  { name: '4组', levels: [10, 11, 12], color: 'peach' },
  { name: '5组', levels: [13, 14, 15], color: 'peach' },
  { name: '6组', levels: [16, 17], color: 'lavender' },
  { name: '7组', levels: [18, 19, 20], color: 'lavender' },
  { name: '8组', levels: [21, 22, 23], color: 'mint' },
  { name: '9组', levels: [24, 25, 26], color: 'yellow' }
]
```

- [ ] **Step 4: 重新运行配置测试，确认通过**

Run:

```bash
npm run test:unit -- tests/unit/difficulty.spec.js
```

Expected:

```text
PASS  tests/unit/difficulty.spec.js
  ✓ exposes 26 ordered levels with the two new capstone stages
  ✓ difficulty groups cover every level exactly once in order
```

- [ ] **Step 5: 提交配置层改动**

```bash
git add tests/unit/difficulty.spec.js src/config/difficulty.js
git commit -m "feat(difficulty): 新增阶段综合关配置"
```

---

### Task 2: 先锁定两个综合关的出题比例与边界

**Files:**
- Modify: `tests/unit/generator.spec.js`

- [ ] **Step 1: 追加 `withinTenMixed` 的失败测试**

在 `tests/unit/generator.spec.js` 现有用例后追加：

```javascript
  test('withinTenMixed keeps the planned 16/8/8 blend across direct, gap, and split prompts', () => {
    const questions = generateQuestions({
      range: [0, 10],
      operation: 'mixed',
      stage: 'withinTenMixed',
      questionCount: 32
    })

    expect(questions).toHaveLength(32)

    const direct = questions.filter((question) => question.mixBucket === 'direct')
    const gap = questions.filter((question) => question.mixBucket === 'gap')
    const split = questions.filter((question) => question.mixBucket === 'split')

    expect(direct).toHaveLength(16)
    expect(gap).toHaveLength(8)
    expect(split).toHaveLength(8)

    direct.forEach((question) => {
      expect(question.missingPart).toBe('answer')
      expect(['+', '-']).toContain(question.operator)
      expect(question.result).toBe(question.answer)
    })

    gap.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('operand2')
      expect(question.result).toBeLessThanOrEqual(10)
      expect(question.answer).toBe(question.operand2)
    })

    split.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('operand1')
      expect(question.operand1).toBeGreaterThanOrEqual(1)
      expect(question.operand2).toBeGreaterThanOrEqual(1)
      expect(question.result).toBeLessThanOrEqual(10)
      expect(question.answer).toBe(question.operand1)
    })
  })
```

- [ ] **Step 2: 再追加 `withinTwentyMixedAdvanced` 的失败测试**

继续在同一文件追加：

```javascript
  test('withinTwentyMixedAdvanced keeps the planned 16/10/8/6 blend across direct, bridge, blank, and bond prompts', () => {
    const questions = generateQuestions({
      range: [0, 20],
      operation: 'mixed',
      stage: 'withinTwentyMixedAdvanced',
      questionCount: 40
    })

    expect(questions).toHaveLength(40)

    const direct = questions.filter((question) => question.mixBucket === 'direct')
    const bridge = questions.filter((question) => question.mixBucket === 'bridge')
    const blank = questions.filter((question) => question.mixBucket === 'blank')
    const bond = questions.filter((question) => question.mixBucket === 'bond')

    expect(direct).toHaveLength(16)
    expect(bridge).toHaveLength(10)
    expect(blank).toHaveLength(8)
    expect(bond).toHaveLength(6)

    direct.forEach((question) => {
      expect(question.missingPart).toBe('answer')
      expect(question.result).toBe(question.answer)
      expect(question.answer).toBeLessThanOrEqual(20)
    })

    bridge.forEach((question) => {
      expect(question.missingPart).toBe('answer')
      expect(['+', '-']).toContain(question.operator)
      expect(question.answer).toBeLessThanOrEqual(20)
    })

    blank.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('operand2')
      expect(question.result).toBeLessThanOrEqual(20)
      expect(question.answer).toBe(question.operand2)
    })

    bond.forEach((question) => {
      expect(question.operator).toBe('+')
      expect(question.missingPart).toBe('answer')
      expect(question.answer).toBe(10)
      expect(question.operand1).toBeGreaterThanOrEqual(1)
      expect(question.operand2).toBeGreaterThanOrEqual(1)
    })
  })
```

- [ ] **Step 3: 运行生成器测试，确认新用例先失败**

Run:

```bash
npm run test:unit -- tests/unit/generator.spec.js
```

Expected:

```text
FAIL  tests/unit/generator.spec.js
+ expected [] to have a length of 32
```

---

### Task 3: 实现综合关题池、分段和混合标签

**Files:**
- Modify: `src/utils/generator.js`
- Modify: `tests/unit/generator.spec.js`

- [ ] **Step 1: 在生成器里增加混合题池帮助函数**

在 `src/utils/generator.js` 的 `createQuestionPool` 下方新增这组小函数，专门服务综合关：

```javascript
function addMixBucket(questions, mixBucket) {
  return questions.map((question) => ({
    ...question,
    mixBucket
  }))
}

function selectFromBucket(questions, count, usedKeys) {
  const picked = []

  shuffle(questions).forEach((question) => {
    const key = `${question.mixBucket}:${getQuestionKey(question)}`

    if (picked.length >= count || usedKeys.has(key)) {
      return
    }

    usedKeys.add(key)
    picked.push(question)
  })

  if (picked.length < count) {
    const fallback = sampleWithRepeats(questions, count - picked.length)
    picked.push(...fallback)
  }

  return picked
}

function createWithinTenMixedBuckets() {
  const addPool = createAdditionPool(0, 10).filter((question) => question.answer <= 10)
  const subtractPool = createSubtractionPool(0, 10)
  const missingPool = createMissingAdditionPool(0, 10, true)

  return {
    direct: addMixBucket([...addPool, ...subtractPool], 'direct'),
    gap: addMixBucket(
      missingPool.filter((question) => (
        question.missingPart === 'operand2' &&
        question.operand1 >= 1 &&
        question.operand2 >= 1 &&
        question.result <= 10
      )),
      'gap'
    ),
    split: addMixBucket(
      missingPool.filter((question) => (
        question.missingPart === 'operand1' &&
        question.operand1 >= 1 &&
        question.operand2 >= 1 &&
        question.result <= 10
      )),
      'split'
    )
  }
}

function createWithinTwentyAdvancedBuckets() {
  const addPool = createAdditionPool(0, 20).filter((question) => question.answer <= 20)
  const subtractPool = createSubtractionPool(0, 20).filter((question) => question.answer <= 20)
  const missingPool = createMissingAdditionPool(0, 20, true)

  return {
    direct: addMixBucket(
      [
        ...addPool.filter((question) => (
          (question.operand1 >= 10 || question.operand2 >= 10) &&
          Math.min(question.operand1, question.operand2) <= 3
        )),
        ...subtractPool.filter((question) => (
          question.operand1 >= 10 &&
          question.operand2 <= 3 &&
          question.answer >= 10
        ))
      ],
      'direct'
    ),
    bridge: addMixBucket(
      [
        ...addPool.filter((question) => (
          question.operand1 < 10 &&
          question.operand2 < 10 &&
          question.answer > 10
        )),
        ...subtractPool.filter((question) => (
          question.operand1 >= 10 &&
          question.answer < 10 &&
          question.operand2 >= 1
        ))
      ],
      'bridge'
    ),
    blank: addMixBucket(
      missingPool.filter((question) => (
        question.missingPart === 'operand2' &&
        question.operand1 >= 1 &&
        question.operand2 >= 1 &&
        question.result <= 20
      )),
      'blank'
    ),
    bond: addMixBucket(
      addPool.filter((question) => (
        question.answer === 10 &&
        question.operand1 >= 1 &&
        question.operand2 >= 1
      )),
      'bond'
    )
  }
}
```

- [ ] **Step 2: 增加按 bucket 抽题的 stage 分发**

继续在 `src/utils/generator.js` 中新增：

```javascript
function selectCapstoneQuestions(stage, questionCount) {
  const usedKeys = new Set()

  if (stage === 'withinTenMixed') {
    const buckets = createWithinTenMixedBuckets()

    return shuffle([
      ...selectFromBucket(buckets.direct.filter((q) => q.answer <= 6 || q.operand2 <= 2), 6, usedKeys),
      ...selectFromBucket(buckets.direct.filter((q) => q.answer <= 9 || q.operand2 <= 4), 5, usedKeys),
      ...selectFromBucket(buckets.direct.filter((q) => q.answer <= 10), 5, usedKeys),
      ...selectFromBucket(buckets.gap.filter((q) => q.result <= 6), 3, usedKeys),
      ...selectFromBucket(buckets.gap.filter((q) => q.result <= 8), 3, usedKeys),
      ...selectFromBucket(buckets.gap.filter((q) => q.result <= 10), 2, usedKeys),
      ...selectFromBucket(buckets.split.filter((q) => q.result <= 6), 3, usedKeys),
      ...selectFromBucket(buckets.split.filter((q) => q.result <= 8), 3, usedKeys),
      ...selectFromBucket(buckets.split.filter((q) => q.result <= 10), 2, usedKeys)
    ]).slice(0, questionCount)
  }

  if (stage === 'withinTwentyMixedAdvanced') {
    const buckets = createWithinTwentyAdvancedBuckets()

    return shuffle([
      ...selectFromBucket(buckets.direct.filter((q) => q.answer <= 12), 6, usedKeys),
      ...selectFromBucket(buckets.direct.filter((q) => q.answer <= 16), 6, usedKeys),
      ...selectFromBucket(buckets.direct.filter((q) => q.answer <= 20), 4, usedKeys),
      ...selectFromBucket(buckets.bridge.filter((q) => q.answer <= 12), 3, usedKeys),
      ...selectFromBucket(buckets.bridge.filter((q) => q.answer <= 16), 4, usedKeys),
      ...selectFromBucket(buckets.bridge.filter((q) => q.answer <= 20), 3, usedKeys),
      ...selectFromBucket(buckets.blank.filter((q) => q.result <= 12), 3, usedKeys),
      ...selectFromBucket(buckets.blank.filter((q) => q.result <= 16), 3, usedKeys),
      ...selectFromBucket(buckets.blank.filter((q) => q.result <= 20), 2, usedKeys),
      ...selectFromBucket(buckets.bond.filter((q) => Math.min(q.operand1, q.operand2) <= 2), 2, usedKeys),
      ...selectFromBucket(buckets.bond.filter((q) => Math.min(q.operand1, q.operand2) <= 4), 2, usedKeys),
      ...selectFromBucket(buckets.bond, 2, usedKeys)
    ]).slice(0, questionCount)
  }

  return null
}
```

- [ ] **Step 3: 让 `generateQuestions` 优先走综合关分支**

把 `generateQuestions` 的核心逻辑替换成下面这个结构：

```javascript
export function generateQuestions(difficulty) {
  if (!difficulty || !difficulty.range) {
    console.warn('[generator] 无效的难度配置:', difficulty)
    return []
  }

  const { range, operation, questionCount, stage } = difficulty
  const capstoneQuestions = selectCapstoneQuestions(stage, questionCount)

  if (capstoneQuestions) {
    return capstoneQuestions.map((question, index) => prepareQuestion(question, index))
  }

  const [min, max] = range
  const pool = createQuestionPool(operation, min, max)

  if (!pool.length) {
    return []
  }

  const questions = selectBySegments(pool, getStageSegments(difficulty), questionCount)

  return questions.map((question, index) => prepareQuestion(question, index))
}
```

- [ ] **Step 4: 运行生成器测试，确认两个新综合关都通过**

Run:

```bash
npm run test:unit -- tests/unit/generator.spec.js
```

Expected:

```text
PASS  tests/unit/generator.spec.js
  ✓ withinTenMixed keeps the planned 16/8/8 blend across direct, gap, and split prompts
  ✓ withinTwentyMixedAdvanced keeps the planned 16/10/8/6 blend across direct, bridge, blank, and bond prompts
```

- [ ] **Step 5: 运行配置测试做交叉回归**

Run:

```bash
npm run test:unit -- tests/unit/difficulty.spec.js tests/unit/generator.spec.js
```

Expected:

```text
PASS  tests/unit/difficulty.spec.js
PASS  tests/unit/generator.spec.js
```

- [ ] **Step 6: 提交生成器改动**

```bash
git add src/utils/generator.js tests/unit/generator.spec.js
git commit -m "feat(generator): 增加阶段综合关出题规则"
```

---

### Task 4: 同步难度文档并补一条更深列表的冒烟回归

**Files:**
- Modify: `docs/DIFFICULTY_CURVE.md`
- Modify: `tests/e2e/smoke.spec.js`

- [ ] **Step 1: 更新主线文档为 26 关**

先把 `docs/DIFFICULTY_CURVE.md` 顶部说明和主线表格尾部改成下面这组内容：

```markdown
这份文档用于说明当前 26 关主线的学习目标、典型题型和难度边界。
```

把第 17 关之后的表格行更新为：

```markdown
| 第17关 | 10 以内综合 | 16 | 把加减、找缺口、拆分串起来 | `6+2` `9-3` `4+?=9` `?+3=8` | 超过 10 的题 |
| 第18关 | 10几加几 | 16 | 超过 10 的数感过渡 | `10+1` `11+2` `12+3` | `5+6` `4+7` |
| 第19关 | 10几减几 | 16 | 10几数减去小数 | `11-1` `12-2` `13-3` | `13-7` `15-8` |
| 第20关 | 凑到 10 | 16 | 把凑十搭配练稳 | `9+1` `8+2` `7+3` | 直接进入 `8+4` |
| 第21关 | 20 以内过十加 | 16 | 学会桥接十 | `9+2` `8+3` `5+6` | `10+2` 这类已在前面解决的题为主角 |
| 第22关 | 从 10 往下减 | 16 | 先练 10 附近减法 | `10-1` `10-4` `12-2` | `13-7` `15-8` |
| 第23关 | 20 以内退位减 | 18 | 学会退位减 | `11-2` `12-4` `13-5` | 特别大的退位跨度过早出现 |
| 第24关 | 20 以内加减 | 18 | 综合运用前面策略 | `10+3` `8+4` `13-4` `12-5` | 结果接近 20 的高压题大量出现 |
| 第25关 | 找空格 | 20 | 从计算过渡到关系理解 | `?+3=8` `4+?=10` | 过早出现复杂双向缺项 |
| 第26关 | 20 以内综合进阶 | 20 | 把加减、桥接十、找空格和凑十关系重新组合 | `9+4` `13-5` `8+?=13` `6+4` | 超过 20 的题 |
```

- [ ] **Step 2: 让冒烟测试覆盖更深的关卡列表**

把 `tests/e2e/smoke.spec.js` 的滚动恢复用例改成下面这版：

```javascript
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
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(savedScrollY - 2)
  })
```

- [ ] **Step 3: 先跑单测全集，确认文档同步前代码仍稳定**

Run:

```bash
npm run test:unit
```

Expected:

```text
PASS  tests/unit/difficulty.spec.js
PASS  tests/unit/generator.spec.js
PASS  ...其余现有 unit tests
```

- [ ] **Step 4: 跑 Playwright 冒烟测试**

Run:

```bash
npm run test:e2e
```

Expected:

```text
5 passed
```

- [ ] **Step 5: 提交文档与回归测试改动**

```bash
git add docs/DIFFICULTY_CURVE.md tests/e2e/smoke.spec.js
git commit -m "docs(curve): 同步阶段综合关主线说明"
```

---

### Task 5: 最终验证与交付检查

**Files:**
- Modify: none

- [ ] **Step 1: 查看最终 diff，确认只包含计划内文件**

Run:

```bash
git diff --stat HEAD~3..HEAD
```

Expected:

```text
 src/config/difficulty.js
 src/utils/generator.js
 tests/unit/difficulty.spec.js
 tests/unit/generator.spec.js
 tests/e2e/smoke.spec.js
 docs/DIFFICULTY_CURVE.md
```

- [ ] **Step 2: 运行最终验证命令**

Run:

```bash
npm run test:unit && npm run test:e2e
```

Expected:

```text
All unit tests passed
5 passed
```

- [ ] **Step 3: 输出交付摘要**

在最终说明中明确写出：

```text
新增了第17关“10 以内综合”和第26关“20 以内综合进阶”；
总关卡数现为 26；
综合关通过 mixBucket 规则精确控制题型比例；
DifficultySelect、Home 进度、解锁逻辑继续复用 TOTAL_LEVELS / DIFFICULTY_GROUPS 自动生效。
```

