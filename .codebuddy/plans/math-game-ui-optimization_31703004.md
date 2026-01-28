---
name: math-game-ui-optimization
overview: 按照 QuestionCard 的简约风格，优化整个数学游戏项目的 UI 设计，包括首页、难度选择、游戏页、数字键盘和结果弹窗。
design:
  architecture:
    framework: vue
  styleKeywords:
    - Minimalism
    - Clean
    - Child-friendly
    - Flat Design
    - Border State Indicators
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 24px
      weight: 700
    subheading:
      size: 18px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#4A90E2"
      - "#4CAF50"
      - "#FF9800"
    background:
      - "#FFFFFF"
      - "#F1F5F9"
      - "#E3F2FD"
    text:
      - "#1E3A5F"
      - "#5A7A9A"
      - "#94A3B8"
    functional:
      - "#4CAF50"
      - "#FF9800"
      - "#FF6B6B"
      - "#4ECDC4"
todos:
  - id: optimize-home
    content: 优化 Home.vue 首页统计卡片和按钮，采用纯白背景和简约边框设计
    status: completed
  - id: optimize-difficulty-select
    content: 优化 DifficultySelect.vue 导航栏和阶段标题，简化视觉层次
    status: completed
  - id: optimize-difficulty-card
    content: 优化 DifficultyCard.vue 卡片设计，统一简约风格
    status: completed
  - id: optimize-game-feedback
    content: 优化 Game.vue 反馈层动画，简化正确/错误提示效果
    status: completed
  - id: optimize-number-pad
    content: 优化 NumberPad.vue 按钮，去除3D效果和复杂阴影
    status: completed
  - id: optimize-result-modal
    content: 优化 ResultModal.vue 数据项，统一简约风格设计
    status: completed
---

## Product Overview

按照 QuestionCard 的简约风格，对整个数学游戏项目的 UI 进行优化，统一设计风格，提升视觉一致性。

## Core Features

- **首页优化**：简化统计卡片，去除渐变边框和复杂阴影，采用纯白背景 + 柔和阴影 + 边框状态指示
- **难度选择页优化**：简化头部导航栏和阶段标题，采用更简洁的布局
- **难度卡片优化**：进一步简化卡片设计，统一风格
- **游戏页优化**：简化反馈层动画，去除复杂涟漪和环状动画，采用更简洁的反馈方式
- **数字键盘优化**：去除3D按压效果和复杂阴影，采用扁平化设计
- **结果弹窗优化**：统一数据项样式，去除多色彩边框，采用一致的设计风格

## Tech Stack

- **Framework**: Vue 3 + Composition API (`<script setup>`)
- **Styling**: Tailwind CSS 3.x + Custom CSS
- **Icons**: Lucide Vue Next
- **Language**: JavaScript (No TypeScript)

## Design System Reference

### QuestionCard 简约风格规范

```css
/* 卡片基础 */
background: #ffffff;
border-radius: 32px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

/* 状态边框 */
border: 2px solid rgba(74, 144, 226, 0.2);  /* 默认 */
border: 3px solid #4CAF50;  /* 正确 */
border: 3px solid #FF9800;  /* 错误 */

/* 信息栏分隔线 */
border-bottom: 1px solid #f1f5f9;

/* 彩色文字 */
color: #4A90E2;  /* 蓝色主色 */
color: #FF6B6B;  /* 红色强调 */
color: #4ECDC4;  /* 青色强调 */
```

## Implementation Strategy

1. 逐个组件进行样式重构，保持功能不变
2. 遵循现有项目代码风格和命名规范
3. 保持移动端触摸友好设计
4. 保留现有动画过渡效果，简化视觉复杂度
5. 统一使用 border-color 变化表示状态，替代复杂背景渐变

## Design Style

采用现代简约设计风格，以 QuestionCard 为基准统一全项目视觉语言。

### 核心设计原则

1. **纯净背景**：统一使用纯白 (#ffffff) 作为主卡片背景
2. **柔和阴影**：统一阴影为 `0 4px 20px rgba(0,0,0,0.08)`，替代复杂多层阴影
3. **大圆角**：统一使用 32px 圆角，营造亲和的儿童友好风格
4. **边框状态**：通过边框颜色变化（而非背景色）表示状态变化
5. **扁平化按钮**：移除3D效果和复杂阴影，采用简洁的边框和背景色
6. **信息分隔**：使用淡色底部边框分隔不同信息区域，替代复杂的容器嵌套

### 页面设计要点

**Home 首页**

- 统计卡片：白色背景 + 淡色边框 + 简约图标，彩色文字显示数值
- 按钮：扁平设计，移除渐变阴影，保留悬停状态

**DifficultySelect 难度选择**

- 导航栏：白色背景卡片，简化阴影
- 阶段标题：去除渐变背景，使用纯色 + 左侧色条标识

**DifficultyCard 难度卡片**

- 进一步简化：统一白色背景，状态通过边框区分
- 移除复杂悬停阴影，改为简单的边框颜色变化

**Game 游戏页**

- 反馈层：简化正确/错误动画，移除涟漪效果
- 使用简单的图标 + 文字提示，配合边框颜色变化

**NumberPad 数字键盘**

- 按钮扁平化：移除3D阴影和光泽效果
- 简化确认按钮动画

**ResultModal 结果弹窗**

- 数据项统一风格：白色背景 + 底部淡色分隔线
- 移除多色彩边框，使用统一的视觉样式