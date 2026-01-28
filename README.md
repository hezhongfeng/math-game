# 数学运算游戏 🐷

一个专为儿童设计的数学启蒙教育游戏，通过趣味互动帮助孩子轻松掌握加减法运算。

![数学运算游戏](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)

## 🎯 特性亮点

- 🎨 **精美界面**：采用 Peppa Pig 风格配色，圆润可爱的设计风格
- 🎮 **渐进式学习**：15 个难度等级循序渐进，从 1-3 到 1-100
- 🎉 **丰富反馈**：粒子效果、音效、触觉反馈多维度激励
- 📱 **移动优先**：专为触摸屏优化，支持手机和平板
- 💾 **进度保存**：自动保存学习进度和最佳成绩
- 🔒 **关卡解锁**：通过前一关才能挑战更高难度

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| **15个难度等级** | 涵盖5个数值范围（1-3、1-5、1-10、1-20、1-100），每个范围包含加法、减法、加减混合三个阶段 |
| **趣味反馈** | 答对时显示绿色对勾 + 粒子爆炸效果，答错时显示正确答案 + 橙色粒子动画 |
| **触觉反馈** | 支持手机振动提示（答对/答错时触发） |
| **成绩记录** | 本地保存最佳成绩，支持进度追踪 |
| **语音播报** | 支持题目和反馈的语音播报（可开关） |
| **音效系统** | 数字点击音效、答题正确/错误音效、胜利音效 |
| **手机优化** | 专为移动端设计的大按钮、触摸优化、响应式布局 |
| **进度锁定** | 需通过前一关才能解锁更高难度 |

## 🚀 快速开始

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
- **PWA 就绪**：apple-mobile-web-app-capable 支持添加到主屏幕

### 浏览器兼容性

- **iOS Safari 26.2+**：完整支持，修复音频Context恢复问题
- **微信浏览器**：内置WebView特殊处理，自动解锁音频
- **现代浏览器**：Chrome、Firefox、Edge等主流浏览器

### 触觉与交互

- **振动反馈**：使用 Vibration API 答对/答错时触发
- **流畅动画**：粒子效果、缩放弹跳等视觉反馈
- **iOS 优化**：-webkit-tap-highlight-color: transparent 去除默认高亮
- **音频优化**：Web Audio API动态生成音效

## 🎮 操作说明

### 桌面端
1. 打开游戏主页，点击「开始游戏」
2. 选择难度等级（需从第一关开始解锁）
3. 使用键盘输入数字答案
4. 按 Enter 键或点击 ✓ 按钮确认
5. 答对得 10 分，答错显示正确答案
6. 完成所有题目后查看成绩

### 移动端
1. 打开游戏主页，点击「开始游戏」
2. 选择难度等级（需从第一关开始解锁）
3. 使用屏幕数字键盘输入答案
4. 点击 ✓ 按钮确认
5. 答对时手机会振动并显示粒子效果
6. 完成所有题目后查看成绩和统计数据

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
│   │   ├── useSound.js      # 音效管理
│   │   ├── useStorage.js    # 本地存储
│   │   └── useToast.js      # 吐司提示
│   ├── config/              # 配置文件
│   │   ├── constants.js     # 游戏常量（音频频率、音效参数）
│   │   └── difficulty.js    # 难度配置
│   ├── stores/              # Vue Stores
│   │   └── settings.js      # 设置状态管理
│   ├── pages/               # 页面组件
│   │   ├── DifficultySelect.vue  # 难度选择页
│   │   ├── Game.vue              # 游戏页（含反馈动画）
│   │   └── Home.vue              # 主页
│   ├── utils/               # 工具函数
│   │   ├── audioContext.js       # AudioContext管理（iOS Safari兼容）
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

### 入门阶段（1-3）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 入门1 | 1-3 以内加法 | 10题 |
| 入门2 | 1-3 以内减法 | 10题 |
| 入门3 | 1-3 加减混合 | 10题 |

