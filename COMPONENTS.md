# 数感闯关组件说明

> 软件全称：数感闯关儿童数学启蒙训练软件｜产品简称：数感闯关｜软件版本：V1.0

本文记录当前 `src/components/` 中组件的职责和公开接口。源码中的 `defineProps` / `defineEmits` 是最终事实来源。

## 核心游戏组件

### QuestionCard

显示题号、算式、输入状态和可选小球辅助开关。换题时卡片保持不动，仅算式内容进行轻量交叉过渡。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `question` | Object | 必填 | 标准化题目对象 |
| `difficulty` | Object | `null` | 当前关卡配置 |
| `showAnswer` | Boolean | `false` | 是否进入答案反馈状态 |
| `userAnswer` | String | `''` | 当前输入 |
| `currentIndex` | Number | `0` | 当前题目索引 |
| `totalQuestions` | Number | `20` | 本轮题量 |
| `showNumberBondHint` | Boolean | `false` | 是否显示小球辅助 |
| `showNumberBondHintToggle` | Boolean | `false` | 是否显示小球开关 |

事件：

- `toggle-number-bond-hint`

标准题目对象：

```javascript
{
  id: 1,
  operand1: 3,
  operand2: 2,
  operator: '+',
  result: 5,
  answer: 5,
  missingPart: 'answer',
  userAnswer: null,
  isCorrect: null
}
```

`missingPart` 可为 `operand1`、`operand2` 或 `answer`。

### NumberBondHint

将题目转换为最多 30 个二维小球位置，不显示策略文字。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `question` | Object | 必填 | 当前题目 |
| `difficulty` | Object | `null` | 保留的关卡上下文 |
| `enabled` | Boolean | `true` | 是否显示辅助 |

支持所有可计算球数的加法、减法和缺项加法，不只限于 gap/split 关卡。每行固定 10 个位置，超过 30 个时显示 `+N`。

### NumberPad

3×4 数字键盘，包含 0-9、删除和确认。

| Prop | 类型 | 默认值 |
|------|------|--------|
| `disabled` | Boolean | `false` |
| `size` | String | `'normal'` |

事件：

- `input(number)`
- `delete`
- `submit`

`size` 支持 `normal` 和 `compact`，数字探索页使用紧凑模式适配不同视图。

### ScoreBoard

游戏中的紧凑状态区。

| Prop | 类型 | 默认值 |
|------|------|--------|
| `currentIndex` | Number | `0` |
| `totalQuestions` | Number | `0` |
| `correctCount` | Number | `0` |
| `streak` | Number | `0` |

显示进度、剩余题量、正确数，以及连续答对 3 题以上的提示。不在作答过程中显示计时和总分。

### ResultModal

结算弹窗，第一层展示评级、榜单和操作；第二层展示错题列表。

| Prop | 类型 | 默认值 |
|------|------|--------|
| `show` | Boolean | `false` |
| `result` | Object | 必填 |
| `isNewBest` | Boolean | `false` |
| `difficultyId` | Number/String | 必填 |
| `leaderboard` | Array | `[]` |
| `leaderboardRank` | Number | `null` |

事件：

- `retry`
- `retry-mistakes`
- `home`

结果对象包含：

```javascript
{
  score,
  correctCount,
  totalCount,
  accuracy,
  duration,
  durationMs,
  difficulty,
  completedAt,
  incorrectQuestions,
  questionResults,
  isReviewRound
}
```

`questionResults` 保存每道题的正确状态和从题目出现到提交答案的耗时，用于更新本关薄弱记录。榜单由存储层按当前题量过滤。错题重练会更新薄弱掌握情况，但不会更新累计答题数、最佳成绩、解锁状态、关卡速度统计或榜单。

弹窗通过 Teleport 挂载到 `body`，打开时将应用主体设为 inert，并把焦点移入弹窗。Tab/Shift+Tab 在弹窗内循环，关闭后恢复此前焦点；切换错题面板时重新聚焦当前面板的首个操作。

### DifficultyCard

选关卡片。

| Prop | 类型 | 默认值 |
|------|------|--------|
| `difficulty` | Object | 必填 |
| `isLocked` | Boolean | `false` |
| `isCompleted` | Boolean | `false` |
| `bestScore` | Object | `null` |
| `leaderboard` | Array | `[]` |

事件：

- `select(event, difficulty)`

榜单非空时显示最快完成时间。

整张卡片由覆盖层原生按钮承载操作。未锁定卡片可通过 Enter/Space 选择；锁定状态禁用按钮，并通过可访问名称说明当前状态。

## 数字探索

### BallArray

使用 Three.js 将 `count` 表示为十进制 3D 球阵。

| Prop | 类型 | 默认值 |
|------|------|--------|
| `count` | Number | 必填 |
| `size` | String | `'normal'` |

`size="compact"` 用于紧凑场景。移动端默认自动旋转；桌面端支持 OrbitControls。

画布容器使用图片语义，并提供当前数量及百、十、个位拆解的文字替代；加载提示对辅助技术隐藏，避免重复播报。

## 基础设施组件

### PWAUpdatePrompt

通过 `virtual:pwa-register` 监听新 Service Worker。发现更新时显示模态刷新操作，约束焦点并隔离背景；更新失败时恢复按钮状态并显示可操作的错误提示。

### Toast / ToastContainer

`Toast` 接收单个 toast 对象并发出 `remove`；`ToastContainer` 连接全局 `useToast()` 队列。容器作为 polite live region 播报异步消息，关闭按钮提供明确名称和至少 44px 的触摸目标。

### ErrorBoundary

捕获子树渲染错误并显示降级界面，避免整个应用空白。

## 页面组件

页面位于 `src/pages/`：

- `Home.vue`：首页入口与进度摘要
- `DifficultySelect.vue`：关卡选择、解锁和滚动位置恢复
- `Game.vue`：游戏主循环与反馈
- `NumberExplore.vue`：自由探索和范围挑战

页面不是通用组件，其状态流见 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)。
