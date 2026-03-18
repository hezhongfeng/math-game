# 音效反馈系统实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为数学游戏添加完整的音效反馈系统,包括9种场景的音效

**Architecture:** 使用Web Audio API合成简单音效 + 外部MP3文件播放复杂音效的混合方案

**Tech Stack:** Web Audio API, HTML5 Audio, Vue 3 Composition API

---

## 文件结构

```
src/
├── assets/
│   └── sounds/           # 外部音效文件
│       ├── victory.mp3
│       └── unlock.mp3
├── composables/
│   └── useSound.js      # 音效管理器 (新建)
├── pages/
│   ├── Home.vue         # 首页按钮音效 (修改)
│   ├── DifficultySelect.vue  # 关卡选择音效 (修改)
│   └── Game.vue         # 游戏音效 (修改)
└── components/
    └── NumberPad.vue    # 数字键盘音效 (修改)
```

---

## Chunk 1: 音效管理器核心

### Task 1: 创建useSound.js音效管理器

**Files:**
- Create: `src/composables/useSound.js`

- [ ] **Step 1: 创建音效管理器基础代码**

```javascript
// src/composables/useSound.js
import { ref, onMounted } from 'vue'

// 单例模式
const audioContext = ref(null)
const isInitialized = ref(false)

/**
 * 初始化AudioContext (处理iOS兼容)
 */
export function initAudio() {
  if (isInitialized.value) return
  
  try {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    // iOS需要用户交互后才能resume
    if (audioContext.value.state === 'suspended') {
      document.addEventListener('touchstart', () => {
        audioContext.value?.resume()
      }, { once: true })
    }
    isInitialized.value = true
  } catch (e) {
    console.warn('Web Audio API not supported:', e)
  }
}

/**
 * 播放合成音效
 * @param {number} frequency - 频率(Hz)
 * @param {number} duration - 时长(ms)
 * @param {string} type - 波形类型 'sine'|'triangle'|'square'
 * @param {number} volume - 音量 0-1
 */
export function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  if (!audioContext.value) return
  
  const ctx = audioContext.value
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.type = type
  oscillator.frequency.value = frequency
  
  const now = ctx.currentTime
  const durationSec = duration / 1000
  
  gainNode.gain.setValueAtTime(volume, now)
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + durationSec)
  
  oscillator.start(now)
  oscillator.stop(now + durationSec)
}

/**
 * 播放按钮点击音效
 */
export function playClick() {
  playTone(800, 80, 'sine', 0.25)
}

/**
 * 播放数字键盘音效
 */
export function playKeyPress() {
  playTone(600, 60, 'sine', 0.2)
}

/**
 * 播放正确答案音效
 */
export function playCorrect() {
  if (!audioContext.value) return
  // 双音升调
  playTone(880, 100, 'sine', 0.3)
  setTimeout(() => playTone(1320, 150, 'sine', 0.3), 80)
}

/**
 * 播放错误答案音效
 */
export function playWrong() {
  playTone(200, 300, 'triangle', 0.3)
}

/**
 * 播放题目出现音效
 */
export function playQuestion() {
  playTone(440, 100, 'sine', 0.15)
}

/**
 * 播放返回音效
 */
export function playBack() {
  playTone(500, 100, 'sine', 0.2)
}

// 外部音频播放器
const victoryAudio = ref(null)
const unlockAudio = ref(null)

/**
 * 加载外部音效
 */
export function loadExternalSounds() {
  victoryAudio.value = new Audio('/sounds/victory.mp3')
  unlockAudio.value = new Audio('/sounds/unlock.mp3')
  
  // 预加载
  victoryAudio.value.preload = 'auto'
  unlockAudio.value.preload = 'auto'
}

/**
 * 播放胜利音效
 */
export function playVictory() {
  victoryAudio.value?.play().catch(e => console.warn('victory sound failed:', e))
}

/**
 * 播放解锁音效
 */
export function playUnlock() {
  unlockAudio.value?.play().catch(e => console.warn('unlock sound failed:', e))
}

export function useSound() {
  onMounted(() => {
    initAudio()
    loadExternalSounds()
  })
  
  return {
    playClick,
    playKeyPress,
    playCorrect,
    playWrong,
    playQuestion,
    playBack,
    playVictory,
    playUnlock
  }
}
```

