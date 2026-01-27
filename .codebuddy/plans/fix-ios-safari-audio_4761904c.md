---
name: fix-ios-safari-audio
overview: 修复 iOS Safari 浏览器没有声音的问题，包括改进 AudioContext 恢复机制、添加触摸交互支持和优化音效播放逻辑。
todos:
  - id: fix-home-async-init
    content: 移除 Home.vue 中 onMounted 的异步调用，改为同步执行
    status: completed
  - id: add-touch-handling
    content: 为 Home.vue 按钮添加 -webkit-tap-highlight-color 和 touch-action CSS 属性
    status: completed
    dependencies:
      - fix-home-async-init
  - id: enhance-audio-listeners
    content: 优化 audioContext.js 的事件监听器，添加 once 和 passive 配置
    status: completed
  - id: optimize-timeout-sounds
    content: 修复 useSound.js 中 setTimeout 音效播放，添加 AudioContext 状态检查
    status: completed
    dependencies:
      - enhance-audio-listeners
  - id: test-ios-safari
    content: 验证 iOS Safari 上的音频播放效果
    status: completed
    dependencies:
      - add-touch-handling
      - optimize-timeout-sounds
---

## 问题概述

修复 iOS Safari 浏览器音频播放问题，包括改进 AudioContext 恢复机制、添加触摸交互支持和优化音效播放逻辑。

## 核心问题

1. **异步初始化问题**：Home.vue 中 onMounted 异步调用 forceInitializeAudioContext 无效，违反 iOS Safari 同步恢复要求
2. **缺少触摸处理属性**：交互元素未添加 `-webkit-tap-highlight-color: transparent` 和 `touch-action: manipulation`
3. **音频恢复机制不严格**：未确保在用户交互的同步代码路径中恢复 AudioContext
4. **延时音效被阻止**：setTimeout 中的音效可能因 AudioContext 未恢复而被 iOS Safari 阻止

## 修复目标

- 确保所有交互元素正确响应触摸事件
- 在用户首次交互时同步恢复 AudioContext
- 优化音效播放逻辑，避免被浏览器阻止
- 保持代码兼容性和可维护性

## 技术栈

- **前端框架**：Vue 3 + Composition API (`<script setup>`)
- **状态管理**：Pinia 3.x
- **音频处理**：Web Audio API
- **构建工具**：Vite 7.x
- **样式方案**：Tailwind CSS 3.x

## 技术架构

### 系统架构

采用分层架构：

- **表现层**：Vue 组件 + Tailwind CSS
- **业务逻辑层**：Composables (useSound, useGame)
- **音频服务层**：audioContext 工具
- **数据层**：LocalStorage 持久化

```mermaid
graph TD
    A[用户交互] -->|touch/click| B[ensureAudioContextSync]
    B --> C[AudioContext.resume()]
    C --> D[playSound 同步执行]
    D --> E[音频播放成功]
    
    F[setTimeout 音效] --> G[重新检查 AudioContext 状态]
    G --> H[确保运行状态后播放]
```

### 模块划分

- **音频上下文模块** (`utils/audioContext.js`)：AudioContext 生命周期管理
- **音效播放模块** (`composables/useSound.js`)：音效生成和播放控制
- **UI 交互模块** (`pages/*.vue`, `components/*.vue`)：用户交互界面
- **配置模块** (`config/constants.js`)：音频参数配置

### 数据流

用户触摸/点击 → 同步恢复 AudioContext → 立即播放音效 → 状态更新

## 实现细节

### 核心目录结构

```
src/
├── components/
│   ├── NumberPad.vue          # 已包含触摸处理，无需修改
│   ├── ResultModal.vue        # 已包含 touch-manipulation
│   └── DifficultyCard.vue
├── composables/
│   ├── useSound.js            # 修改：优化 setTimeout 音效处理
│   └── useGame.js
├── pages/
│   ├── Home.vue               # 修改：1) 移除异步调用 2) 添加触摸属性
│   ├── Game.vue               # 已包含触摸处理
│   └── DifficultySelect.vue
├── utils/
│   └── audioContext.js        # 修改：增强同步恢复逻辑
└── config/
    └── constants.js           # 已包含音频参数
```

### 关键代码结构

**audioContext.js 增强**：

```javascript
// 同步恢复函数（核心修复）
export function ensureAudioContextSync() {
  const ctx = getAudioContext()
  if (!ctx) return false
  
  if (ctx.state === 'suspended') {
    // 同步调用 resume，不等待结果
    ctx.resume().catch(() => {})
    return true
  }
  return true
}

// 优化事件监听
function setupAudioContextListeners() {
  const events = ['touchstart', 'touchend', 'click', 'keydown', 'pointerdown']
  events.forEach(event => {
    document.addEventListener(event, handleUserInteraction, { 
      capture: true, 
      passive: true, // 优化滚动性能
      once: event === 'touchstart' // touchstart 只监听一次
    })
  })
}
```

**useSound.js 优化**：

```javascript
function playCorrectSound(ctx, oscillator, gainNode, now) {
  // 第一声同步播放
  oscillator.frequency.setValueAtTime(freq.note1, now)
  // ...
  
  // 第二声：在 setTimeout 前再次确保 AudioContext 运行
  setTimeout(() => {
    try {
      // 重新检查状态
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
        // 等待一小段时间确保恢复
        setTimeout(() => {
          if (ctx.state === 'running') {
            // 创建并播放第二声
          }
        }, 50)
      } else {
        // 直接播放
      }
    } catch (error) {}
  }, params.delay1)
}
```

### 技术实现计划

**1. 修复异步初始化问题**

- 将 Home.vue 中的 `await forceInitializeAudioContext()` 改为同步调用
- 移除不必要的 async/await，遵循 iOS Safari 同步要求

**2. 添加触摸处理属性**

- 为 Home.vue 中的按钮添加 `class="btn btn-primary"` 样式类
- 在全局样式或组件样式中添加：

```css
.btn {
-webkit-tap-highlight-color: transparent;
touch-action: manipulation;
}
```

**3. 增强音频恢复机制**

- 优化 `setupAudioContextListeners`，添加 `once: true` 优化 touchstart
- 确保 `ensureAudioContextSync` 在每次播放前调用

**4. 优化延时音效播放**

- 在 setTimeout 中重新检查 AudioContext 状态
- 如仍处于 suspended，再次调用 resume() 并添加短暂延迟
- 确保在 AudioContext 运行后再创建音频节点

### 性能优化

- 使用 `passive: true` 优化滚动性能
- touchstart 事件使用 `once: true` 避免重复监听
- setTimeout 中添加状态检查，避免无效音频节点创建

### 兼容性考虑

- 保持对不支持 AudioContext 的浏览器的降级处理
- 所有错误使用静默处理，不影响主流程
- 维持现有 API 接口，不破坏其他功能