# 数感闯关项目架构

> 软件全称：数感闯关儿童数学启蒙训练软件｜产品简称：数感闯关｜软件版本：V1.0

本文描述数感闯关儿童数学启蒙训练软件的当前运行时结构。源码与配置优先于历史设计稿。

## 运行时结构

应用由 Vue 3、Vue Router 和 Vite 构建，不使用后端服务、Pinia 或 TypeScript。

```mermaid
flowchart TD
  Home["/ 首页"] --> Difficulty["/difficulty 选关"]
  Home --> Explore["/explore 数字探索"]
  Difficulty --> Game["/game/:id 游戏"]
  Game --> Result["ResultModal 结算"]
  Result --> Game
  Result --> Difficulty
```

路由组件均采用动态导入。未知路径重定向到首页。

## 游戏数据流

```mermaid
flowchart LR
  DifficultyConfig["difficulty.js"] --> Generator["generator.js"]
  Generator --> UseGame["useGame"]
  UseGame --> GamePage["Game.vue"]
  GamePage --> QuestionCard
  GamePage --> ScoreBoard
  GamePage --> ResultModal
  GamePage --> Storage["useStorage"]
  Storage --> LocalStorage
```

`useGame` 负责：

- 根据关卡配置生成或准备题目
- 当前题目、索引、分数、正确数、错题和逐题作答结果
- 正确率、整轮前台耗时，以及扣除后台停留的逐题耗时
- 逐题的 `usedHint`、`wasInterrupted` 和从算式推导的 `skillId`
- 正常回合与指定错题列表重新开局

`Game.vue` 负责：

- 输入节流、提交和反馈时序
- 正确答案自动推进，错误答案手动确认
- 连对提示、振动和音效触发
- 正常结算、重新开始和错题重练
- 从本关本地薄弱账本读取题目并传给正常组卷
- 小球辅助偏好持久化

题目卡本身保持稳定，只对算式内容执行轻量切换动画，避免换题时卡片和数字键盘跳位。

## 用户玩法规则

- 软件包含两种模式：主线闯关用于递进式加减训练，数字探索用于 1–1000 的十进制数量观察和猜数练习。
- 主线共 26 关，必须按顺序解锁；第 1 关默认开放。
- 每关完成全部配置题目后结算，正确率达到 85% 即为通过。
- 正确答案自动进入下一题；错误答案展示正确结果，等待用户确认后再继续。
- 结算页支持查看错题、重新开始和仅重练错题。错题重练不改变最佳成绩、解锁状态或计时榜。
- 有尚未掌握的薄弱记录时，正常回合以 50% 为目标，在教学配额内复习本关错题、慢题及同能力变式，不提供额外训练入口或题目标签。
- 数字探索独立于主线关卡，提供 1–1000 自由查看和按数量范围的猜数挑战，不写入主线通关进度。

## 题目生成

关卡事实来源：

- `src/config/difficulty.js`：26 个关卡、分组、题量和阶段
- `src/utils/generator.js`：候选题池、阶段分段和抽题策略

常规关卡先按热身、核心、挑战约 `40% / 40% / 20%` 生成基础题目，十组成与综合关使用专门的题型配比。第12关混合加法求和、右侧补数与从 10 减法，第20关再加入左侧补数。完整有效题池统一限制运算结果范围，并校验历史薄弱题是否仍符合当前阶段。

自适应组卷以 50% 为目标，按约 50% 错题、50% 慢题分配，某类容量不足时由另一类补足。每道基础题保留内部 `samplingGroup`，替换候选必须属于相同教学配额，且与薄弱来源的能力相同。薄弱来源分配允许在兼容位置间调整，避免抢占其他能力唯一可用的位置；同能力候选或重复间隔容量不足时，剩余位置保留正常题，不强行填满 50%。因此热身、核心、挑战及综合关题型数量均不因复习而改变。`samplingGroup` 只用于本轮组卷，不写入题目快照或儿童题面。

`questionSkills.js` 从运算符、数量范围和缺项位置推导 `skillId`，不信任旧记录中的能力标签。能力区分补十、普通缺项、凑十求和、跨十加法、十几加法、双倍、小步加法、普通加法、跨十减法、从 10 减法、十几减法和普通/小步减法，并区分 5、10、20 以内。左右缺项分别归类，例如 `within10:ten-complement:operand2`；`8+5` 与 `9+7` 同属 `within20:bridge-add`，不会以 `13+2` 替代这类薄弱练习。

最终顺序优先让同题间隔至少三道其他题，题池不足时逐步缩短间隔。所有题目通过 `prepareQuestion()` 补齐 `id`、`result`、`missingPart`、能力及全新的作答标记，错题重练不会继承上次的小球或中断状态。

## 持久化

`useStorage` 使用模块级 `shallowRef` 缓存 LocalStorage 数据，并监听 `storage` 事件同步其他标签页。

`math-game-data` 当前结构：

