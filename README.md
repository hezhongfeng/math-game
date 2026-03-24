# 数学运算游戏 ➕

一个专为**手机浏览器**设计的儿童数学启蒙教育游戏，通过趣味互动帮助孩子轻松掌握加减法运算。

> **⚠️ 重要提示**：本项目专为手机浏览器优化，所有功能必须在移动端环境下完整测试通过后才能合并代码。

![数学运算游戏](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)

## 📚 文档导航（建议先读）

| 文档 | 适用场景 |
|------|----------|
| [DESIGN.md](./DESIGN.md) | 设计规范、移动端约束、视觉原则 |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 一页看懂路由、数据流与 PWA 架构 |
| [COMPONENTS.md](./COMPONENTS.md) | 组件职责、输入输出、复用方式 |
| [PWA.md](./PWA.md) | 安装、离线、更新策略 |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 提交流程、测试要求、PR 规范 |
| [CHANGELOG.md](./CHANGELOG.md) | 版本变更与维护规则 |

## 🎯 特性亮点

- 🎨 **简约科技**：酷炫科技感配色（柔和蓝+能量绿），简约而不简单的设计风格
- 🎮 **渐进式学习**：15 个难度等级循序渐进，从 0-3 到 0-100
- 🎉 **即时反馈**：正确/错误视觉反馈 + 触觉 + 合成音效，强化学习节奏
- 📝 **错题回看**：每轮结束自动汇总错题，并支持一键再练
- 📱 **移动优先**：专为触摸屏优化，支持手机和平板
- 💾 **进度保存**：自动保存学习进度和最佳成绩
- 🔒 **关卡解锁**：通过前一关才能挑战更高难度
- 📲 **PWA 支持**：支持离线使用、添加到主屏幕，像原生应用一样体验

### 🎨 简约设计原则

本项目遵循**简约优先**的设计理念，所有 UI/UX 改动都遵循以下原则：

- **简约优先**：避免过度装饰，保持界面清爽，动效简洁有力
- **功能驱动**：每个动效都有明确目的，不添加冗余动画
- **科技感**：蓝绿冷色调，霓虹发光效果，但不过度繁杂
- **性能优先**：所有动效优化确保不影响流畅度
- **儿童友好**：在简约的同时保持趣味性和亲和力

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| **15个难度等级** | 涵盖5个数值范围（0-3、0-5、0-10、0-20、0-100），每个范围包含加法、减法、加减混合三个阶段 |
| **趣味反馈** | 答对时轻量提示并自动下一题；答错时停留在错误反馈卡上，需手动确认后继续 |
| **错题总结** | 结果弹窗展示本轮错题，并支持“再练错题”快速复盘 |
| **成绩记录** | 本地保存最佳成绩，支持进度追踪 |
| **语音播报（规划中）** | 预留能力，当前版本暂未开放入口 |
| **手机优化** | 专为移动端设计的大按钮、触摸优化、响应式布局 |
| **进度锁定** | 需通过前一关才能解锁更高难度 |
| **PWA 离线支持** | 支持离线运行、添加到主屏幕、自动更新 |
| **快捷入口** | 长按应用图标可快速开始游戏或查看成就（Android）|

### 当前能力状态

| 能力 | 状态 | 说明 |
|------|------|------|
| 关卡训练（15关） | ✅ 已实现 | 加减与混合运算，逐级解锁 |
| 本轮错题总结 | ✅ 已实现 | 结算页可回看错题并再次练习 |
| PWA 离线/更新提示 | ✅ 已实现 | 离线可用，应用内更新提示 |
| E2E 冒烟测试 | ✅ 已实现 | Playwright（移动端 Chromium） |
| 语音播报 | 🚧 规划中 | 当前版本未开放入口 |

## 🚀 快速开始

> **⚠️ 测试要求**：所有代码变更必须在手机浏览器（iOS Safari 或 Android Chrome）中测试通过后才能合并。桌面端仅作为辅助测试。

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器将在 `http://localhost:5173` 启动（端口可能不同）。

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## ✅ 测试与质量

### E2E 冒烟测试（Playwright）

```bash
# 首次安装浏览器
pnpm run test:e2e:install

# 无头模式（CI 同款）
pnpm run test:e2e

# 可见浏览器模式
pnpm run test:e2e:headed

# Playwright 可视化 UI
pnpm run test:e2e:ui
```

