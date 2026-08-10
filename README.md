# 数感闯关儿童数学启蒙训练软件

**软件全称：数感闯关儿童数学启蒙训练软件；产品简称：数感闯关；软件版本：V1.0。**

开发包遵循语义化版本，`package.json` 当前为 `1.0.0`；它对应本软件的对外版本 `V1.0`。

数感闯关是一款面向学前大班及小学低年级儿童的移动优先数学启蒙训练软件。软件提供两种相互补充的训练模式：以 20 以内加减为核心的 **主线闯关模式**，以及帮助理解百、十、个位结构的 **数字探索模式**。

## 适用对象与训练范围

- **适用对象**：具备基础数字认读能力、正在学习或巩固 20 以内加减的儿童；成人可按儿童的实际学习进度陪同使用。
- **主线训练**：从 0–3 加减开始，逐步进入 5 以内和 10 以内的组合、拆分与缺项，再过渡到十几加减、凑十、破十及 20 以内综合。
- **数字探索**：输入或猜测 1–1000 的数量，查看十进制球阵和百、十、个位拆解；它是数位理解练习，不替代主线闯关。

## 两种训练模式

| 模式 | 入口 | 训练内容 | 进度与成绩 |
|------|------|----------|------------|
| **主线闯关** | 首页“开始闯关” | 26 个顺序解锁关卡，覆盖 0–3 加减、组合拆分、找缺数、凑十、破十和 20 以内综合 | 正确率达到 85% 通过；保存关卡进度、最佳成绩和同题量计时榜 |
| **数字探索** | 首页“数字探索” | 自由查看或猜测 1–1000 的数量，通过 3D 十进制球阵观察百、十、个位 | 独立练习，不影响主线解锁、最佳成绩或计时榜 |

## 玩法说明

1. 从首页选择“开始闯关”，第 1 关默认可玩；通过当前关后才会解锁下一关。
2. 每关随机生成 20–40 题。存在尚未掌握的薄弱记录时，约一半题目会无感复习本关错题、慢题或同类变式；儿童无需进入单独训练模式。
3. 答对会自动进入下一题；答错会显示正确答案，点击继续后再进入下一题，避免在错误反馈中被自动切走。
4. 完成本关全部题目后，正确率达到 **85%** 即为通过。结算页可查看错题、重新开始，或仅重练本轮错题。
5. 小球辅助默认关闭。需要数量提示时可在支持的题目中打开：加法显示两组小球，减法显示保留与拿走的小球，缺项加法用实心和空心小球表达已知与未知数量。
6. 正常闯关会记录最佳成绩和同题量计时榜；错题重练只用于巩固，不更新最佳成绩、解锁状态或计时榜。

## 当前能力

- **26 关主线训练**：从 0-3 加减逐步进入 10 以内关系理解、凑十、20 以内过十与退位。
- **移动优先作答**：大尺寸数字键盘、触摸反馈、安全区域和紧凑竖屏布局。
- **即时反馈**：答对后自动进入下一题；答错时展示正确答案，确认后继续。
- **错题重练**：结算页可查看本轮错题，并仅用错题重新开始一轮。
- **无感巩固**：存在尚未掌握的薄弱记录时，正常闯关混入 50% 的错题、慢题和同题型变式；薄弱部分约按错题 50%、慢题 50% 分配，某类不存在时由另一类补足。连续 3 次快速答对后退出强化抽题。
- **小球辅助**：可按题目开启；支持加法合并、减法拿走和缺项题空位表达。
- **本地成绩**：保存最佳成绩和每关前 10 名完成时间；计时榜只比较与当前关卡题量一致的记录。
- **数字探索**：自由输入或在 17 个数量范围中猜数，通过 3D 十进制球阵理解 1–1000。
- **音效与鼓励语音**：交互音效由 Web Audio API 生成，结算语音使用本地 MP3。
- **PWA**：支持安装、离线缓存和应用内更新提示。

## 快速开始

要求 Node.js 20 或兼容版本，以及 pnpm 11。项目只维护 `pnpm-lock.yaml`，本地开发和 CI 使用同一套依赖解析结果。

```bash
pnpm install
pnpm run dev
```

开发服务器默认使用 Vite 端口，通常为 `http://localhost:5173`。

常用命令：

```bash
pnpm run build             # 生产构建
pnpm run preview           # 预览生产构建
pnpm run test:unit         # Vitest 单元测试
pnpm run test:e2e          # Playwright 冒烟测试
pnpm run test:e2e:headed   # 可见浏览器运行 E2E
pnpm run test:e2e:ui       # Playwright UI
pnpm run test:e2e:install  # 安装 Chromium
pnpm run generate-icons    # 重新生成 PWA PNG 图标
```

## 页面与操作流程

| 路由 | 页面 | 作用 |
|------|------|------|
| `/` | `Home.vue` | 首页、训练入口和数字探索入口 |
| `/difficulty` | `DifficultySelect.vue` | 关卡选择、解锁状态和最快时间 |
| `/game/:id` | `Game.vue` | 作答、反馈、结算与错题重练 |
| `/explore` | `NumberExplore.vue` | 自由探索和猜数挑战 |

主线闯关规则：

1. 从首页进入选关页。
2. 通过上一关后解锁下一关。
3. 完成当前关卡配置的全部题目。
4. 达到 `85%` 正确率即视为通过。
5. 正常闯关成绩可更新最佳成绩和同题量计时榜；错题重练不参与榜单。

