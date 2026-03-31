<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    required: true,
    validator: (v) => v >= 1 && v <= 1000
  }
})

// 3D旋转状态
const rotateX = ref(-25)
const rotateY = ref(35)
const isDragging = ref(false)
const lastX = ref(0)
const lastY = ref(0)
const cubeRef = ref(null)

// 触摸/鼠标事件处理
function handlePointerDown(e) {
  isDragging.value = true
  const point = e.touches ? e.touches[0] : e
  lastX.value = point.clientX
  lastY.value = point.clientY
}

function handlePointerMove(e) {
  if (!isDragging.value) return
  e.preventDefault()
  const point = e.touches ? e.touches[0] : e
  const deltaX = point.clientX - lastX.value
  const deltaY = point.clientY - lastY.value
  rotateY.value += deltaX * 0.5
  rotateX.value -= deltaY * 0.5
  lastX.value = point.clientX
  lastY.value = point.clientY
}

function handlePointerUp() {
  isDragging.value = false
}

function handleTouchCancel() {
  isDragging.value = false
}

// 计算展示数据：严格十进制
const displayData = computed(() => {
  const n = props.count
  
  if (n >= 1000) {
    return { 
      mode: 'cubes',
      cubes: 1,
      label: '10×10×10 立方体 = 1000'
    }
  } else if (n >= 100) {
    const flats = Math.floor(n / 100)
    const remaining = n % 100
    const rows = Math.floor(remaining / 10)
    const balls = remaining % 10
    
    let label = `${flats}面(${flats * 100}个)`
    if (rows > 0) label += ` + ${rows}行(${rows * 10}个)`
    if (balls > 0) label += ` + ${balls}个`
    label += ` = ${n}`
    
    return { mode: 'flats', flats, rows, balls, label }
  } else {
    const rows = Math.floor(n / 10)
    const balls = n % 10
    
    let label = ''
    if (rows > 0) label += `${rows}行`
    if (rows > 0 && balls > 0) label += ' + '
    if (balls > 0) label += `${balls}个`
    label += ` = ${n}`
    
    return { mode: 'rows', rows, balls, label }
  }
})

// 生成行数组
const ballRows = computed(() => {
  const { rows, balls } = displayData.value
  const result = []
  for (let i = 0; i < rows; i++) result.push(10)
  if (balls > 0) result.push(balls)
  return result
})

// 立方体数据：只渲染外层小球
const cubeBalls = computed(() => {
  const balls = []
  const size = 10
  const spacing = 14 // 小球间距（像素）
  
  // 只渲染可见面（前面、上面、右面）
  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // 只渲染外层
        const isFront = z === size - 1
        const isTop = y === 0
        const isRight = x === size - 1
        const isBack = z === 0
        const isBottom = y === size - 1
        const isLeft = x === 0
        
        // 至少在一个面上
        if (isFront || isTop || isRight || isBack || isBottom || isLeft) {
          balls.push({
            x: x * spacing,
            y: y * spacing,
            z: z * spacing,
            isFront,
            isTop,
            isRight
          })
        }
      }
    }
  }
  return balls
})

onMounted(() => {
  document.addEventListener('mouseup', handlePointerUp)
  document.addEventListener('touchend', handlePointerUp)
  document.addEventListener('touchcancel', handleTouchCancel)
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handlePointerUp)
  document.removeEventListener('touchend', handlePointerUp)
  document.removeEventListener('touchcancel', handleTouchCancel)
})
</script>

