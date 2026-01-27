# 数学运算游戏 - 设计文档 🐷

## 📋 概述

本项目是一个**移动优先（Mobile-First）**的儿童数学启蒙教育游戏，专为手机浏览器设计。采用 Vue 3 + Tailwind CSS 技术栈，提供趣味互动的加减法练习体验。

---

## 🎯 设计原则

### 1. 移动优先（Mobile-First）

- **默认设计**：首先针对手机屏幕（320px+）进行优化
- **渐进增强**：使用 `md:`、`lg:` 前缀为平板和桌面提供更大尺寸
- **触摸友好**：所有交互元素满足最小触摸目标要求

### 2. 儿童友好

- **圆润设计**：使用 `rounded-cute-*` 系列圆角（16px-40px）
- **明亮配色**：Peppa Pig 风格主题色（蓝、绿、橙、黄）
- **即时反馈**：动画效果增强成就感和参与度

### 3. 简单直观

- **单手操作**：主要交互可通过触摸完成
- **清晰层级**：视觉层次分明，聚焦当前任务
- **容错设计**：撤销、确认等机制降低错误成本

---

## 📱 移动端适配规范

### 视口配置

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
```

| 属性 | 值 | 说明 |
|------|-----|------|
| width | device-width | 设备宽度 |
| initial-scale | 1.0 | 初始缩放 |
| maximum-scale | 1.0 | 禁止缩放（防止游戏误操作） |
| user-scalable | no | 禁止用户缩放 |

### 触摸目标尺寸

| 元素类型 | 最小尺寸 | 实现方式 |
|----------|----------|----------|
| 数字键盘按钮 | 64×64px | `min-h-[64px] min-w-[64px]` |
| 功能按钮（确认/删除） | 64×64px | `aspect-square + min-size` |
| 难度卡片 | 88px 高度 | `min-height: 88px` |
| 主要操作按钮 | 48px 高度 | `py-4` (≈48px) |

**标准来源**：WCAG 2.1 无障碍指南规定触摸目标 ≥44×44px，本项目采用 64px 以提供更大容错空间。

### 安全区域（Safe Area）

支持刘海屏、灵动岛等异形屏幕：

```css
/* 顶部安全区域 */
padding-top: max(10px, env(safe-area-inset-top));

/* 底部安全区域 */
padding-bottom: max(24px, env(safe-area-inset-bottom));
```

### iOS 特定优化

```css
/* 去除触摸高亮 */
-webkit-tap-highlight-color: transparent;

/* 禁止双击缩放 */
touch-action: manipulation;

/* 惯性滚动 */
-webkit-overflow-scrolling: touch;
```

---

## 🎨 响应式设计

### 断点定义

| 断点 | 宽度 | 典型设备 | 适配内容 |
|------|------|----------|----------|
| 默认 | <768px | 手机竖屏 | 默认布局 |
| md: | ≥768px | 平板横屏/桌面 | 按钮字体放大 |
| lg: | ≥1024px | 桌面显示器 | 更宽松的间距 |

### 响应式示例

```vue
<!-- NumberPad.vue -->
<button class="text-5xl md:text-6xl font-bold ...">
  <!-- 手机 5xl，桌面 6xl -->
</button>

<button class="min-h-[64px] md:min-h-[72px] ...">
  <!-- 手机 64px，桌面 72px -->
</button>
```

### 布局策略

```
手机 (320px-767px):
┌─────────────────────┐
│     顶部导航栏       │
├─────────────────────┤
│                     │
│     题目卡片         │
│                     │
├─────────────────────┤
│                     │
│     数字键盘         │
│                     │
├─────────────────────┤
│     底部得分板       │
└─────────────────────┘

平板/桌面 (768px+):
┌─────────────────────────────┐
│     顶部导航栏               │
├─────────────────────────────┤
│                             │
│         题目卡片             │
│         (更大尺寸)           │
│                             │
├─────────────────────────────┤
│                             │
│         数字键盘             │
│         (更大按钮)           │
│                             │
├─────────────────────────────┤
│         底部得分板           │
└─────────────────────────────┘
```

---

## 🔧 CSS 架构

### Tailwind 配置（tailwind.config.js）

```javascript
module.exports = {
  theme: {
    extend: {
      // 自定义圆角
      borderRadius: {
        'cute': '16px',
        'cute-lg': '24px',
        'cute-xl': '32px',
        'cute-2xl': '40px',
      },
      // 自定义阴影
      boxShadow: {
        'cute': '0 6px 20px rgba(74, 144, 226, 0.15)',
        'cute-lg': '0 10px 30px rgba(74, 144, 226, 0.2)',
      },
      // 自定义动画
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2.5s ease-in-out infinite',
      },
    },
  },
}
```

### 全局样式（style.css）

```css
@layer base {
  body {
    /* 移动端滚动优化 */
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: touch;
  }
  
  #app {
    min-height: 100vh;
    overflow-x: hidden;
  }
}
```

---

## 📐 组件设计

### NumberPad（数字键盘）

```
┌───┬───┬───┐
│ 1 │ 2 │ 3 │
├───┼───┼───┤
│ 4 │ 5 │ 6 │
├───┼───┼───┤
│ 7 │ 8 │ 9 │
├───┼───┼───┤
│删除│ 0 │ ✓ │
└───┴───┴───┘