数字探索模式流程：

1. 从首页选择“数字探索”，切换“自由探索”或“猜数挑战”。
2. 自由探索可输入 1–1000，或快速选择 10、50、100、500、1000 后确认查看球阵。
3. 猜数挑战按预设数量范围随机出题；提交数字后显示实际数量和是否猜中，可继续同一范围或选择其他范围。

## 关卡与题量

关卡配置的唯一事实来源是 [`src/config/difficulty.js`](./src/config/difficulty.js)。当前共 26 关，题量范围为 20-40 题。

| 阶段 | 关卡 | 重点 |
|------|------|------|
| 数感起步 | 1-6 | 0-5 加减与混合 |
| 组合关系 | 7-9 | 5 以内组合、找缺数、拆分 |
| 10 以内 | 10-17 | 入门、组成、缺项、完整加减与综合 |
| 20 以内过渡 | 18-20 | 十几加减与凑十 |
| 凑十与破十 | 21-24 | 凑十加法、10 附近减法、破十减法、综合 |
| 关系综合 | 25-26 | 找缺数与 20 以内综合进阶 |

完整题量和典型题型见 [`docs/DIFFICULTY_CURVE.md`](./docs/DIFFICULTY_CURVE.md)。

## 数据存储

项目不使用后端或 Pinia，成绩、进度和小球辅助偏好只保存在当前浏览器的 LocalStorage，不会自动同步到其他设备或账号。

| 键 | 内容 |
|----|------|
| `math-game-data` | 最佳成绩、同题量计时榜、累计统计、逐题薄弱记录和关卡进度 |
| `math-game-number-bond-hint-enabled` | 小球辅助开关偏好 |

计时榜条目包含 `durationMs`、`completedAt` 和 `totalCount`。读取榜单时会按当前关卡题量过滤，因此旧题量或无法确认题量的历史记录不会参与当前排名。

清除本地数据：

```javascript
localStorage.removeItem('math-game-data')
localStorage.removeItem('math-game-number-bond-hint-enabled')
```

## 测试与质量

单元测试覆盖题目生成、游戏状态、存储兼容、星级规则、音频逻辑和关键组件。

Playwright 冒烟测试覆盖：

- 深层关卡返回后恢复选关页滚动位置
- 正确作答与进度推进
- 错误反馈与恢复
- 完整通关和返回选关页
- PWA manifest 与页面元数据
- 键盘选关、错误反馈继续操作和焦点恢复

`playwright.config.js` 当前使用 Pixel 7 和 iPhone 13 两种移动设备配置。两者默认运行在 Playwright Chromium；配置名 `mobile-safari` 代表 iPhone 视口和用户代理模拟，不等同于 WebKit 真机测试。iOS Safari 音频、PWA 和触摸行为仍需真机验证。

合并前至少运行：

```bash
pnpm run build
pnpm run test:unit
pnpm run test:e2e
```

## 技术栈

- Vue 3 + `<script setup>`
- Vue Router 4
- Vite 7
- Tailwind CSS 3 + 组件 scoped CSS + 全局 CSS 变量
- Three.js
- Lucide Vue Next
- vite-plugin-pwa / Workbox
- Vitest + Vue Test Utils
- Playwright
- JavaScript，不使用 TypeScript

## 项目结构

```text
src/
├── assets/styles/       # CSS 变量和公共动画
├── components/          # 可复用界面组件
├── composables/         # 游戏、存储、音频、Toast
├── config/              # 难度和常量
├── pages/               # 四个路由页面
├── utils/               # 出题、星级和格式化工具
├── App.vue
├── main.js
├── router.js
└── style.css

public/
├── audio/praise/        # 本地结算鼓励语音
├── icons/               # PWA 图标
└── manifest.json

tests/
├── unit/
└── e2e/
```

## 文档导航

| 文档 | 内容 |
|------|------|
| [`AGENTS.md`](./AGENTS.md) | 代理与开发者必须遵循的项目规则 |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | 开发流程、测试和提交规范 |
| [`DESIGN.md`](./DESIGN.md) | 当前视觉、移动端、交互和无障碍规范 |
| [`COMPONENTS.md`](./COMPONENTS.md) | 组件职责、props、events 和关键行为 |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | 路由、数据流、音频、存储和 PWA 架构 |
| [`docs/DIFFICULTY_CURVE.md`](./docs/DIFFICULTY_CURVE.md) | 26 关课程和题量 |
| [`SOUND_SYSTEM_SIMPLE.md`](./SOUND_SYSTEM_SIMPLE.md) | 当前音频系统 |
| [`PWA.md`](./PWA.md) | PWA 配置、构建与验证 |
| [`CHANGELOG.md`](./CHANGELOG.md) | 未发布和历史变更 |

`specs/`、`docs/superpowers/` 和 `design-system/` 保存历史方案或设计参考，不是当前行为的事实来源。

## 文档维护

更新行为时同步维护对应文档：

- 关卡、题量、题型：`difficulty.js`、生成器测试、`DIFFICULTY_CURVE.md`
- props/events：组件源码、组件测试、`COMPONENTS.md`
- 存储结构：`useStorage.js`、存储测试、`ARCHITECTURE.md`
- PWA：`vite.config.js`、`manifest.json`、`PWA.md`
- 用户可见变化：README 和 `CHANGELOG.md` 的 `Unreleased`

本项目仅供学习和个人使用。
