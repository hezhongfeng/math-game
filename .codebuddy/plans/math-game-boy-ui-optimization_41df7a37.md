---
name: math-game-boy-ui-optimization
overview: 将数学游戏的UI从Peppa Pig风格优化为适合男孩的Claymorphism现代风格，简化配色和动画，提升体验
design:
  architecture:
    framework: vue
  styleKeywords:
    - Modern Tech
    - Clean Claymorphism
    - Boy-Friendly
    - Minimalist
    - Energetic
  fontSystem:
    fontFamily: Nunito
    heading:
      size: 32px
      weight: 700
    subheading:
      size: 20px
      weight: 600
    body:
      size: 16px
      weight: 500
  colorSystem:
    primary:
      - "#4F46E5"
      - "#3730A3"
      - "#F97316"
    background:
      - "#F1F5F9"
      - "#E2E8F0"
      - "#FFFFFF"
    text:
      - "#1E293B"
      - "#64748B"
      - "#FFFFFF"
    functional:
      - "#22C55E"
      - "#EF4444"
      - "#EAB308"
todos:
  - id: update-tailwind-config
    content: 更新tailwind配置添加男孩友好配色系统
    status: completed
  - id: update-global-styles
    content: 更新全局CSS变量和组件基础样式
    status: completed
    dependencies:
      - update-tailwind-config
  - id: update-home-page
    content: 优化首页配色和移除过度装饰
    status: completed
    dependencies:
      - update-global-styles
  - id: update-difficulty-select
    content: 优化难度选择页设计
    status: completed
    dependencies:
      - update-global-styles
  - id: update-game-page
    content: 优化游戏页面视觉
    status: completed
    dependencies:
      - update-global-styles
  - id: update-components
    content: 批量更新组件配色和动画
    status: completed
    dependencies:
      - update-global-styles
---

## 用户需求分析

用户希望将数学游戏应用优化为更适合男孩的设计风格。当前设计存在以下问题：

1. **配色过于柔和** - 使用大量草莓粉、薰衣草紫等糖果色系
2. **动画过于花哨** - 大量浮动装饰、闪烁光效、星星动画
3. **风格偏向幼儿化** - Peppa Pig风格过于卡通和女性化

## 优化目标

- 采用更加现代、有力的配色方案，适合男孩审美
- 保留Claymorphism的柔和3D质感，但减少过度动画
- 使用深蓝、橙色、科技绿等更"酷"的颜色
- 简化装饰元素，保持界面清爽专业

## 技术架构

基于现有Vue 3 + Tailwind CSS + Claymorphism设计系统进行优化：

### 核心改动策略

1. **颜色系统重构** - 在 `tailwind.config.js` 中添加新的男孩友好配色
2. **全局样式更新** - 修改 `src/style.css` 中的CSS变量和组件样式
3. **页面组件逐个优化** - 更新所有Vue组件中的颜色和动画

### 新配色方案

| 用途 | 颜色值 | 说明 |
| --- | --- | --- |
| 主色 | `#4F46E5` | 靛蓝 - 稳重科技感 |
| 辅助色 | `#F97316` | 活力橙 - 能量感 |
| 成功色 | `#22C55E` | 科技绿 |
| 背景色 | `#F1F5F9` | 浅灰蓝 |
| 深色文字 | `#1E293B` | 深蓝灰 |
| 卡片白 | `#FFFFFF` | 纯白 |


### 动画优化

- 移除漂浮装饰元素动画
- 减少发光/闪烁效果
- 保留简洁的按压反馈 (`scale(0.95)`)
- 保留卡片入场动画但简化效果

### 目录结构（修改文件）

```
project-root/
├── tailwind.config.js              # [MODIFY] 添加男孩配色系统
├── src/
│   ├── style.css                   # [MODIFY] 更新CSS变量和组件样式
│   ├── App.vue                     # [MODIFY] 更新全局背景
│   ├── pages/
│   │   ├── Home.vue               # [MODIFY] 首页配色和装饰
│   │   ├── DifficultySelect.vue   # [MODIFY] 难度选择页
│   │   └── Game.vue               # [MODIFY] 游戏页面
│   └── components/
│       ├── DifficultyCard.vue     # [MODIFY] 难度卡片
│       ├── NumberPad.vue          # [MODIFY] 数字键盘
│       ├── QuestionCard.vue       # [MODIFY] 题目卡片
│       ├── ResultModal.vue        # [MODIFY] 结果弹窗
│       ├── ScoreBoard.vue         # [MODIFY] 得分板
│       └── NumberCard.vue         # [MODIFY] 数字卡片
```

## 设计方案 - 现代男孩风格 Claymorphism

### 设计理念

采用**现代科技感 + 活力运动风**的设计风格，适合小学男孩用户群体。保留Claymorphism的柔和3D质感，但使用更有力量感的配色。

### 视觉风格关键词

- **现代科技感** - 靛蓝主色调传达科技、可靠
- **活力运动** - 橙色点缀增加能量感
- **简洁清爽** - 减少装饰元素，聚焦内容
- **柔和3D** - 保留双边阴影的立体感

### 配色系统

**主色调**

- 靛蓝 `#4F46E5` - 主按钮、强调元素
- 深蓝 `#3730A3` - 深色变体

**辅助色**

- 活力橙 `#F97316` - 次要按钮、高亮
- 深橙 `#EA580C` - 深色变体

**功能色**

- 科技绿 `#22C55E` - 成功状态
- 警告黄 `#EAB308` - 提示信息
- 错误红 `#EF4444` - 错误状态

**中性色**

- 背景 `#F1F5F9` / `#E2E8F0`
- 卡片白 `#FFFFFF`
- 主文字 `#1E293B`
- 次要文字 `#64748B`

### 页面设计

**首页 (Home)**

- 简洁渐变背景（靛蓝到浅灰蓝）
- 移除浮动装饰圆球
- 统计卡片使用靛蓝/橙色渐变
- 主按钮：靛蓝Claymorphism风格
- 次按钮：白色底色+靛蓝边框

**难度选择页 (DifficultySelect)**

- 阶段徽章使用对应颜色（绿/蓝/橙/红）
- 移除背景漂浮装饰
- 卡片悬停效果简化

**游戏页 (Game)**

- 题目卡片使用简洁白色
- 操作符使用靛蓝渐变
- 数字键盘使用灰白基调
- 删除/确认按钮使用橙/绿色

**结果弹窗 (ResultModal)**

- 奖杯图标保留但配色简化
- 统计卡片使用靛蓝/绿/橙配色
- 彩带动画可选简化

### 动画规范

**保留动画**

- 卡片入场：0.3s ease-out 淡入上移
- 按钮按压：0.15s scale(0.95)
- 题目切换：0.3s 滑动过渡

**移除动画**

- 漂浮装饰动画
- 星星闪烁效果
- 过度发光效果
- 呼吸脉冲动画