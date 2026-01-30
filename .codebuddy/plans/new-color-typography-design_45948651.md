---
name: new-color-typography-design
overview: 为儿童数学游戏重新设计全新的活泼色系和字体字号系统，采用温暖珊瑚+清新薄荷+阳光黄的配色，以及更适合儿童的字体和更大的字号
design:
  architecture:
    framework: vue
  styleKeywords:
    - Warm
    - Playful
    - Child-Friendly
    - Coral
    - Mint
    - Sunshine
  fontSystem:
    fontFamily: Fredoka, Nunito
    heading:
      size: 40px
      weight: 700
    subheading:
      size: 26px
      weight: 600
    body:
      size: 18px
      weight: 400
  colorSystem:
    primary:
      - "#FF6B6B"
      - "#FF8585"
      - "#E55A5A"
    background:
      - "#FFFBF5"
      - "#FFF8F0"
      - "#FFFFFF"
    text:
      - "#3D3D3D"
      - "#5A5A5A"
      - "#8A8A8A"
    functional:
      - "#4ECDC4"
      - "#FFE66D"
      - "#95E1A3"
      - "#FF6B6B"
todos:
  - id: update-tailwind-colors
    content: 更新 tailwind.config.js 中 game 命名空间的配色值为温暖珊瑚色系
    status: completed
  - id: update-css-variables
    content: 更新 style.css 中的 CSS 变量和组件类以匹配新配色
    status: completed
    dependencies:
      - update-tailwind-colors
  - id: update-design-docs
    content: 更新 design-system/math-game/MASTER.md 设计文档
    status: completed
    dependencies:
      - update-tailwind-colors
---

## Product Overview

为数学游戏重新设计全新的配色系统和字体系统，替换现有的靛蓝+橙色配色方案。

## Core Features

- 全新配色方案：温暖珊瑚主色 + 清新薄荷辅色 + 阳光黄强调色
- 儿童友好的字体字号系统
- 更新 Tailwind 配置和 CSS 变量
- 保持向后兼容性

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **Styling**: Tailwind CSS 3.x with custom theme
- **Build Tool**: Vite 7.x

## Implementation Approach

更新现有 `game` 命名空间的配色值，替换为全新的温暖珊瑚色系。保留其他配色系统（peppa, macaron, candy, toddler, boy）作为向后兼容。同步更新 CSS 变量和组件样式类。

### New Color Palette

| Role | Color | Hex | Usage |
| --- | --- | --- | --- |
| Primary | Warm Coral | #FF6B6B | Main buttons, brand elements |
| Secondary | Fresh Mint | #4ECDC4 | Secondary actions, accents |
| Accent | Sunshine Yellow | #FFE66D | Highlights, rewards |
| Success | Grass Green | #95E1A3 | Success states, progress |
| Background | Cream White | #FFFBF5 | Page background |
| Text | Dark Gray | #3D3D3D | Primary text |


### Typography System

- **Headings**: Fredoka (rounded, child-friendly)
- **Body**: Nunito (clear, readable)
- **Minimum base size**: 18px for children

## Directory Structure

```
project-root/
├── tailwind.config.js          # [MODIFY] Update game color values
├── src/
│   └── style.css               # [MODIFY] Update CSS variables and component classes
└── design-system/
    └── math-game/
        └── MASTER.md           # [MODIFY] Update design documentation
```

## Design Style

采用温暖活泼的配色风格，适合儿童数学游戏：

### Color System

- **主色 (Primary)**: 温暖珊瑚 #FF6B6B - 活泼可爱，用于主按钮和品牌元素
- **辅色 (Secondary)**: 清新薄荷 #4ECDC4 - 清新活力，用于次级操作
- **强调色 (Accent)**: 阳光黄 #FFE66D - 快乐积极，用于高亮和奖励
- **成功色 (Success)**: 草绿 #95E1A3 - 自然成长感，用于成功状态
- **背景色 (Background)**: 奶油白 #FFFBF5 - 温暖舒适，页面背景
- **文字色 (Text)**: 深灰 #3D3D3D - 保证可读性

### Typography System

- **标题字体**: Fredoka - 圆润友好，适合儿童
- **正文字体**: Nunito - 清晰易读
- **最小字号**: 18px (儿童友好)
- **行高**: 1.5-1.6 (舒适阅读)

### Visual Effects

- 柔和的阴影系统
- 圆润的圆角 (16px-40px)
- 温暖的渐变效果
- 儿童友好的动画反馈