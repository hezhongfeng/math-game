# 数字探索 - 实现计划

> 注意：本文档是数字探索初版的实现计划，当前已完成且方案已升级。
> 实际落地版本已使用 Three.js 重写球阵展示，并增加了挑战模式、范围选择、连续探索和更完整的交互反馈。

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现儿童数字可视化探索功能，孩子可以输入1~1000的数字，看到对应数量的小球阵列

**Architecture:** 初版规划为同一页面两种视图切换（输入视图↔展示视图），复用现有 NumberPad 组件；当前实现已经演进为 Three.js 统一 3D 球阵与双模式交互

**Tech Stack:** Vue 3 (Composition API), Tailwind CSS, Lucide Icons

---

## 文件结构

```
src/
├── components/
│   └── BallArray.vue          # 新建：小球阵列展示组件
├── pages/
│   └── NumberExplore.vue      # 新建：数字探索页面（输入+展示）
├── router.js                  # 修改：添加路由
├── pages/Home.vue             # 修改：添加入口卡片
```

---

## Chunk 1: 入口与路由

### Task 1: Home 页面添加入口卡片

**Files:**
- Modify: `src/pages/Home.vue`

- [ ] **Step 1: 添加导入和状态**

在 `<script setup>` 中添加：
```javascript
import { Binary } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
```

- [ ] **Step 2: 添加导航函数**

```javascript
function goToExplore(event) {
  if (isLeaving.value) return
  isLeaving.value = true
  playClick()
  const btn = event?.currentTarget
  if (btn) btn.classList.add('is-leaving')
  setTimeout(() => {
    router.push('/explore')
  }, NAVIGATION_DELAY)
}
```

- [ ] **Step 3: 在模板的 action-panel 中添加探索入口**

在 `btn-main` 按钮之前添加：
```vue
<button class="btn-explore" data-testid="explore-btn" @click="goToExplore($event)">
  <span class="btn-explore-icon">
    <Binary :size="20" />
  </span>
  <span class="btn-explore-text">数字探索</span>
  <ArrowRight :size="16" class="btn-arrow" />
</button>
```

- [ ] **Step 4: 添加样式**

```css
.btn-explore {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #3385FF 0%, #0066FF 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(0, 102, 255, 0.25);
  transition: all 0.3s var(--ease-out);
  cursor: pointer;
}

.btn-explore:active {
  transform: scale(0.96);
}

.btn-explore-icon {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 5: 提交**

```bash
git add src/pages/Home.vue
git commit -m "feat(ui): add number exploration entry card"
```

---

### Task 2: 添加路由

**Files:**
- Modify: `src/router.js`

- [ ] **Step 1: 添加导入**

```javascript
import NumberExplore from './pages/NumberExplore.vue'
```

- [ ] **Step 2: 添加路由**

```javascript
{
  path: '/explore',
  name: 'NumberExplore',
  component: NumberExplore,
  meta: { title: '数字探索' }
}
```

- [ ] **Step 3: 提交**

```bash
git add src/router.js
git commit -m "feat(router): add /explore route"
```

---

## Chunk 2: 核心组件

### Task 3: 创建小球阵列展示组件

**Files:**
- Create: `src/components/BallArray.vue`

- [ ] **Step 1: 创建组件基础结构**

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    required: true,
    validator: (v) => v >= 1 && v <= 1000
  }
})

// 计算行列：严格十进制
const cubes = computed(() => {
  const n = props.count
  if (n >= 1000) {
    // 1000 = 10×10×10 立方体
    return { cubes: 10, rows: 10, remaining: 0, display: 'cubes' }
  } else if (n >= 100) {
    // 100-999 = N面 + 剩余
    const flat = Math.floor(n / 100) // 面数
    const remaining = n % 100 // 剩余
    const rows = remaining > 0 ? Math.floor(remaining / 10) : 0
    const balls = remaining % 10
    return { flat, rows, balls, display: 'flat' }
  } else {
    // 1-99 = N行 + 剩余
    const rows = Math.floor(n / 10)
    const balls = n % 10
    return { rows, balls, display: 'rows' }
  }
})

// 生成行数组（每行10个）
const ballRows = computed(() => {
  const { rows, balls } = cubes.value
  const result = []
  // 添加完整行
  for (let i = 0; i < rows; i++) result.push(10)
  // 添加剩余小球
  if (balls > 0) result.push(balls)
  return result
})
</script>

<template>
  <div class="ball-array">
    <!-- 1000 立方体展示 -->
    <div v-if="count >= 1000" class="cubes-container">
      <!-- 10×10×10 示意 -->
    </div>
    
    <!-- 100-999 面展示 -->
    <div v-else-if="count >= 100" class="flats-container">
      <!-- N个面 × 10×10 -->
    </div>
    
    <!-- 1-99 行展示 -->
    <div v-else class="rows-container">
      <div v-for="(balls, idx) in ballRows" :key="idx" class="ball-row">
        <span 
          v-for="b in balls" 
          :key="b" 
          class="ball"
          :style="{ animationDelay: `${(idx * 10 + b) * 30}ms` }"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 样式见下一步 */
</style>
```