```javascript
{
  bestScores: {
    [difficultyId]: {
      score,
      correctCount,
      totalCount,
      accuracy,
      duration,
      durationMs,
      completedAt
    }
  },
  leaderboards: {
    [difficultyId]: [
      { durationMs, completedAt, totalCount }
    ]
  },
  progress: {},
  stats: {
    totalAnswers,
    totalCorrect,
    mistakeLedger,
    difficultyStats: {
      [difficultyId]: {
        avgTime,
        totalPlayed,
        avgResponseTimeMs,
        responseSampleCount,
        responseStatsBySkill: {
          [skillId]: {
            avgResponseTimeMs,
            responseSampleCount,
            assistedCount,
            interruptedCount
          }
        }
      }
    },
    weakQuestionLedger: {
      [questionKey]: {
        question,
        difficultyId,
        skillId,
        wrongCount,
        slowCount,
        correctStreak,
        totalAttempts,
        assistedCount,
        interruptedCount,
        lastUsedHint,
        lastWasInterrupted,
        lastAnswer,
        lastSeenAt
      }
    }
  }
}
```

关键规则：

- 通过线为 `85%`。
- 完成状态由最佳成绩正确率推导。
- 每关保存前 10 名计时记录。
- 慢题按本关同能力历史独立正确作答均值的 `1.5` 倍识别，并设 `5s` 最低阈值。历史至少 3 个样本才启用；否则本轮同能力有至少 3 个有效样本时用中位数，样本不足时先用 `5s` 阈值。旧整关汇总不跨能力用于慢题判断。
- 使用小球、发生后台中断或耗时缺失/非正数的作答不进入速度样本，也不增加快速掌握次数。辅助答对重置独立快答连续次数，中断或无有效计时的正确作答保留原次数；答错始终记错题并重置次数。
- 薄弱题连续 3 次有效独立快速答对后不再作为自身的强化来源；它仍可能被正常组卷或同能力变式选中。再次答错或慢答会重置连续正确次数。
- 小球使用在作答前展示过即记为使用，之后关闭仍保留记录；已答题目的反馈辅助不改变该次作答记录。每关能力统计记录辅助与中断次数。
- `visibilitychange` 驱动前后台计时，重复事件不重复扣时；后台自动切到下一题时，该题以暂停状态开始。整轮耗时同样扣除后台时间，最终结果在完成时锁定。
- 错题重练会更新薄弱掌握情况，但不写入累计答题数、最佳成绩、解锁状态、关卡速度统计或计时榜。
- 榜单按当前关卡 `questionCount` 过滤，不混用不同题量的成绩。
- 无 `totalCount` 的旧榜单条目无法确认可比性，不显示在当前榜单。
- 旧版或部分损坏的统计结构会补齐默认字段；旧薄弱题读取时从算式推导能力，下次更新时写入新字段。缺少或损坏的逐能力速度统计会重新积累，原进度、成绩和汇总仍保留。

## 小球辅助

`QuestionCard.vue` 承载开关，`NumberBondHint.vue` 负责图形：

- 加法：两组不同颜色的小球。
- 减法：保留与划掉的小球。
- 缺项加法：实心表示已知，空心表示未知。
- 每行 10 个位置，最多渲染 30 个，超出部分显示 `+N`。
- 默认关闭，偏好保存在 `math-game-number-bond-hint-enabled`。

## 数字探索

`NumberExplore.vue` 管理自由探索和范围挑战；`BallArray.vue` 使用 Three.js 渲染 1-1000。

- X、Y、Z 方向分别表达个位、十位和百位层次。
- 移动端默认缓慢自动旋转并保留页面滚动。
- 桌面端通过 OrbitControls 支持旋转和缩放。
- `three` 在 Vite 构建中单独拆包。

## 音频与触觉

`useSound.js` 集中管理单例 AudioContext：

- 交互音效由振荡器生成。
- master gain 和 low-pass filter 统一控制输出。
- 各音效有独立冷却时间。
- 页面恢复时尝试恢复被中断的音频上下文。
- 结算语音来自 `public/audio/praise/*.mp3`，每轮只播放一个主反馈。

音效和振动默认开启，目前没有设置开关。Vibration API 不可用时静默降级。

## PWA

PWA 只有一条实现链：

1. `vite-plugin-pwa` 在构建时生成 Workbox Service Worker。
2. `public/manifest.json` 提供应用清单。
3. `PWAUpdatePrompt.vue` 使用 `virtual:pwa-register` 提示用户刷新。

开发环境不启用 Service Worker。详细配置见 [`../PWA.md`](../PWA.md)。

## 测试与 CI

- 包管理器：pnpm 11，依赖锁定文件为 `pnpm-lock.yaml`
- Vitest：`tests/unit/`
- Playwright：`tests/e2e/smoke.spec.js`
- 构建与单测：`.github/workflows/ci.yml`
- E2E：`.github/workflows/e2e-smoke.yml`

Playwright 配置包含 Pixel 7 和 iPhone 13 两套移动设备参数，但当前未显式配置 WebKit，CI 也只安装 Chromium。因此 E2E 是两套移动端 Chromium 模拟，不能替代 iOS Safari 真机验证。

## 无障碍交互

- `App.vue` 提供跳到主内容的链接，各路由页暴露唯一主内容目标。
- 选关使用原生按钮语义，支持键盘选择并明确播报锁定状态。
- 错误反馈、结算和 PWA 更新使用对话框语义；模态界面打开时隔离背景、约束焦点，关闭后恢复焦点。
- Toast、加载和答题状态通过 live region 播报。
- Three.js 球阵提供数量及十进制位值拆解的文字替代。

浏览器缩放保持可用；触摸优化不得通过 viewport 或脚本禁用缩放。
