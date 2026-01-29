---
name: math-game-ui-optimization
overview: 对儿童数学游戏进行UI整体优化，优化配色方案使其更鲜艳柔和、增强动效交互体验、设计更有质感的按钮组件，参考Khan Academy Kids风格
design:
  architecture:
    framework: vue
  styleKeywords:
    - 柔和卡通
    - 马卡龙色系
    - 弹性动效
    - 圆润可爱
    - 玻璃拟态
    - 立体按钮
    - 呼吸动画
    - 庆祝反馈
  fontSystem:
    fontFamily: Alimama FangYuanTi VF
    heading:
      size: 42px
      weight: 800
    subheading:
      size: 20px
      weight: 700
    body:
      size: 16px
      weight: 500
  colorSystem:
    primary:
      - "#FF8A80"
      - "#FFB74D"
      - "#FFF176"
      - "#AED581"
      - "#4FC3F7"
      - "#9575CD"
    background:
      - "#FFF8E1"
      - "#F3E5F5"
      - "#E0F7FA"
      - "#FFFFFF"
    text:
      - "#37474F"
      - "#546E7A"
      - "#78909C"
    functional:
      - "#66BB6A"
      - "#FF8A65"
      - "#42A5F5"
      - "#FFA726"
todos:
  - id: "1"
    content: 使用 [skill:ui-ux-pro-max] 获取儿童教育App UI设计最佳实践和配色建议
    status: completed
  - id: "2"
    content: 扩展 Tailwind 配置 - 添加马卡龙色系、新圆角、阴影和动画配置
    status: completed
    dependencies:
      - "1"
  - id: "3"
    content: 创建全局动画库 - 添加弹性、弹跳、摇晃、呼吸等通用动画类
    status: completed
    dependencies:
      - "2"
  - id: "4"
    content: 优化主页 UI - 水波纹按钮、渐变标题、统计卡片悬浮效果
    status: completed
    dependencies:
      - "2"
      - "3"
  - id: "5"
    content: 优化难度选择页 - 彩色阶段指示器、光晕卡片、浮动星星
    status: completed
    dependencies:
      - "2"
      - "3"
  - id: "6"
    content: 优化游戏页 - 毛玻璃导航、弹性反馈动效、庆祝粒子
    status: completed
    dependencies:
      - "2"
      - "3"
  - id: "7"
    content: 优化数字键盘 - 3D按压效果、渐变按钮、光晕交互
    status: completed
    dependencies:
      - "2"
      - "3"
  - id: "8"
    content: 优化结果弹窗 - 彩带动画、玻璃拟态数据卡片、立体按钮
    status: completed
    dependencies:
      - "2"
      - "3"
  - id: "9"
    content: 整体视觉调优 - 检查一致性、微调间距、测试动画性能
    status: completed
    dependencies:
      - "4"
      - "5"
      - "6"
      - "7"
      - "8"
---

## 产品概述

对儿童数学学习游戏进行整体 UI 优化，参考 Khan Academy Kids 风格，打造简约、活泼、生动的界面体验。

## 核心优化方向

1. **配色方案优化**：调整为更鲜艳但不刺眼的马卡龙色系，提升视觉愉悦感
2. **动效交互增强**：添加更丰富的弹性动画、微交互和过渡效果
3. **按钮组件升级**：设计更有立体感、按压反馈更明显的按钮样式
4. **整体视觉统一**：保持 Peppa Pig 风格圆润可爱的设计基因，同时提升精致度

## 优化范围

- 主页（Home.vue）：标题样式、统计卡片、按钮设计
- 难度选择页（DifficultySelect.vue）：卡片样式、进度展示
- 游戏页（Game.vue）：题目卡片、反馈动效
- 数字键盘（NumberPad.vue）：按钮质感、按压效果
- 结果弹窗（ResultModal.vue）：庆祝动效、数据展示
- 全局样式：配色系统、动画库、阴影系统

## 技术栈

- **框架**：Vue 3 + Composition API（保持现有架构）
- **样式**：Tailwind CSS 3.x（扩展配置）
- **动画**：CSS Keyframes + Vue Transitions（纯 CSS 实现，无额外依赖）
- **图标**：Lucide Vue Next（继续使用）

## 实现策略

1. **配色系统升级**：在 tailwind.config.js 中扩展新的马卡龙色系，保留原有 peppa 色作为兼容
2. **动画库扩展**：在 style.css 中添加弹性动画、弹跳动画、摇晃动画等通用动画类
3. **组件级优化**：逐个优化组件的视觉层级、阴影、圆角和交互状态
4. **渐变与阴影**：大量使用柔和渐变和弥散阴影提升质感

## 架构设计

```
样式架构：
├── tailwind.config.js      # 扩展配色、圆角、阴影、动画配置
├── src/style.css           # 全局动画库、通用样式类
└── 组件级样式优化：
    ├── Home.vue            # 水波纹按钮、渐变标题
    ├── DifficultySelect.vue # 悬浮卡片、进度环
    ├── Game.vue            # 弹性反馈、庆祝动画
    ├── NumberPad.vue       # 3D按压效果
    ├── QuestionCard.vue    # 玻璃拟态效果
    └── ResultModal.vue     # 粒子庆祝、数据展示优化
```

## 设计风格

参考 Khan Academy Kids 风格，采用"柔和卡通"设计语言，在保持 Peppa Pig 圆润基因的基础上，融入更现代的马卡龙色系和弹性动效。

### 页面设计要点

**主页（Home）**

- 背景：保留水母浮动动画，添加柔和的渐变背景层
- 标题："快乐数学"使用渐变填充 + 柔和阴影，增加呼吸动效
- 统计卡片：圆角加大到 36px，添加悬浮投影和微浮动动画
- 按钮：改为立体胶囊按钮，带按压回弹效果，颜色更鲜艳

**难度选择页（DifficultySelect）**

- 阶段标题栏：使用渐变色背景指示器，更生动
- 难度卡片：圆角增至 24px，已解锁卡片添加彩色边框光晕
- 进度徽章：改为圆形进度环 + 奖杯图标组合
- 装饰元素：浮动星星动画优化，添加旋转效果

**游戏页（Game）**

- 顶部导航：毛玻璃效果背景，提升质感
- 题目卡片：数字卡片添加轻微 3D 悬浮感
- 答题反馈：正确时添加庆祝粒子效果 + 弹性缩放，错误时添加摇晃动画
- 进度条：改为渐变填充 + 光泽流动效果

**数字键盘（NumberPad）**

- 按钮：添加内阴影营造凹陷感，按压时下沉 + 回弹
- 确认按钮：绿色渐变 + 发光效果
- 删除按钮：橙色渐变，更醒目

**结果弹窗（ResultModal）**

- 顶部：添加彩带飘落庆祝动画
- 数据卡片：玻璃拟态效果，悬浮展示
- 按钮：立体渐变按钮，带悬停上浮效果

## 交互设计

- **按压反馈**：所有可点击元素添加 scale(0.95) + 阴影变化
- **悬浮效果**：卡片悬浮时轻微上浮 + 阴影加深
- **入场动画**：页面元素按序弹性入场，营造活力感
- **微交互**：图标悬停旋转、按钮光晕扫过效果

## Agent Extensions

### Skill

- **ui-ux-pro-max**
- Purpose: 获取专业的儿童教育App UI/UX设计指导和最佳实践
- Expected outcome: 提供 Khan Academy Kids 风格的具体设计参数、颜色搭配建议和动效实现方案