- [ ] **Step 2: 添加完整样式（核心：立体小球）**

```css
.ball-array {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}

/* 行容器 */
.rows-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ball-row {
  display: flex;
  gap: 4px;
  justify-content: center;
}

/* 立体蓝色小球 */
.ball {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  /* 蓝色径向渐变 - 立体光照效果 */
  background: radial-gradient(
    circle at 30% 30%,
    #6DB3FF 0%,
    #0066FF 50%,
    #004DB3 100%
  );
  /* 阴影增加立体感 */
  box-shadow: 
    inset 0 -2px 4px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(0, 102, 255, 0.3);
  
  /* 出现动画 */
  animation: ball-appear 0.4s ease-out backwards;
}

@keyframes ball-appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 大数量时自动缩小 */
@media (max-width: 380px) {
  .ball {
    width: 20px;
    height: 20px;
  }
}
</style>
```

- [ ] **Step 3: 实现100-1000的大数量展示（平铺逻辑）**

在 `<template>` 中添加：
```vue
<!-- 100-999 面展示 -->
<div v-else-if="count >= 100" class="flats-container">
  <div 
    v-for="flatIdx in cubes.flat" 
    :key="flatIdx" 
    class="flat-surface"
  >
    <div class="ball-row" v-for="r in 10" :key="r" class="ball-row">
      <span 
        v-for="b in 10" 
        :key="b" 
        class="ball ball-small"
      ></span>
    </div>
  </div>
  <!-- 剩余部分 -->
  <div v-if="cubes.rows > 0" class="remaining-section">
    <div v-for="r in cubes.rows" :key="r" class="ball-row">
      <span v-for="b in 10" :key="b" class="ball ball-small"></span>
    </div>
    <div v-if="cubes.balls > 0" class="ball-row">
      <span v-for="b in cubes.balls" :key="b" class="ball ball-small"></span>
    </div>
  </div>
</div>
```

添加对应样式：
```css
.flats-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.flat-surface {
  background: rgba(0, 102, 255, 0.05);
  border: 2px solid rgba(0, 102, 255, 0.2);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.remaining-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ball-small {
  width: 14px;
  height: 14px;
}
```

- [ ] **Step 4: 添加文字说明区域**

```vue
<div class="info-text">
  <span v-if="count < 100">{{ cubes.rows }}行 + {{ cubes.balls }}个 = {{ count }}</span>
  <span v-else-if="count < 1000">{{ cubes.flat }}面({{ cubes.flat * 100 }}个) + {{ cubes.rows }}行({{ cubes.rows * 10 }}个) + {{ cubes.balls }}个 = {{ count }}</span>
  <span v-else>10×10×10 立方体 = 1000</span>
</div>
```

```css
.info-text {
  margin-top: 24px;
  padding: 12px 24px;
  background: rgba(0, 102, 255, 0.08);
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--hero-blue);
}
```

- [ ] **Step 5: 提交**

```bash
git add src/components/BallArray.vue
git commit -m "feat(component): add BallArray component"
```

---

### Task 4: 创建数字探索页面

**Files:**
- Create: `src/pages/NumberExplore.vue`

- [ ] **Step 1: 创建页面结构**

