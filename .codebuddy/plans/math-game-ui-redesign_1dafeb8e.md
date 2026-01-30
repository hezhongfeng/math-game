---
name: math-game-ui-redesign
overview: 基于 Claymorphism 软 3D 拟态风格，对儿童数学游戏进行整体 UI 重设计，包括配色系统、组件样式、动画交互等全面升级。
design:
  architecture:
    framework: vue
  fontSystem:
    fontFamily: Baloo 2, Comic Neue
    heading:
      size: 32px
      weight: 700
    subheading:
      size: 22px
      weight: 600
    body:
      size: 18px
      weight: 400
  colorSystem:
    primary:
      - "#FF8FA3"
      - "#98FF98"
      - "#4FC3F7"
      - "#FFE66D"
      - "#CE93D8"
    background:
      - "#FFFBF5"
      - "#FFF8E7"
      - "#F0F9FF"
    text:
      - "#5D4E37"
      - "#7A6A5A"
      - "#FFFFFF"
    functional:
      - "#81C784"
      - "#FFB74D"
      - "#E57373"
todos:
  - id: update-tailwind-config
    content: 更新 tailwind.config.js - 添加糖果配色系统和动画关键帧
    status: completed
  - id: update-global-styles
    content: 重构 src/style.css - 实现 Claymorphism 组件系统和双边阴影
    status: completed
    dependencies:
      - update-tailwind-config
  - id: update-html-fonts
    content: 更新 index.html - 引入 Google Fonts（Baloo 2 + Comic Neue）
    status: completed
  - id: update-home-page
    content: 重设计 Home.vue - 应用新配色和 Claymorphism 卡片/按钮
    status: completed
    dependencies:
      - update-global-styles
      - update-html-fonts
  - id: update-number-pad
    content: 重设计 NumberPad.vue - 泡泡按钮风格和果冻回弹动画
    status: completed
    dependencies:
      - update-global-styles
  - id: update-question-card
    content: 重设计 QuestionCard.vue - 3D 悬浮卡片和答案反馈动画
    status: completed
    dependencies:
      - update-global-styles
  - id: update-difficulty-select
    content: 重设计 DifficultySelect.vue - 星球节点和连线布局
    status: completed
    dependencies:
      - update-global-styles
  - id: update-game-page
    content: 整合 Game.vue - 统一新设计系统
    status: completed
    dependencies:
      - update-question-card
      - update-number-pad
---

## 产品概述

儿童数学启蒙教育游戏 UI 重新设计，基于 ui-ux-pro-max 专业设计建议，采用 Claymorphism（软 3D 拟态）风格，打造更具玩具感和亲和力的视觉体验。

## 核心需求

1. **视觉风格升级**：采用 Claymorphism 风格 - 软 3D、玩具感、圆润厚实、双边阴影
2. **配色系统重构**：糖果工坊色系（草莓粉、薄荷绿、天空蓝、柠檬黄、薰衣草紫）
3. **字体系统更新**：引入 Baloo 2 + Comic Neue 儿童友好字体
4. **动画系统增强**：弹性物理反馈动画（cubic-bezier 0.34, 1.56）
5. **组件样式统一**：按钮、卡片、键盘等组件应用 3D 软胶质感

## 设计规范

- 圆角：16-24px（统一使用 rounded-3xl）
- 边框：3-4px 厚边框，白色/半透明
- 阴影：双边阴影（内阴影 + 外阴影）
- 动画时长：150-300ms 微交互，500-600ms 入场动画
- 触摸目标：最小 64x64px

## 技术栈

- **框架**：Vue 3 + Composition API + `<script setup>`
- **样式**：Tailwind CSS 3.x + 自定义 CSS
- **构建工具**：Vite 7.x
- **图标**：Lucide Vue Next

## 架构设计

### 样式系统分层

