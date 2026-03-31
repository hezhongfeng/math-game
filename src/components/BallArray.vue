<script setup>
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    required: true,
    validator: (v) => v >= 1 && v <= 1000
  }
})

// Three.js refs
const canvasRef = ref(null)
let scene = null
let camera = null
let renderer = null
let controls = null
let instancedMesh = null
let animationId = null
let THREE = null
let OrbitControls = null

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

// 动态加载 Three.js
async function loadThree() {
  if (THREE) return
  
  const threeModule = await import('three')
  THREE = threeModule
  
  const controlsModule = await import('three/examples/jsm/controls/OrbitControls.js')
  OrbitControls = controlsModule.OrbitControls
}

// 初始化 Three.js 场景
async function initScene() {
  if (!canvasRef.value) return
  
  await loadThree()
  
  const container = canvasRef.value
  const width = container.clientWidth
  const height = container.clientHeight
  
  // 场景
  scene = new THREE.Scene()
  
  // 相机
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(8, 6, 8)
  camera.lookAt(0, 0, 0)
  
  // 渲染器
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)
  
  // 控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.enablePan = false
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.autoRotate = true
  controls.autoRotateSpeed = 1.5
  controls.minPolarAngle = Math.PI * 0.1
  controls.maxPolarAngle = Math.PI * 0.9
  controls.target.set(0, 0, 0)
  
  // 灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
  directionalLight.position.set(5, 8, 5)
  scene.add(directionalLight)
  
  const directionalLight2 = new THREE.DirectionalLight(0x6DB3FF, 0.4)
  directionalLight2.position.set(-5, 3, -5)
  scene.add(directionalLight2)
  
  // 创建小球
  createBalls()
  
  // 动画循环
  animate()
}

// 创建 1000 个球
function createBalls() {
  const size = 10
  const spacing = 1.2
  const ballRadius = 0.45
  const totalBalls = size * size * size // 1000
  
  // 球体几何（复用）
  const sphereGeometry = new THREE.SphereGeometry(ballRadius, 16, 12)
  
  // 物理材质 - 真实光照
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x0066FF,
    metalness: 0.05,
    roughness: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    reflectivity: 0.5
  })
  
  // 实例化网格
  instancedMesh = new THREE.InstancedMesh(sphereGeometry, material, totalBalls)
  
  const dummy = new THREE.Object3D()
  let index = 0
  
  // 计算偏移使立方体居中
  const offset = (size - 1) * spacing / 2
  
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        dummy.position.set(
          x * spacing - offset,
          y * spacing - offset,
          z * spacing - offset
        )
        dummy.updateMatrix()
        instancedMesh.setMatrixAt(index, dummy.matrix)
        index++
      }
    }
  }
  
  instancedMesh.instanceMatrix.needsUpdate = true
  scene.add(instancedMesh)
}

// 动画循环
function animate() {
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

// 清理
function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  
  if (controls) {
    controls.dispose()
    controls = null
  }
  
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
    renderer = null
  }
  
  if (instancedMesh) {
    instancedMesh.geometry?.dispose()
    instancedMesh.material?.dispose()
    instancedMesh = null
  }
  
  scene = null
  camera = null
}

// 响应窗口大小变化
function handleResize() {
  if (!canvasRef.value || !renderer || !camera) return
  
  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  if (displayData.value.mode === 'cubes') {
    nextTick(() => {
      initScene()
    })
  }
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('resize', handleResize)
})

// 监听模式变化
watch(() => displayData.value.mode, (newMode) => {
  if (newMode === 'cubes') {
    cleanup()
    nextTick(() => {
      initScene()
      window.addEventListener('resize', handleResize)
    })
  } else {
    cleanup()
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<template>
  <div class="ball-array">
    <!-- 1000 立方体展示 - Three.js 3D -->
    <div v-if="displayData.mode === 'cubes'" class="cubes-container">
      <div ref="canvasRef" class="canvas-wrapper">
        <!-- Three.js canvas 将插入这里 -->
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
  background: radial-gradient(
    circle at 30% 30%,
    #6DB3FF 0%,
    #0066FF 50%,
    #004DB3 100%
  );
  box-shadow: 
    inset 0 -2px 4px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(0, 102, 255, 0.3);
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

/* ========== Three.js 3D立方体 ========== */
.cubes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.canvas-wrapper {
  width: 280px;
  height: 280px;
  border-radius: 16px;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(0, 102, 255, 0.03) 0%, transparent 70%);
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}

.canvas-wrapper canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
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
  
  .canvas-wrapper {
    width: 240px;
    height: 240px;
  }
}
</style>