```vue
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, RotateCcw } from 'lucide-vue-next'
import NumberPad from '../components/NumberPad.vue'
import BallArray from '../components/BallArray.vue'
import { useSound } from '../composables/useSound'

const router = useRouter()
const { playClick, playSuccess } = useSound()

// 状态
const inputNumber = ref('')
const currentCount = ref(0)
const showResult = ref(false)
const errorMsg = ref('')

// 处理数字输入
function handleInput(num) {
  playClick()
  errorMsg.value = ''
  if (inputNumber.value.length < 4) {
    inputNumber.value += num
  }
}

// 处理删除
function handleDelete() {
  playClick()
  inputNumber.value = inputNumber.value.slice(0, -1)
}

// 处理提交
function handleSubmit() {
  playSuccess()
  const num = parseInt(inputNumber.value)
  
  if (!num || num < 1) {
    errorMsg.value = '请输入大于0的数字'
    return
  }
  if (num > 1000) {
    errorMsg.value = '最大支持1000个哦'
    return
  }
  
  currentCount.value = num
  showResult.value = true
}

// 返回重新输入
function goBack() {
  showResult.value = false
  inputNumber.value = ''
  currentCount.value = 0
}

// 返回首页
function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="explore-page">
    <!-- 顶部导航 -->
    <header class="top-nav">
      <button class="nav-btn" @click="goHome">
        <ArrowLeft :size="24" />
      </button>
      <h1 class="page-title">数字探索</h1>
      <div class="nav-placeholder"></div>
    </header>

    <!-- 输入视图 -->
    <main v-if="!showResult" class="input-view">
      <div class="input-display">
        <span class="display-number">{{ inputNumber || '?' }}</span>
        <span class="display-hint">输入数字，点击确认</span>
      </div>
      
      <div v-if="errorMsg" class="error-toast">{{ errorMsg }}</div>
      
      <NumberPad 
        @input="handleInput" 
        @delete="handleDelete" 
        @submit="handleSubmit" 
      />
    </main>

    <!-- 展示视图 -->
    <main v-else class="result-view">
      <div class="result-header">
        <span class="result-count">{{ currentCount }}</span>
      </div>
      
      <BallArray :count="currentCount" />
      
      <button class="back-btn" @click="goBack">
        <RotateCcw :size="20" />
        <span>再试一次</span>
      </button>
    </main>
  </div>
</template>

<style scoped>
/* 样式见下一步 */
</style>
```

- [ ] **Step 2: 添加完整样式**

```css
.explore-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #f0f7ff 0%, #e4eeff 100%);
  display: flex;
  flex-direction: column;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
}

.nav-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(0, 102, 255, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--hero-blue);
  cursor: pointer;
}

.page-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
}

.nav-placeholder {
  width: 44px;
}

/* 输入视图 */
.input-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  gap: 24px;
}

.input-display {
  text-align: center;
}

.display-number {
  display: block;
  font-size: 72px;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
  min-height: 80px;
}

.display-hint {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 8px;
}

.error-toast {
  padding: 12px 24px;
  background: #FFF0F0;
  color: #D32F2F;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

/* 展示视图 */
.result-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}

.result-header {
  margin-bottom: 16px;
}

.result-count {
  font-size: 48px;
  font-weight: 900;
  color: var(--hero-blue);
}

.back-btn {
  margin-top: 32px;
  padding: 16px 32px;
  background: var(--hero-blue);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 102, 255, 0.3);
}

.back-btn:active {
  transform: scale(0.96);
}
</style>
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/NumberExplore.vue
git commit -m "feat(page): add NumberExplore page"
```

---

## Chunk 3: 收尾

### Task 5: 验证与测试

**Files:**
- Test: 手动测试

- [ ] **Step 1: 运行构建**

```bash
pnpm build
```

- [ ] **Step 2: 启动开发服务器**

```bash
pnpm dev
```

- [ ] **Step 3: 手动测试场景**
- [ ] Home 页面显示"数字探索"入口
- [ ] 点击入口跳转到 /explore
- [ ] 输入 47，点击确认，显示 4行+7个
- [ ] 输入 150，点击确认，显示 1面+5行
- [ ] 输入 1000，点击确认，显示立方体
- [ ] 点击"再试一次"可以重新输入
- [ ] 点击返回箭头回到首页
- [ ] 输入 0 显示错误提示
- [ ] 输入 1001 显示错误提示

- [ ] **Step 4: 提交完成**

```bash
git add .
git commit -m "feat: implement number exploration visualization"
```

---

## 验收标准检查

- [ ] Home 页面有"数字探索"入口卡片
- [ ] 可以输入 1~1000 的数字
- [ ] 输入后点击确认显示小球阵列
- [ ] 100 以内显示为 N 行 + M 个
- [ ] 100~999 显示为 N 面 + M 行
- [ ] 1000 显示为立方体
- [ ] 小球有蓝色立体效果
- [ ] 返回按钮可以重新输入