1. **基础层**：tailwind.config.js - 配色、动画、间距配置
2. **组件层**：src/style.css - Claymorphism 组件类（.btn-clay, .card-clay 等）
3. **页面层**：各页面组件 - 具体布局和交互

### 动画系统

- **入场动画**：cardEntrance, buttonEntrance, fadeInUp
- **交互动画**：pop（按压回弹）、wiggle（摇晃反馈）、celebrate（庆祝）
- **装饰动画**：float（漂浮）、glow（呼吸发光）、jelly（果冻效果）

### 无障碍支持

- `prefers-reduced-motion` 媒体查询
- 触摸优化（touch-manipulation）
- 焦点状态可见

## 关键实现点

1. **双边阴影技术**：box-shadow 多层叠加实现 3D 效果

```css
box-shadow:
4px 4px 12px rgba(0, 0, 0, 0.1),   /* 外阴影 */
-2px -2px 8px rgba(255, 255, 255, 0.8), /* 内高光 */
inset -2px -2px 6px rgba(0, 0, 0, 0.05), /* 内阴影 */
inset 2px 2px 6px rgba(255, 255, 255, 0.8); /* 内高光 */
```

2. **弹性动画曲线**：cubic-bezier(0.34, 1.56, 0.64, 1) 实现回弹效果

3. **按压状态处理**：scale(0.92) + 阴影内收模拟按压感

## 设计风格

**Claymorphism（软 3D 拟态）** - 专为儿童教育应用优化的设计语言，特点包括：

- 厚实圆润的视觉感受，类似软胶玩具
- 双边阴影营造立体浮雕效果
- 柔和的粉彩配色，高饱和度但不刺眼
- 弹性物理反馈动画，增强交互趣味性

## 页面设计

### 首页 - 「数学乐园」

- 背景：奶油渐变 + 浮动水母装饰
- 标题：渐变文字 + 弹性入场动画
- 统计卡片：3D 立体卡片，顶部彩色边框
- 主按钮：大圆角胶囊形，立体阴影，按压回弹

### 难度选择 - 「星球地图」

- 关卡节点：圆形星球样式，Clay 阴影
- 已解锁：彩色发光星球 + 环绕粒子
- 当前关卡：脉动呼吸动画
- 未解锁：灰色陨石 + 锁图标

### 游戏页 - 「答题舞台」

- 题目卡片：悬浮 3D 效果，圆角 32px
- 数字键盘：泡泡按钮，按压果冻回弹
- 答案反馈：
- 正确：绿色光晕扩散 + celebrate 动画
- 错误：红色摇晃 + wiggle 动画

## 动画系统

| 动画名称 | 用途 | 效果 |
| --- | --- | --- |
| pop | 按钮按压 | scale(0.92) → scale(1.02) → scale(1) |
| wiggle | 错误反馈 | 左右摇晃 ±3deg |
| celebrate | 正确反馈 | 放大弹出 + 轻微旋转 |
| float | 背景装饰 | 上下漂浮 ±10px |
| glow | 选中状态 | 呼吸光晕效果 |
| jelly | 弹性反馈 | 果冻状形变 |


## 无障碍设计

- 支持 `prefers-reduced-motion` 减少动画
- 触摸目标最小 64x64px
- 高对比度模式支持
- 焦点状态清晰可见

## Agent Extensions

### Skill: ui-ux-pro-max

- **Purpose**: 提供专业设计建议，包括 Claymorphism 风格规范、配色方案、动画系统
- **Expected outcome**: 生成糖果工坊配色系统和儿童友好动画规范

### Skill: vue-best-practices

- **Purpose**: 确保 Vue 3 Composition API 最佳实践
- **Expected outcome**: 组件代码符合 `<script setup>` 规范，使用正确的响应式模式

### MCP: context7

- **Purpose**: 查询 Vue 3 和 Tailwind CSS 最新文档
- **Expected outcome**: 获取最新的 Vue 动画和 Tailwind 自定义配置方法