当前冒烟覆盖：

- 首页 -> 选关 -> 进入游戏页
- 作答后进度推进
- 完成一局 -> 结果弹窗 -> 返回关卡页

### 合并前最低检查

- `pnpm build` 通过
- `pnpm run test:e2e` 通过
- 关键交互在手机浏览器实测通过（iOS Safari / Android Chrome）

## 📱 移动端使用

本游戏专为移动端优化，采用**移动优先（Mobile-First）**设计理念，支持以下特性：

### 触摸优化

| 特性 | 规格 | 说明 |
|------|------|------|
| **触摸目标** | ≥44×44px | 所有按钮满足 WCAG 无障碍标准 |
| **数字键盘按钮** | 64×64px（移动端） | 易于手指点击，防止误触 |
| **响应式间距** | Tailwind md: 前缀 | 桌面端自动放大按钮和间距 |
| **触摸反馈** | active:scale 动画 | 即时视觉反馈确认点击 |

### 移动端适配

- **视口配置**：禁用用户缩放，防止游戏过程中误操作
- **安全区域**：支持刘海屏/灵动岛设备（env(safe-area-inset-\*)）
- **滚动优化**：允许页面滚动，禁止下拉刷新副作用
- **PWA 就绪**：完整 PWA 支持，可添加到主屏幕，离线可用

### 浏览器兼容性

- **iOS Safari（主流在维护版本）**：完整支持
- **微信浏览器**：内置WebView处理
- **现代浏览器**：Chrome、Firefox、Edge等主流浏览器

### 触觉与交互

- **反馈策略**：正确轻提示自动推进；错误反馈停留当前题面，用户手动确认后继续
- **复盘能力**：完成一轮后可查看本轮错题，并直接发起错题重练
- **多通道反馈**：视觉反馈 + 振动 + Web Audio 合成音效
- **产品约束**：音效与振动默认开启，当前版本不提供“音效/震动设置”开关
- **iOS 优化**：-webkit-tap-highlight-color: transparent 去除默认高亮

## 🎮 操作说明

### 桌面端
1. 打开游戏主页，点击「开始游戏」
2. 选择难度等级（需从第一关开始解锁）
3. 使用键盘输入数字答案
4. 按 Enter 键或点击 ✓ 按钮确认
5. 答对得 10 分，答错显示正确答案
6. 完成所有题目后查看成绩与本轮错题总结
7. 可选择“再练错题”进行针对性复盘

### 移动端
1. 打开游戏主页，点击「开始游戏」
2. 选择难度等级（需从第一关开始解锁）
3. 使用屏幕数字键盘输入答案
4. 点击 ✓ 按钮确认
5. 答对时手机会振动并显示轻量反馈
6. 完成所有题目后查看成绩、统计数据和本轮错题
7. 可直接点击“再练错题”继续练习

## 🏗️ 项目结构