每格: 64×64px (手机) / 72×72px (桌面)
间距: gap-3 (手机) / gap-4 (桌面)
```

### QuestionCard（题目卡片）

- **手机**：字体 5xl，问题间间距 12px
- **桌面**：字体 7xl，问题间间距 16px
- **圆角**：rounded-cute-2xl (40px)
- **宽度**：min-width: 280px, max-width: 95vw

### DifficultyCard（难度卡片）

- **最小高度**：88px（满足触摸目标）
- **圆角**：rounded-20px
- **触摸优化**：-webkit-tap-highlight-color: transparent

---

## 🎮 交互设计

### 触摸反馈

| 状态 | 效果 | 实现 |
|------|------|------|
| 默认 | 无 | base styles |
| hover (桌面) | 阴影加深、上移 | `hover:shadow-cute-lg hover:-translate-y-0.5` |
| active | 按压效果 | `active:scale-95 active:translate-y-0.5` |

### 动画效果

| 场景 | 动画 | 时长 |
|------|------|------|
| 卡片入场 | cardEntrance | 0.5s |
| 按钮入场 | buttonEntrance | 0.6s |
| 答案正确 | correctPop | 0.6s |
| 答案错误 | wrongShake | 0.6s |
| 题目切换 | question | 0.3s |

---

## 🌐 浏览器支持

### 桌面端

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |

### 移动端

| 平台 | 浏览器 | 支持状态 | 备注 |
|------|--------|----------|------|
| iOS | Safari 14+ | ✅ 完全支持 | 触觉反馈需交互后 |
| iOS | Chrome 90+ | ✅ 完全支持 | |
| Android | Chrome 90+ | ✅ 完全支持 | |
| Android | Firefox 90+ | ✅ 完全支持 | |

### 功能支持矩阵

| 功能 | iOS Safari | Android Chrome | 降级方案 |
|------|------------|----------------|----------|
| Vibration API | ⚠️ 部分支持 | ✅ | 静默失败 |
| Web Speech API | ✅ | ✅ | 显示提示 |
| LocalStorage | ✅ | ✅ | 使用内存存储 |
| CSS 动画 | ✅ | ✅ | 使用 JS 动画 |
| Web Audio API | ✅ (需交互) | ✅ | 显示提示 |

#### Web Audio API 兼容性说明

**iOS Safari 特殊处理：**

iOS Safari 对 Web Audio API 有严格的自动播放策略，必须在用户交互的同步代码路径中恢复 AudioContext。本项目已针对此限制进行优化：

1. **同步执行 AudioContext 恢复**：在 `onMounted` 和事件处理程序中同步调用 `resume()`
2. **优化事件监听**：
   - `touchstart` 事件使用 `once: true` 避免重复监听
   - 所有事件使用 `passive: true` 提升滚动性能
   - 在捕获阶段（capture: true）处理事件以确保及时恢复
3. **触摸处理优化**：
   - 所有交互元素添加 `-webkit-tap-highlight-color: transparent`
   - 使用 `touch-action: manipulation` 禁止双击缩放
4. **延时音效修复**：
   - 在 `setTimeout` 中重新检查 AudioContext 状态
   - 如处于 suspended 状态，再次调用 `resume()` 并等待恢复
5. **音频上下文管理**：
   - 集中管理 AudioContext 实例，避免重复创建
   - 提供 `forceInitializeAudioContext()` 工具函数

**实现文件**：`src/utils/audioContext.js`、`src/composables/useSound.js`

---

## ⚡ 性能优化

### 渲染优化

- **CSS 动画**：使用 transform/opacity，避免重排
- **组件懒加载**：路由级别代码分割
- **图标优化**：Lucide Vue Next 按需导入

### 包体积

- **构建大小**：~146KB (gzip: 53KB)
- **CSS 大小**：~63KB (gzip: 12KB)
- **首屏加载**：< 500ms (3G 网络)

---

## 📋 开发规范

### 新增组件检查清单

- [ ] 触摸目标 ≥44×44px
- [ ] 添加 `-webkit-tap-highlight-color: transparent`
- [ ] 添加 `touch-action: manipulation`
- [ ] 支持安全区域（必要时）
- [ ] 测试移动端滚动行为
- [ ] 添加响应式样式（md: 前缀）

### 响应式测试

1. Chrome DevTools 设备模拟器
2. 实际设备测试（iOS + Android）
3. 旋转屏幕测试
4. 低电量模式测试

---

## 📄 许可证

本项目仅供学习和个人使用。
