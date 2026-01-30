---
name: math-game-boy-ui-optimization
overview: 为男儿童数学游戏重新设计配色系统和动画效果，使用活力蓝橙配色替代现有的粉色系
design:
  architecture:
    framework: vue
  styleKeywords:
    - Modern Tech
    - Indigo Primary
    - Orange Accent
    - Clean Lines
    - Boy-Friendly
    - Smooth Micro-interactions
  fontSystem:
    fontFamily: Fredoka, Nunito
    heading:
      size: 40px
      weight: 700
    subheading:
      size: 22px
      weight: 600
    body:
      size: 18px
      weight: 500
  colorSystem:
    primary:
      - "#4F46E5"
      - "#6366F1"
      - "#818CF8"
      - "#3730A3"
    background:
      - "#F1F5F9"
      - "#F8FAFC"
      - "#FFFFFF"
    text:
      - "#1E293B"
      - "#64748B"
      - "#94A3B8"
    functional:
      - "#22C55E"
      - "#F97316"
      - "#EF4444"
      - "#EAB308"
todos:
  - id: update-tailwind-config
    content: 更新 tailwind.config.js 将 boy 配色设为主使用
    status: completed
  - id: update-style-css
    content: 更新 src/style.css CSS变量和组件样式为 boy 配色
    status: completed
    dependencies:
      - update-tailwind-config
  - id: update-master-docs
    content: 更新 design-system/math-game/MASTER.md 设计文档
    status: completed
    dependencies:
      - update-tailwind-config
  - id: update-home-page
    content: 更新 src/pages/Home.vue 配色引用
    status: completed
    dependencies:
      - update-style-css
  - id: update-game-page
    content: 更新 src/pages/Game.vue 配色引用
    status: completed
    dependencies:
      - update-style-css
  - id: update-components
    content: 更新所有组件配色引用 (NumberPad, QuestionCard, ScoreBoard等)
    status: completed
    dependencies:
      - update-style-css
---

## 产品概述

数学运算游戏是一款面向3-6岁儿童的数学教育应用，需要将现有的温暖桃粉色系配色重新设计为更适合男童的靛蓝科技风格。

## 核心功能

- **首页**：游戏入口、成就展示、开始挑战按钮
- **难度选择**：15个渐进难度等级选择
- **游戏界面**：数学题目答题、数字键盘输入、实时反馈
- **结果展示**：成绩统计、通关奖励

## 视觉需求

- 配色方案：从温暖桃粉色(#F9A8D4)切换为靛蓝科技感(#4F46E5) + 活力橙强调色(#F97316)
- 动画风格：采用 ease-out 入场动画，150-300ms 微交互时长
- 整体设计：现代、科技感、活力、适合男童审美

## 技术栈

- **框架**: Vue 3 + Composition API
- **构建工具**: Vite 7.x
- **样式**: Tailwind CSS 3.x
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **图标**: Lucide Vue Next

## 实施方案

1. **配色系统切换**：将项目从 `toddler` 配色命名空间切换到 `boy` 配色命名空间

- 主色：靛蓝 #4F46E5 (科技感、稳重)
- 强调色：活力橙 #F97316 (能量、进取)
- 成功色：科技绿 #22C55E
- 背景色：浅灰蓝 #F1F5F9

2. **动画优化**：

- 入场动画使用 ease-out 时序
- 微交互时长控制在 150-300ms
- 减少过度花哨的动画效果，更适合男童审美

3. **组件样式更新**：

- 更新所有使用 `toddler-*` 类名的组件
- 更新 CSS 变量定义
- 保持触摸友好的交互设计

## 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    Color System                          │
├─────────────────────────────────────────────────────────┤
│  Primary: #4F46E5 (Indigo)                              │
│  Accent:  #F97316 (Orange)                              │
│  Success: #22C55E (Green)                               │
│  Background: #F1F5F9 (Slate)                            │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  tailwind     │  │  style.css    │  │  MASTER.md    │
│  config       │  │  variables    │  │  docs         │
└───────────────┘  └───────────────┘  └───────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                 ┌─────────────────┐
                 │  Vue Components │
                 │  (pages/*.vue)  │
                 └─────────────────┘
```

## 目录结构变更

### 修改文件清单

```
/Users/hezf/github/math-game/
├── tailwind.config.js           # [MODIFY] 更新 boy 配色为主使用
├── src/style.css                # [MODIFY] 更新 CSS 变量为 boy 配色
├── design-system/math-game/
│   └── MASTER.md                # [MODIFY] 更新设计文档为男童配色
├── src/pages/
│   ├── Home.vue                 # [MODIFY] 更新配色引用
│   ├── Game.vue                 # [MODIFY] 更新配色引用
│   └── DifficultySelect.vue     # [MODIFY] 更新配色引用
├── src/components/
│   ├── NumberPad.vue            # [MODIFY] 更新按钮样式
│   ├── QuestionCard.vue         # [MODIFY] 更新卡片样式
│   ├── ScoreBoard.vue           # [MODIFY] 更新统计样式
│   ├── ResultModal.vue          # [MODIFY] 更新弹窗样式
│   ├── DifficultyCard.vue       # [MODIFY] 更新难度卡片
│   └── TouchOptimizedButton.vue # [MODIFY] 更新按钮样式
└── index.html                   # [NO CHANGE] 字体已适配
```

## 实现注意事项

1. **保持向后兼容**：`tailwind.config.js` 中保留原有配色定义，仅切换使用
2. **CSS变量同步**：确保 style.css 中的 CSS 变量与 Tailwind 配置一致
3. **动画性能**：使用 transform 和 opacity 属性，避免触发重排
4. **触摸友好**：保持 64px 最小触摸目标尺寸
5. **无障碍支持**：保持 4.5:1 对比度要求

## 设计风格

采用现代科技感风格，适合男童审美：

- **主色调**：靛蓝(#4F46E5)传递科技感和稳重感
- **强调色**：活力橙(#F97316)增添能量和进取感
- **背景色**：浅灰蓝(#F1F5F9)保持清爽干净
- **动画风格**：简洁利落，150-300ms 微交互，ease-out 时序
- **整体氛围**：科技感、活力、现代、专业

## 页面设计

### 首页 (Home)

1. **顶部标题区**：靛蓝渐变图标 + 粗体标题"数学挑战"
2. **统计卡片**：白色卡片 + 靛蓝/橙色图标
3. **主按钮**：靛蓝渐变主按钮 + 白色次按钮
4. **背景**：浅灰蓝渐变

### 游戏页 (Game)

1. **顶部导航**：白色导航栏 + 靛蓝返回按钮
2. **题目卡片**：白色圆角卡片 + 靛蓝边框
3. **数字键盘**：简洁白色按钮 + 橙色功能键
4. **反馈效果**：成功绿色对勾 / 错误橙色提示

### 难度选择页 (DifficultySelect)

1. **难度星球**：靛蓝渐变星球样式
2. **进度指示**：靛蓝进度条
3. **关卡卡片**：白色卡片 + 状态颜色标识

## 响应式适配

- **移动端优先**：375px 最小宽度
- **触摸优化**：64px 最小点击区域
- **安全区域**：适配刘海屏�配刘海屏