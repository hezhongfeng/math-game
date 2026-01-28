---
name: question-card-redesign-plan
overview: 为数学游戏重新设计题目卡片 UI，采用扁平卡片风格，增加题号指示器、计时显示、方框数字卡片等元素，提升儿童用户体验。
design:
  architecture:
    framework: vue
  fontSystem:
    fontFamily: Nunito
    heading:
      size: 28px
      weight: 800
    subheading:
      size: 20px
      weight: 700
    body:
      size: 16px
      weight: 600
  colorSystem:
    primary:
      - "#4A90E2"
      - "#4CAF50"
      - "#FF9800"
    background:
      - "#FFFFFF"
      - "#F5F9FF"
      - "#E3F2FD"
    text:
      - "#1E3A5F"
      - "#5A7A9A"
      - "#94A3B8"
    functional:
      - "#4CAF50"
      - "#FF9800"
      - "#EF5350"
todos:
  - id: update-props
    content: 扩展 QuestionCard 组件 Props，新增题号、总题数、计时器等参数
    status: completed
  - id: add-header-bar
    content: 实现顶部信息栏，包含题号指示器和计时显示
    status: completed
    dependencies:
      - update-props
  - id: create-number-card
    content: 创建 NumberCard 子组件，实现方框数字卡片样式
    status: completed
  - id: redesign-expression
    content: 重构算式区，使用方框数字卡片展示操作数
    status: completed
    dependencies:
      - create-number-card
  - id: redesign-answer
    content: 重构答案区，使用方框数字卡片展示答案
    status: completed
    dependencies:
      - create-number-card
  - id: add-progress-dots
    content: 添加进度圆点指示器，显示当前答题进度
    status: completed
    dependencies:
      - update-props
  - id: update-parent-props
    content: 更新 Game.vue，传入新的 props 到 QuestionCard
    status: completed
    dependencies:
      - add-header-bar
      - add-progress-dots
---

## 产品概述

为数学游戏重新设计题目卡片 QuestionCard 组件，采用扁平卡片风格，提升儿童用户体验，增加题号指示器、计时显示、方框数字卡片等元素，使界面更加直观、友好。

## 核心功能

- **题号指示器**: 在卡片顶部显示"第 X 题/共 Y 题"，带进度圆点指示器，让儿童清楚当前进度
- **计时显示**: 在卡片右上角显示当前题目用时，使用可爱的时钟图标和数字
- **方框数字卡片**: 操作数（operand1、operand2）和答案区域使用独立的方框卡片展示，每个数字都有卡片式边框和背景
- **扁平卡片风格**: 采用白色背景卡片，配合柔和阴影和圆角，层次分明，视觉清晰
- **动画反馈**: 保持现有的正确/错误反馈动画，增强答题成就感
- **响应式适配**: 移动端优先，支持平板和桌面尺寸自适应

## 技术栈

- **框架**: Vue 3 + Composition API (`<script setup>`)
- **样式**: Tailwind CSS 3.x
- **图标**: Lucide Vue Next
- **设计规范**: 使用项目已有的 `rounded-cute-*` 圆角系统、`shadow-card` 阴影、Peppa Pig 主题配色

## 架构设计

### 组件结构

```
┌─────────────────────────────────────┐
│  QuestionCard (根容器)               │
│  ├─ 顶部栏: 题号指示器 + 计时器        │
│  ├─ 主体区: 方框数字卡片 + 运算符       │
│  └─ 答案区: 等号 + 答案方框卡片         │
└─────────────────────────────────────┘
```

### Props 扩展

```javascript
// 新增 Props
currentIndex: Number,      // 当前题号
totalQuestions: Number,    // 总题数
questionTimer: Number,     // 当前题目用时(秒)
```

### 样式设计

- **主卡片**: 白色背景 (`bg-white`)、`rounded-cute-2xl`、`shadow-card`
- **数字方框卡片**: 白色背景、圆角边框、内阴影效果、64px 触摸目标
- **颜色系统**: 
- 正常状态: 蓝色边框 (`border-peppa-blue/30`)
- 正确状态: 绿色边框 (`border-peppa-green`)
- 错误状态: 橙色边框 (`border-peppa-orange`)

### 关键实现点

1. **数字卡片组件化**: 创建可复用的 `NumberCard` 子组件，支持不同状态样式
2. **计时器格式化**: 使用 `MM:SS` 格式显示时间
3. **进度圆点**: 使用 flex 布局的圆点数组，当前题目高亮显示
4. **动画保持**: 保留现有的 `answer-pop` 和 `answer-shake` 动画

## 设计风格

采用**扁平化儿童友好风格**，以简洁、明亮、直观为核心。

### 设计架构

**移动优先设计**，以 375px 手机屏宽为基准，向上适配平板和桌面。

### 页面区块设计

**顶部信息栏** (Header Bar)

- 左侧：题号指示器，"第 X 题" 大字体，"/共 Y 题" 小字体灰色
- 右侧：计时器，带时钟图标，蓝色数字显示
- 进度圆点：题号下方一排小圆点，当前题目为蓝色实心，其他为灰色空心

**算式区** (Expression Area)

- 布局：水平排列，左对齐数字卡片，中间运算符，右对齐数字卡片
- 数字卡片：圆角矩形方框，白色背景，浅灰边框，数字居中显示
- 运算符：加粗居中，使用主题蓝色

**答案区** (Answer Area)

- 等号：大号字体，与算式区对齐
- 答案卡片：与数字卡片同样式，占位时显示 "?" 并带脉冲动画
- 状态反馈：正确时边框变绿带弹出动画，错误时边框变橙带抖动动画

### 视觉层次

1. 白色主卡片作为容器，轻微上浮阴影
2. 数字卡片为二级容器，内阴影营造凹陷感
3. 数字为视觉焦点，最大字号