<template>
  <div class="ball-array">
    <!-- 1000 立方体展示 - 3D可旋转 -->
    <div v-if="displayData.mode === 'cubes'" class="cubes-container">
      <div class="cube-scene">
        <div 
          ref="cubeRef"
          class="cube-3d"
          :style="{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }"
          @mousedown="handlePointerDown"
          @mousemove="handlePointerMove"
          @touchstart.prevent="handlePointerDown"
          @touchmove.prevent="handlePointerMove"
          @touchend="handlePointerUp"
          @touchcancel="handleTouchCancel"
        >
          <!-- 前面 -->
          <div class="cube-face cube-face-front">
            <div v-for="row in 10" :key="row" class="face-row">
              <span 
                v-for="col in 10" 
                :key="col" 
                class="ball ball-3d"
                :style="{ animationDelay: `${(row * 10 + col) * 3}ms` }"
              ></span>
            </div>
          </div>
          
          <!-- 后面 -->
          <div class="cube-face cube-face-back">
            <div v-for="row in 10" :key="row" class="face-row">
              <span 
                v-for="col in 10" 
                :key="col" 
                class="ball ball-3d"
              ></span>
            </div>
          </div>
          
          <!-- 左面 -->
          <div class="cube-face cube-face-left">
            <div v-for="row in 10" :key="row" class="face-row">
              <span 
                v-for="col in 10" 
                :key="col" 
                class="ball ball-3d"
              ></span>
            </div>
          </div>
          
          <!-- 右面 -->
          <div class="cube-face cube-face-right">
            <div v-for="row in 10" :key="row" class="face-row">
              <span 
                v-for="col in 10" 
                :key="col" 
                class="ball ball-3d"
              ></span>
            </div>
          </div>
          
          <!-- 上面 -->
          <div class="cube-face cube-face-top">
            <div v-for="row in 10" :key="row" class="face-row">
              <span 
                v-for="col in 10" 
                :key="col" 
                class="ball ball-3d"
              ></span>
            </div>
          </div>
          
          <!-- 下面 -->
          <div class="cube-face cube-face-bottom">
            <div v-for="row in 10" :key="row" class="face-row">
              <span 
                v-for="col in 10" 
                :key="col" 
                class="ball ball-3d"
              ></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cube-hint">
        <span>👆 拖动旋转</span>
      </div>
      <div class="cube-label">10 × 10 × 10</div>
    </div>
    
    <!-- 100-999 面展示 -->
    <div v-else-if="displayData.mode === 'flats'" class="flats-container">
      <!-- 完整面 -->
      <div 
        v-for="fIdx in displayData.flats" 
        :key="`flat-${fIdx}`" 
        class="flat-surface"
      >
        <div v-for="r in 10" :key="r" class="ball-row">
          <span 
            v-for="b in 10" 
            :key="b" 
            class="ball ball-small"
            :style="{ animationDelay: `${(fIdx * 100 + (r - 1) * 10 + b) * 5}ms` }"
          ></span>
        </div>
      </div>
      
      <!-- 剩余行 -->
      <div v-if="displayData.rows > 0" class="remaining-rows">
        <div v-for="r in displayData.rows" :key="`rem-row-${r}`" class="ball-row">
          <span 
            v-for="b in 10" 
            :key="b" 
            class="ball ball-small"
            :style="{ animationDelay: `${(displayData.flats * 100 + (r - 1) * 10 + b) * 5}ms` }"
          ></span>
        </div>
      </div>
      
      <!-- 剩余小球 -->
      <div v-if="displayData.balls > 0" class="ball-row">
        <span 
          v-for="b in displayData.balls" 
          :key="b" 
          class="ball ball-small"
          :style="{ animationDelay: `${(displayData.flats * 100 + displayData.rows * 10 + b) * 5}ms` }"
        ></span>
      </div>
    </div>
    
    <!-- 1-99 行展示 -->
    <div v-else class="rows-container">
      <div 
        v-for="(balls, idx) in ballRows" 
        :key="idx" 
        class="ball-row"
      >
        <span 
          v-for="b in balls" 
          :key="b" 
          class="ball"
          :style="{ animationDelay: `${(idx * 10 + b) * 20}ms` }"
        ></span>
      </div>
    </div>
    
    <!-- 文字说明 -->
    <div class="info-text">
      {{ displayData.label }}
    </div>
  </div>
</template>

<style scoped>
.ball-array {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 8px;
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

/* 小球尺寸变体 */
.ball-small {
  width: 14px;
  height: 14px;
  background: radial-gradient(
    circle at 30% 30%,
    #6DB3FF 0%,
    #0066FF 50%,
    #004DB3 100%
  );
  box-shadow: 
    inset 0 -1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.3),
    0 1px 2px rgba(0, 102, 255, 0.3);
  animation: ball-appear 0.4s ease-out backwards;
}