```
math-game/
├── src/
│   ├── assets/              # 静态资源（预留目录）
│   ├── components/          # 可复用组件
│   │   ├── DifficultyCard.vue    # 难度卡片
│   │   ├── NumberPad.vue         # 数字键盘（含确认按钮）
│   │   ├── QuestionCard.vue      # 题目卡片
│   │   ├── ResultModal.vue       # 结果弹窗
│   │   ├── ScoreBoard.vue        # 得分板
│   │   ├── Toast.vue             # 吐司提示
│   │   └── ToastContainer.vue    # 吐司容器
│   ├── composables/         # Vue Composables
│   │   ├── useGame.js       # 游戏核心逻辑
│   │   ├── useSound.js      # 音效引擎与反馈音播放
│   │   ├── useStorage.js    # 本地存储
│   │   └── useToast.js      # 吐司提示
│   ├── config/              # 配置文件
│   │   ├── constants.js     # 游戏常量
│   │   └── difficulty.js    # 难度配置
│   ├── pages/               # 页面组件
│   │   ├── DifficultySelect.vue  # 难度选择页
│   │   ├── Game.vue              # 游戏页（含反馈动画）
│   │   └── Home.vue              # 主页
│   ├── utils/               # 工具函数
│   │   └── generator.js          # 题目生成器
│   ├── router.js            # Vue Router 配置
│   ├── main.js              # 应用入口
│   └── style.css            # 全局样式
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 📊 难度设计

### 入门阶段（0-3）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 入门1 | 0-3 以内加法 | 20题 |
| 入门2 | 0-3 以内减法 | 20题 |
| 入门3 | 0-3 加减混合 | 20题 |

### 初级阶段（0-5）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 初级1 | 0-5 以内加法 | 20题 |
| 初级2 | 0-5 以内减法 | 20题 |
| 初级3 | 0-5 加减混合 | 20题 |

### 中级阶段（0-10）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 中级1 | 0-10 以内加法 | 24题 |
| 中级2 | 0-10 以内减法 | 24题 |
| 中级3 | 0-10 加减混合 | 24题 |

### 进级阶段（0-20）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 进级1 | 0-20 以内加法 | 28题 |
| 进级2 | 0-20 以内减法 | 28题 |
| 进级3 | 0-20 加减混合 | 28题 |

### 高级阶段（0-100）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 高级1 | 0-100 以内加法 | 32题 |
| 高级2 | 0-100 以内减法 | 32题 |
| 高级3 | 0-100 加减混合 | 32题 |

## 💾 数据存储

游戏数据保存在浏览器的 LocalStorage 中：

| 键名 | 类型 | 说明 |
|------|------|------|
| `math-game-data` | JSON | 包含最佳成绩和游戏进度 |

### 清除数据

```javascript
localStorage.removeItem('math-game-data')
```

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **Vue 3** | 前端框架（Composition API） |
| **Vite** | 构建工具 |
| **Tailwind CSS** | 原子化 CSS 样式（响应式前缀：sm:, md:, lg:） |
| **Vue Router** | 路由管理 |
| **vite-plugin-pwa** | PWA 生成与更新提示 |
| **Lucide Vue Next** | 图标库 |
| **LocalStorage** | 数据持久化 |

## 🔄 PWA 逻辑

当前 PWA 只保留一条处理链路：

1. `vite.config.js` 通过 `vite-plugin-pwa` 生成 Service Worker
2. `public/manifest.json` 提供应用清单
3. `src/components/PWAUpdatePrompt.vue` 使用 `virtual:pwa-register` 监听更新并提示用户刷新

项目中不再维护第二套手写 Service Worker 或旧的 PWA composable，更新行为以插件配置为唯一事实来源。

## 📱 移动端技术细节

### 视口配置（index.html）

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
```

### 触摸目标规格

```css
/* 数字键盘按钮 - 移动端 */
.num-btn {
  min-height: 64px;
  min-width: 64px;
}

/* 难度卡片 - 最小触摸区域 */
.card {
  min-height: 88px;
}
```

### 安全区域支持

```css
/* 支持刘海屏和灵动岛 */
padding-bottom: max(24px, env(safe-area-inset-bottom));
padding-top: max(10px, env(safe-area-inset-top));
```

### iOS 触摸优化

```css
/* 去除默认蓝色高亮 */
-webkit-tap-highlight-color: transparent;

/* 禁止双击缩放 */
touch-action: manipulation;

/* 流畅滚动 */
-webkit-overflow-scrolling: touch;
```

## 🌐 浏览器兼容性

| 浏览器 | 状态 | 备注 |
|--------|------|------|
| Chrome (Android) | ✅ 完全支持 | 推荐使用 |
| Safari (iOS) | ✅ 完全支持 | |
| Safari (macOS) | ✅ 完全支持 | 触控板支持 |
| Firefox (Android) | ✅ 完全支持 | |
| Edge (iOS/Android) | ✅ 完全支持 | |

### 响应式断点

| 断点 | 前缀 | 典型设备 |
|------|------|----------|
| 默认 | 无 | 手机（320px+） |
| md: | 768px+ | 平板横屏/桌面 |
| lg: | 1024px+ | 桌面显示器 |

### 移动端功能支持

| 功能 | iOS Safari | Android Chrome |
|------|------------|----------------|
| 触摸事件 | ✅ | ✅ |
| LocalStorage | ✅ | ✅ |
| 安全区域 | ✅ iOS 11+ | ✅ Android 5+ |
| 添加到主屏幕 | ✅ | ✅ |
| PWA 离线运行 | ✅ | ✅ |
| 快捷方式 | ❌ | ✅ |

