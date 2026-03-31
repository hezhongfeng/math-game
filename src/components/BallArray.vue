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
      label: '10×10×10 立方体 = 1000',
      layout: '3d'
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
    
    return { mode: 'flats', flats, rows, balls, label, layout: '2d' }
  } else {
    const rows = Math.floor(n / 10)
    const balls = n % 10
    
    let label = ''
    if (rows > 0) label += `${rows}行`
    if (rows > 0 && balls > 0) label += ' + '
    if (balls > 0) label += `${balls}个`
    label += ` = ${n}`
    
    return { mode: 'rows', rows, balls, label, layout: '2d' }
  }
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
  await nextTick()
  
  const container = canvasRef.value
  if (!container) return
  
  const width = container.clientWidth || 280
  const height = container.clientHeight || 280
  
  cleanup()
  
  // 场景
  scene = new THREE.Scene()
  
  // 相机
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  
  // 渲染器
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
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
  
  animate()
}

// 创建小球
function createBalls() {
  const count = props.count
  const ballRadius = 0.45
  const spacing = 1.2
  
  // 球体几何（复用）
  const sphereGeometry = new THREE.SphereGeometry(ballRadius, 16, 12)
  
  // 物理材质
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x0066FF,
    metalness: 0.05,
    roughness: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    reflectivity: 0.5
  })
  
  instancedMesh = new THREE.InstancedMesh(sphereGeometry, material, count)
  
  const dummy = new THREE.Object3D()
  let index = 0
  
  const mode = displayData.value.mode
  
  if (mode === 'cubes') {
    // 1000个：10×10×10 立方体
    const size = 10
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
    
    camera.position.set(8, 6, 8)
    controls.target.set(0, 0, 0)
    
  } else if (mode === 'flats') {
    // 100-999：面 + 行 + 剩余
    const { flats, rows, balls } = displayData.value
    const flatSize = 10
    const flatGap = 2 // 面之间的间距
    const rowGap = 0.5 // 行之间的间距
    
    let offsetX = 0
    
    // 完整面
    for (let f = 0; f < flats; f++) {
      const faceOffsetX = f * (flatSize * spacing + flatGap)
      
      for (let r = 0; r < flatSize; r++) {
        for (let c = 0; c < flatSize; c++) {
          dummy.position.set(
            faceOffsetX + c * spacing - (flatSize - 1) * spacing / 2,
            r * spacing - (flatSize - 1) * spacing / 2,
            0
          )
          dummy.updateMatrix()
          instancedMesh.setMatrixAt(index, dummy.matrix)
          index++
        }
      }
    }
    
    // 剩余行
    const remainingStartX = flats * (flatSize * spacing + flatGap)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < 10; c++) {
        dummy.position.set(
          remainingStartX + c * spacing - 4.5 * spacing,
          r * spacing - (rows - 1) * spacing / 2,
          0
        )
        dummy.updateMatrix()
        instancedMesh.setMatrixAt(index, dummy.matrix)
        index++
      }
    }
    
    // 剩余小球
    const ballsStartX = remainingStartX
    const ballsY = rows > 0 ? rows * spacing : 0
    for (let b = 0; b < balls; b++) {
      dummy.position.set(
        ballsStartX + b * spacing - (balls - 1) * spacing / 2,
        ballsY,
        0
      )
      dummy.updateMatrix()
      instancedMesh.setMatrixAt(index, dummy.matrix)
      index++
    }
    
    // 相机位置
    const totalWidth = flats * (flatSize * spacing + flatGap) + rows * spacing + balls * spacing
    const camDist = Math.max(totalWidth * 0.8, 6)
    camera.position.set(0, 0, camDist)
    controls.target.set(0, 0, 0)
    
  } else {
    // 1-99：行 + 剩余
    const { rows, balls } = displayData.value
    
    let y = 0
    // 完整行
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < 10; c++) {
        dummy.position.set(
          c * spacing - 4.5 * spacing,
          -y,
          0
        )
        dummy.updateMatrix()
        instancedMesh.setMatrixAt(index, dummy.matrix)
        index++
      }
      y++
    }
    
    // 剩余小球
    for (let b = 0; b < balls; b++) {
      dummy.position.set(
        b * spacing - (balls - 1) * spacing / 2,
        -y,
        0
      )
      dummy.updateMatrix()
      instancedMesh.setMatrixAt(index, dummy.matrix)
      index++
    }
    
    // 相机位置
    const totalHeight = (rows + (balls > 0 ? 1 : 0)) * spacing
    const camDist = Math.max(totalHeight * 1.2, 5)
    camera.position.set(0, 0, camDist)
    controls.target.set(0, 0, 0)
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
  
  if (width === 0 || height === 0) return
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  nextTick(() => {
    initScene()
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('resize', handleResize)
})

// 监听 count 变化
watch(() => props.count, () => {
  cleanup()
  nextTick(() => {
    initScene()
  })
})
</script>

<template>
  <div class="ball-array">
    <!-- Three.js 3D 球体展示 -->
    <div class="canvas-container">
      <div ref="canvasRef" class="canvas-wrapper">
        <!-- Three.js canvas 将插入这里 -->
      </div>
    </div>
    
    <div class="cube-hint">
      <span>👆 拖动旋转</span>
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

.canvas-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.canvas-wrapper {
  width: min(90vw, 360px);
  height: min(70vw, 280px);
  border-radius: 16px;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(0, 102, 255, 0.03) 0%, transparent 70%);
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

.canvas-wrapper canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
  touch-action: none;
}

.cube-hint {
  font-size: 12px;
  color: var(--text-secondary);
  padding: 4px 12px;
  background: rgba(0, 102, 255, 0.06);
  border-radius: 12px;
}

/* 文字说明 */
.info-text {
  margin-top: 8px;
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
  .canvas-wrapper {
    width: min(92vw, 320px);
    height: min(70vw, 240px);
  }
}
</style>
