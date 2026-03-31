<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    required: true,
    validator: (v) => v >= 1 && v <= 1000
  }
})

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
</script>

<template>
  <div class="ball-array">
    <!-- 1000 立方体展示 -->
    <div v-if="displayData.mode === 'cubes'" class="cubes-container">
      <div class="cube-visual">
        <div class="cube-front">
          <span v-for="i in 100" :key="i" class="ball ball-tiny"></span>
        </div>
        <div class="cube-side"></div>
        <div class="cube-top"></div>
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
}

.ball-tiny {
  width: 10px;
  height: 10px;
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

/* 立方体容器 */
.cubes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.cube-visual {
  width: 160px;
  height: 160px;
  position: relative;
  background: linear-gradient(135deg, #3385FF 0%, #0066FF 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 32px rgba(0, 102, 255, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.2);
}

.cube-front {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 1px;
  padding: 8px;
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
}
</style>