**注意**：
- PWA 功能需要 HTTPS 环境和现代浏览器支持

## ⚠️ 注意事项

- **数据存储**：游戏数据保存在浏览器 LocalStorage 中，清除浏览器数据会导致进度丢失
- **音效策略**：当前版本默认为合成音效常开，不提供开关
- **震动策略**：当前版本默认为触觉反馈常开，不提供开关
- **语音播报**：当前版本未启用，后续若接入将依赖浏览器语音合成能力
- **性能优化**：反馈动画和音效都已收敛为轻量策略，移动端优先稳定流畅

## 📝 开发说明

### 单一事实来源（避免文档漂移）

- 难度与关卡数据：`src/config/difficulty.js`
- 星级规则与评级文案：`src/utils/stars.js`
- E2E 用例与命令：`tests/e2e/` + `package.json`
- PWA 行为：`vite.config.js` 与 `src/components/PWAUpdatePrompt.vue`

建议：当上述文件行为变化时，同步更新 README 与 CHANGELOG。

### 添加新难度

1. 在 `src/config/difficulty.js` 中添加难度配置
2. 确保题目数量和数值范围符合设计规范

### 修改配色

本项目采用**简约科技风格**配色，在 `src/style.css` 中定义 CSS 变量：

```css
::root {
  /* 主色调 - 科技感 */
  --hero-blue: #0066FF;          /* 电光蓝 - 主操作 */
  --hero-blue-light: #3385FF;
  --hero-blue-dark: #0052CC;

  /* 成功色 - 能量绿 */
  --win-green: #00D084;          /* 科技绿 - 正确反馈 */
  --win-green-light: #33D99D;
  --win-green-dark: #00A86B;

  /* 强调色 - 闪电黄 */
  --energy-yellow: #FFC700;      /* 能量黄 - 奖励强调 */
  --energy-yellow-light: #FFD633;
  --energy-yellow-dark: #E6B300;

  /* 警告色 - 活力橙 */
  --warning-orange: #FF6B35;     /* 活力橙 - 错误反馈 */
  --warning-orange-light: #FF8A5C;
  --warning-orange-dark: #E65A24;

  /* 中性色 */
  --bg-light: #F5F7FA;           /* 浅灰背景 */
  --bg-card: #FFFFFF;            /* 卡片背景 */
  --text-primary: #1A1A1A;       /* 主文字 */
  --text-secondary: #666666;     /* 次要文字 */
}
```

**简约原则**：
- 主色 + 辅助色最多 3-4 种
- 发光效果适度，不刺眼
- 保持高对比度，易于阅读

### 设计文档

详细的设计规范和技术细节请参考 [DESIGN.md](./DESIGN.md)，包括：

- 移动端适配规范
- 响应式设计断点
- 触摸目标尺寸要求
- iOS/Android 兼容性说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 改进建议

- 添加更多运算类型（乘法、除法）
- 支持多语言（国际化）
- 添加成就系统和排行榜
- 添加家长控制面板
- 支持云同步和跨设备进度

## 🧾 变更记录维护

- 所有面向用户或开发流程的改动，都应更新 [CHANGELOG.md](./CHANGELOG.md) 的 `Unreleased`
- 推荐按 `Added / Changed / Fixed / Removed / Documentation` 分类记录
- 合并后再统一发布版本号与发布日期

## 📚 项目文档

| 文档 | 描述 |
|------|------|
| [README.md](./README.md) | 项目介绍和使用指南 (本文档) |
| [DESIGN.md](./DESIGN.md) | 设计规范 - 移动端适配、响应式设计、组件布局 |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 架构速览 - 路由、状态、音频、PWA 与测试流 |
| [AGENTS.md](./AGENTS.md) | 开发规范 - 代码风格、项目结构、最佳实践 |
| [CLAUDE.md](./CLAUDE.md) | 架构概述 - 技术栈、数据流、重要文件 |
| [COMPONENTS.md](./COMPONENTS.md) | 组件文档 - 所有 Vue 组件的详细说明 |
| [PWA.md](./PWA.md) | PWA 配置指南 - 离线支持、安装说明、兼容性 |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 贡献指南 - 如何参与项目开发 |
| [CHANGELOG.md](./CHANGELOG.md) | 变更日志 - 版本历史和更新记录 |

## 📄 许可证

本项目仅供学习和个人使用。