.ball-tiny {
  width: 10px;
  height: 10px;
  background: radial-gradient(
    circle at 30% 30%,
    #6DB3FF 0%,
    #0066FF 50%,
    #004DB3 100%
  );
  box-shadow: 
    inset 0 -1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.3),
    0 1px 2px rgba(0, 102, 255, 0.3);
  animation: ball-appear 0.4s ease-out backwards;
}

.ball-3d {
  width: 14px;
  height: 14px;
  background: radial-gradient(
    circle at 30% 30%,
    #6DB3FF 0%,
    #0066FF 50%,
    #004DB3 100%
  );
  box-shadow: 
    inset 0 -1px 2px rgba(0, 0, 0, 0.25),
    inset 0 1px 2px rgba(255, 255, 255, 0.35),
    0 1px 3px rgba(0, 102, 255, 0.4);
  animation: ball-appear 0.3s ease-out backwards;
}

/* 面容器 */
.flats-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: flex-start;
}

.flat-surface {
  background: rgba(0, 102, 255, 0.05);
  border: 2px solid rgba(0, 102, 255, 0.2);
  border-radius: 12px;
  padding: 6px;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 2px;
}

.remaining-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ========== 3D立方体 ========== */
.cubes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cube-scene {
  width: 200px;
  height: 200px;
  perspective: 600px;
  perspective-origin: center center;
}

.cube-3d {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}

.cube-face {
  position: absolute;
  width: 140px;
  height: 140px;
  left: 50%;
  top: 50%;
  margin-left: -70px;
  margin-top: -70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding: 4px;
  background: rgba(0, 102, 255, 0.08);
  border: 1px solid rgba(0, 102, 255, 0.3);
  border-radius: 8px;
  backface-visibility: visible;
}

.face-row {
  display: flex;
  gap: 2px;
  justify-content: center;
}

/* 6个面的位置 */
.cube-face-front {
  transform: translateZ(70px);
}

.cube-face-back {
  transform: rotateY(180deg) translateZ(70px);
}

.cube-face-left {
  transform: rotateY(-90deg) translateZ(70px);
}

.cube-face-right {
  transform: rotateY(90deg) translateZ(70px);
}

.cube-face-top {
  transform: rotateX(90deg) translateZ(70px);
}

.cube-face-bottom {
  transform: rotateX(-90deg) translateZ(70px);
}

.cube-hint {
  font-size: 12px;
  color: var(--text-secondary);
  padding: 4px 12px;
  background: rgba(0, 102, 255, 0.06);
  border-radius: 12px;
}

.cube-label {
  font-size: 20px;
  font-weight: 800;
  color: var(--hero-blue);
}

/* 文字说明 */
.info-text {
  margin-top: 16px;
  padding: 12px 24px;
  background: rgba(0, 102, 255, 0.08);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  color: var(--hero-blue);
  text-align: center;
}

/* 小屏幕适配 */
@media (max-width: 380px) {
  .ball {
    width: 20px;
    height: 20px;
  }
  
  .ball-small {
    width: 12px;
    height: 12px;
  }
  
  .flat-surface {
    padding: 4px;
    gap: 1px;
  }
  
  .cube-scene {
    width: 160px;
    height: 160px;
  }
  
  .cube-face {
    width: 110px;
    height: 110px;
    margin-left: -55px;
    margin-top: -55px;
  }
  
  .cube-face-front { transform: translateZ(55px); }
  .cube-face-back { transform: rotateY(180deg) translateZ(55px); }
  .cube-face-left { transform: rotateY(-90deg) translateZ(55px); }
  .cube-face-right { transform: rotateY(90deg) translateZ(55px); }
  .cube-face-top { transform: rotateX(90deg) translateZ(55px); }
  .cube-face-bottom { transform: rotateX(-90deg) translateZ(55px); }
  
  .ball-3d {
    width: 10px;
    height: 10px;
  }
}
</style>