- [ ] **Step 2: 验证文件创建成功**

检查文件是否存在,语法是否正确

---

## Chunk 2: 页面集成

### Task 2: 首页按钮音效

**Files:**
- Modify: `src/pages/Home.vue`

- [ ] **Step 1: 添加音效到Home.vue**

读取文件后,在script setup中添加:
```javascript
import { useSound } from '../composables/useSound'

const { playClick } = useSound()
```

在按钮点击处添加:
```javascript
@click="playClick()"
```

- [ ] **Step 2: 验证修改**

---

### Task 3: 难度选择页音效

**Files:**
- Modify: `src/pages/DifficultySelect.vue`

- [ ] **Step 1: 添加音效到DifficultySelect.vue**

读取文件后,在script setup中添加音效导入和调用
在难度卡片点击处添加 playClick()

- [ ] **Step 2: 验证修改**

---

### Task 4: 数字键盘音效

**Files:**
- Modify: `src/components/NumberPad.vue`

- [ ] **Step 1: 添加按键音效**

在NumberPad组件的按键点击处添加 playKeyPress()

- [ ] **Step 2: 验证修改**

---

### Task 5: 游戏页面音效

**Files:**
- Modify: `src/pages/Game.vue`

- [ ] **Step 1: 添加游戏音效**

读取文件后,找到以下触发点:
1. 提交答案时 - playClick()
2. 正确答案 - playCorrect()
3. 错误答案 - playWrong()
4. 题目出现 - playQuestion()
5. 完成游戏 - playVictory()
6. 解锁新关卡 - playUnlock()
7. 返回按钮 - playBack()

- [ ] **Step 2: 验证修改**

---

## Chunk 3: 外部音效资源

### Task 6: 准备外部音效文件

**Files:**
- Create: `public/sounds/victory.mp3`
- Create: `public/sounds/unlock.mp3`

- [ ] **Step 1: 创建音效目录**

在 public/ 目录下创建 sounds/ 目录

- [ ] **Step 2: 说明音效文件要求**

由于无法自动生成音频文件,需要在README中说明需要的音效文件规格:

**victory.mp3:**
- 时长: 500-800ms
- 内容: 胜利号角/星星闪烁音效
- 格式: MP3, 128kbps

**unlock.mp3:**
- 时长: 400-600ms  
- 内容: 庆祝叮当音效
- 格式: MP3, 128kbps

**可用的免费音效资源:**
- freesound.org
- mixkit.co
- zapsplat.com

---

## Chunk 4: 验证与测试

### Task 7: 整体验证

- [ ] **Step 1: 运行开发服务器**

```bash
pnpm dev
```

- [ ] **Step 2: 测试音效功能**

在手机浏览器中测试:
1. 首页点击按钮 - 应听到点击音效
2. 进入难度选择 - 点击关卡有音效
3. 游戏中点击数字键盘 - 有按键音效
4. 提交正确答案 - 有正确音效
5. 提交错误答案 - 有错误音效
6. 完成游戏 - 有胜利音效

- [ ] **Step 3: 修复问题**

如有音效不工作,检查:
1. AudioContext是否正确初始化
2. 音量是否合适
3. iOS兼容处理是否生效

---

## 验收清单

- [ ] useSound.js 音效管理器已创建
- [ ] Home.vue 按钮音效已添加
- [ ] DifficultySelect.vue 难度选择音效已添加
- [ ] NumberPad.vue 键盘音效已添加
- [ ] Game.vue 游戏音效已添加
- [ ] public/sounds/ 目录已创建
- [ ] 音效文件说明已添加
- [ ] 移动端测试通过
