<script setup>
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    required: true,
    validator: (v) => v >= 1 && v <= 1000
  }
})

// 布局类型
const layoutType = ref('grid') // grid | cube | decimal
const isTransitioning = ref(false)

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

// 颜色配置 - 按位数区分
const colors = {
  ones: 0xE53935,    // 个位 - 红色
  tens: 0x1E88E5,   // 十位 - 蓝色
  hundreds: 0x43A047 // 百位 - 绿色
}

// 解析数字的各位
function parseDigits(n) {
  const ones = n % 10
  const tens = Math.floor(n / 10) % 10
  const hundreds = Math.floor(n / 100) % 10
  return { ones, tens, hundreds }
}

// 计算展示数据
const displayData = computed(() => {
  const n = props.count
  const digits = parseDigits(n)
  return { 
    label: `${n} 个小球`,
    layout: layoutType.value,
    digits
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
  
  scene = new THREE.Scene()
  scene.background = null 
  
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
  container.appendChild(renderer.domElement)
  
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = false
  controls.enableZoom = true
  controls.minDistance = 2
  controls.maxDistance = 50
  
  // 环境光 - 更柔和
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  // 主光源 - 带阴影
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
  mainLight.position.set(10, 20, 10)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 1024
  mainLight.shadow.mapSize.height = 1024
  mainLight.shadow.camera.near = 0.5
  mainLight.shadow.camera.far = 50
  mainLight.shadow.camera.left = -20
  mainLight.shadow.camera.right = 20
  mainLight.shadow.camera.top = 20
  mainLight.shadow.camera.bottom = -20
  mainLight.shadow.bias = -0.001
  scene.add(mainLight)
  
  // 补光 - 蓝色冷光
  const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4)
  fillLight.position.set(-5, 5, -5)
  scene.add(fillLight)
  
  // 底部反射平面 - 接触阴影
  const groundGeometry = new THREE.PlaneGeometry(100, 100)
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.15 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -5
  ground.receiveShadow = true
  scene.add(ground)
  
  createBalls()
  
  // 添加点击事件
  renderer.domElement.addEventListener('click', onMouseClick)
  
  animate()
}

// 创建小球：根据布局类型展示
function createBalls() {
  const count = props.count
  const ballRadius = 0.35
  const spacing = 1.0
  
  const sphereGeometry = new THREE.SphereGeometry(ballRadius, 32, 32)
  
  // 创建三种颜色的材质 - 按位数区分
  const materials = {
    ones: new THREE.MeshPhysicalMaterial({
      color: colors.ones,
      transparent: true,
      opacity: 0.92,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.15,
      thickness: 1.2,
      ior: 1.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    }),
    tens: new THREE.MeshPhysicalMaterial({
      color: colors.tens,
      transparent: true,
      opacity: 0.92,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.15,
      thickness: 1.2,
      ior: 1.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    }),
    hundreds: new THREE.MeshPhysicalMaterial({
      color: colors.hundreds,
      transparent: true,
      opacity: 0.92,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.15,
      thickness: 1.2,
      ior: 1.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  }
  
  // 根据布局类型计算位置
  const positions = calculatePositions(count, layoutType.value, spacing)
  
  // 创建 InstancedMesh - 使用基础材质
  instancedMesh = new THREE.InstancedMesh(sphereGeometry, materials.ones, count)
  instancedMesh.castShadow = true
  instancedMesh.receiveShadow = true
  
  const dummy = new THREE.Object3D()
  const ballColor = new THREE.Color()
  
  for (let i = 0; i < count; i++) {
    const pos = positions[i]
    dummy.position.set(pos.x, pos.y, pos.z)
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)
    
    // 根据位置的颜色类型设置颜色
    const colorType = pos.color || 'ones'
    ballColor.set(materials[colorType].color)
    instancedMesh.setColorAt(i, ballColor)
  }
  
  instancedMesh.instanceMatrix.needsUpdate = true
  instancedMesh.instanceColor.needsUpdate = true
  scene.add(instancedMesh)
  
  // 调整相机位置
  const bounds = getBounds(positions)
  const maxDim = Math.max(bounds.width, bounds.height, bounds.depth, 8)
  camera.position.set(0, maxDim * 0.3, maxDim * 1.8)
  controls.target.set(0, 0, 0)
}

// 点击小球 - 弹跳动画
function onMouseClick(event) {
  if (!instancedMesh || !renderer) return
  
  // 获取点击位置
  const rect = renderer.domElement.getBoundingClientRect()
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  )
  
  // 射线检测
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  
  // 小球较小，增加检测距离
  const intersects = raycaster.intersectObject(instancedMesh)
  
  if (intersects.length > 0) {
    const instanceId = intersects[0].instanceId
    // 弹跳动画
    animateBounce(instanceId)
  }
}

// 弹跳动画
function animateBounce(instanceId) {
  if (!instancedMesh) return
  
  const dummy = new THREE.Object3D()
  const startY = instancedMesh.getMatrixAt(instanceId).elements[13]
  
  // 简单的弹跳动画
  let startTime = null
  const duration = 400
  
  function bounce(time) {
    if (!startTime) startTime = time
    const elapsed = time - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 弹跳曲线
    const bounceY = startY + Math.sin(progress * Math.PI) * 0.8
    
    instancedMesh.getMatrixAt(instanceId, dummy.matrix)
    dummy.matrix.elements[13] = bounceY
    instancedMesh.setMatrixAt(instanceId, dummy.matrix)
    instancedMesh.instanceMatrix.needsUpdate = true
    
    if (progress < 1) {
      requestAnimationFrame(bounce)
    } else {
      // 恢复原位
      instancedMesh.getMatrixAt(instanceId, dummy.matrix)
      dummy.matrix.elements[13] = startY
      instancedMesh.setMatrixAt(instanceId, dummy.matrix)
      instancedMesh.instanceMatrix.needsUpdate = true
    }
  }
  
  requestAnimationFrame(bounce)
}

// 计算小球位置
function calculatePositions(count, layout, spacing) {
  const positions = []
  
  if (layout === 'cube') {
    // 立方体布局 - 最接近立方体的排列
    const side = Math.ceil(Math.cbrt(count))
    const offset = (side - 1) * spacing / 2
    
    for (let i = 0; i < count; i++) {
      const x = (i % side) * spacing - offset
      const y = (Math.floor(i / side) % side) * spacing - offset
      const z = Math.floor(i / (side * side)) * spacing - offset
      positions.push({ x, y, z, color: 'ones' })
    }
  } else if (layout === 'decimal') {
    // 十进制分组布局 - 按个十百位分组，用不同颜色
    const digits = parseDigits(count)
    
    // 百位 (绿色)
    for (let i = 0; i < digits.hundreds; i++) {
      const row = Math.floor(i / 10)
      const col = i % 10
      positions.push({
        x: col * spacing - 4.5 * spacing,
        y: 2 * spacing - row * spacing,
        z: 0,
        color: 'hundreds'
      })
    }
    
    // 十位 (蓝色)
    for (let i = 0; i < digits.tens; i++) {
      const row = Math.floor(i / 10)
      const col = i % 10
      positions.push({
        x: col * spacing - 4.5 * spacing,
        y: 1 * spacing - row * spacing,
        z: 0,
        color: 'tens'
      })
    }
    
    // 个位 (红色)
    for (let i = 0; i < digits.ones; i++) {
      const row = Math.floor(i / 10)
      const col = i % 10
      positions.push({
        x: col * spacing - 4.5 * spacing,
        y: -row * spacing,
        z: 0,
        color: 'ones'
      })
    }
  } else {
    // 默认网格布局
    const cols = 10
    const rows = Math.ceil(count / cols)
    const offsetX = (cols - 1) * spacing / 2
    const offsetY = (rows - 1) * spacing / 2
    
    for (let i = 0; i < count; i++) {
      const r = Math.floor(i / cols)
      const c = i % cols
      positions.push({
        x: c * spacing - offsetX,
        y: -r * spacing + offsetY,
        z: 0,
        color: 'ones'
      })
    }
  }
  
  return positions
}

// 获取包围盒
function getBounds(positions) {
  if (positions.length === 0) return { width: 0, height: 0, depth: 0 }
  
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  let minZ = Infinity, maxZ = -Infinity
  
  positions.forEach(p => {
    minX = Math.min(minX, p.x)
    maxX = Math.max(maxX, p.x)
    minY = Math.min(minY, p.y)
    maxY = Math.max(maxY, p.y)
    minZ = Math.min(minZ, p.z)
    maxZ = Math.max(maxZ, p.z)
  })
  
  return {
    width: maxX - minX,
    height: maxY - minY,
    depth: maxZ - minZ
  }
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
    renderer.domElement.removeEventListener('click', onMouseClick)
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

// 监听布局切换
watch(layoutType, (newLayout, oldLayout) => {
  if (newLayout !== oldLayout && scene && instancedMesh) {
    isTransitioning.value = true
    // 重新创建小球
    createBalls()
    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }
})
</script>

<template>
  <div class="ball-array">
    <!-- 布局切换按钮 -->
    <div class="layout-controls">
      <button 
        class="layout-btn" 
        :class="{ active: layoutType === 'grid' }"
        @click="layoutType = 'grid'"
      >
        网格
      </button>
      <button 
        class="layout-btn" 
        :class="{ active: layoutType === 'cube' }"
        @click="layoutType = 'cube'"
      >
        立方体
      </button>
      <button 
        class="layout-btn" 
        :class="{ active: layoutType === 'decimal' }"
        @click="layoutType = 'decimal'"
      >
        十进制
      </button>
    </div>
    
    <!-- Three.js 3D 球体展示 -->
    <div class="canvas-container">
      <div ref="canvasRef" class="canvas-wrapper">
        <!-- Three.js canvas 将插入这里 -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.ball-array {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 布局切换按钮 */
.layout-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg-panel, #f5f7fa);
  border-bottom: 1px solid var(--border-light, #e5e7eb);
}

.layout-btn {
  padding: 8px 16px;
  border: none;
  background: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary, #666);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.layout-btn:active {
  transform: scale(0.95);
}

.layout-btn.active {
  background: var(--brand-primary, #0066ff);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}

.canvas-container {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: transparent;
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

/* 小屏幕适配 */
@media (max-width: 380px) {
  .canvas-wrapper {
    width: min(96vw, 400px);
    height: min(75vw, 320px);
  }
  
  .layout-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>