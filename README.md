# 数学运算游戏

面向儿童的移动优先数学启蒙游戏，使用 Vue 3 构建。项目提供 26 个渐进式加减法关卡、错题重练、同题量计时榜、小球辅助，以及 1-1000 的 Three.js 数字探索。

## 当前能力

- **26 关主线训练**：从 0-3 加减逐步进入 10 以内关系理解、凑十、20 以内过十与退位。
- **移动优先作答**：大尺寸数字键盘、触摸反馈、安全区域和紧凑竖屏布局。
- **即时反馈**：答对后自动进入下一题；答错时展示正确答案，确认后继续。
- **错题重练**：结算页可查看本轮错题，并仅用错题重新开始一轮。
- **小球辅助**：可按题目开启；支持加法合并、减法拿走和缺项题空位表达。
- **本地成绩**：保存最佳成绩和每关前 10 名完成时间；计时榜只比较与当前关卡题量一致的记录。
- **数字探索**：自由输入或范围挑战，通过 3D 十进制球阵理解 1-1000。
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

## 路由与流程

| 路由 | 页面 | 作用 |
|------|------|------|
| `/` | `Home.vue` | 首页、训练入口和数字探索入口 |
| `/difficulty` | `DifficultySelect.vue` | 关卡选择、解锁状态和最快时间 |
| `/game/:id` | `Game.vue` | 作答、反馈、结算与错题重练 |
| `/explore` | `NumberExplore.vue` | 自由探索和范围挑战 |

主线流程：

1. 从首页进入选关页。
2. 通过上一关后解锁下一关。
3. 完成当前关卡配置的全部题目。
4. 达到 `85%` 正确率即视为通过。
5. 正常闯关成绩可更新最佳成绩和同题量计时榜；错题重练不参与榜单。

## 关卡与题量

关卡配置的唯一事实来源是 [`src/config/difficulty.js`](./src/config/difficulty.js)。当前共 26 关，题量范围为 20-40 题。

| 阶段 | 关卡 | 重点 |
|------|------|------|
| 数感起步 | 1-6 | 0-5 加减与混合 |
| 组合关系 | 7-9 | 5 以内组合、找缺口、拆分 |
| 10 以内 | 10-17 | 入门、组成、缺项、完整加减与综合 |
| 20 以内过渡 | 18-20 | 10 几加减与凑十 |
| 过十与退位 | 21-24 | 过十加、10 附近减法、退位减、综合 |
| 关系综合 | 25-26 | 找空格与 20 以内综合进阶 |

完整题量和典型题型见 [`docs/DIFFICULTY_CURVE.md`](./docs/DIFFICULTY_CURVE.md)。

## 数据存储

项目不使用后端或 Pinia，数据保存在浏览器 LocalStorage。

| 键 | 内容 |
|----|------|
| `math-game-data` | 最佳成绩、同题量计时榜、累计统计和关卡进度 |
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