### 初级阶段（1-5）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 初级1 | 1-5 以内加法 | 12题 |
| 初级2 | 1-5 以内减法 | 12题 |
| 初级3 | 1-5 加减混合 | 12题 |

### 中级阶段（1-10）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 中级1 | 1-10 以内加法 | 15题 |
| 中级2 | 1-10 以内减法 | 15题 |
| 中级3 | 1-10 加减混合 | 15题 |

### 进级阶段（1-20）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 进级1 | 1-20 以内加法 | 20题 |
| 进级2 | 1-20 以内减法 | 20题 |
| 进级3 | 1-20 加减混合 | 20题 |

### 高级阶段（1-100）
| 关卡 | 类型 | 题目数 |
|------|------|--------|
| 高级1 | 1-100 以内加法 | 25题 |
| 高级2 | 1-100 以内减法 | 25题 |
| 高级3 | 1-100 加减混合 | 25题 |

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
| **Pinia** | 状态管理 |
| **Lucide Vue Next** | 图标库 |
| **LocalStorage** | 数据持久化 |
| **Web Speech API** | 语音合成 |
| **Vibration API** | 触觉反馈 |

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

### iOS Safari 音频兼容性

本游戏针对 iOS Safari 浏览器进行了专门的音频兼容性优化：

- **AudioContext 恢复**：在用户交互的同步代码路径中恢复 AudioContext
- **事件监听优化**：touchstart 使用 `once: true` 避免重复监听
- **触摸处理**：所有交互元素添加 `-webkit-tap-highlight-color: transparent`
- **延时音效修复**：在 `setTimeout` 中重新检查 AudioContext 状态
- **被动事件**：所有事件监听器使用 `passive: true` 优化性能

这些优化确保 iPhone 和 iPad 上的 Safari 浏览器可以正常播放所有音效。

## 🌐 浏览器兼容性

| 浏览器 | 状态 | 备注 |
|--------|------|------|
| Chrome (Android) | ✅ 完全支持 | 推荐使用，触觉反馈完整支持 |
| Safari (iOS) | ✅ 完全支持 | 触觉反馈需用户交互后触发 |
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
| 触觉反馈 (Vibration) | ⚠️ 需交互后 | ✅ |
| 语音合成 | ✅ | ✅ |
| LocalStorage | ✅ | ✅ |
| 安全区域 | ✅ iOS 11+ | ✅ Android 5+ |
| 添加到主屏幕 | ✅ | ✅ |

**注意**：语音功能需要浏览器支持 Speech Synthesis API；触觉反馈（振动）需要用户先与页面交互才能触发。

## ⚠️ 注意事项

- **数据存储**：游戏数据保存在浏览器 LocalStorage 中，清除浏览器数据会导致进度丢失
- **音效系统**：使用 Web Audio API 动态生成音效，部分旧版浏览器可能不支持
- **触觉反馈**：iOS 设备需要在用户交互后才能触发振动，且部分设备可能不支持
- **语音播报**：依赖浏览器的语音合成功能，不同浏览器的语音质量可能有差异
- **性能优化**：粒子效果在低端设备上可能影响性能，建议在中高端设备上使用

## 📝 开发说明

### 添加新难度

1. 在 `src/config/difficulty.js` 中添加难度配置
2. 确保题目数量和数值范围符合设计规范

### 自定义音效

音效功能使用 Web Audio API 动态生成，无需外部音频文件。如需自定义音效，可在 `src/composables/useSound.js` 中修改音频参数。

### 修改配色

在 `src/style.css` 中修改 CSS 变量：

```css
:root {
  --peppa-blue: #4A90E2;
  --peppa-green: #4CAF50;
  --peppa-orange: #FF9800;
  /* ...更多颜色 */
}
```

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
- 支持 PWA 离线使用
- 添加家长控制面板

## 📄 许可证

本项目仅供学习和个人使用。
