<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    required: true,
    validator: (v) => v >= 1 && v <= 1000
  }
})

const canvasRef = ref(null)

let scene = null
let camera = null
let renderer = null
let controls = null
let instancedMesh = null
let panelMesh = null
let animationId = null
let introStartTime = 0
let resizeObserver = null
let orbitDomElement = null
let orbitTouchStartHandler = null
let THREE = null
let animationDummy = null

function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
}

const colors = {
  ball: 0x5C9DFF, // 匹配项目主题色 --brand-primary (#5C9DFF)
  panel: 0xF7FAFF  // 匹配项目背景色 --bg-light (#F7FAFF)
}

async function loadThree() {
  if (THREE) return

  const threeModule = await import('three')
  THREE = threeModule
}

function cleanupControls() {
  if (orbitDomElement && orbitTouchStartHandler) {
    orbitDomElement.removeEventListener('touchstart', orbitTouchStartHandler)
  }

  if (orbitDomElement) {
    orbitDomElement.style.touchAction = ''
  }

  orbitTouchStartHandler = null
  orbitDomElement = null

  if (controls) {
    controls.dispose()
    controls = null
  }
}

async function loadOrbitControls() {
  if (controls) return
  await loadThree()
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')
  const touchDevice = isTouchDevice()

  orbitDomElement = renderer.domElement

  controls = new OrbitControls(camera, orbitDomElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enableZoom = !touchDevice
  controls.minDistance = 3
  controls.maxDistance = 25
  controls.enablePan = !touchDevice
  controls.enableRotate = !touchDevice
  controls.autoRotate = touchDevice
  controls.autoRotateSpeed = 0.7
  controls.rotateSpeed = 0.6
  controls.zoomSpeed = 0.8
  if (!touchDevice) {
    orbitTouchStartHandler = (e) => {
      if (e.touches.length > 1) e.preventDefault()
    }
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY
    }
    orbitDomElement.addEventListener('touchstart', orbitTouchStartHandler, { passive: false })
    orbitDomElement.style.touchAction = 'none'
    return
  }

  orbitDomElement.style.touchAction = 'pan-y'
}

function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
}

async function initScene() {
  if (!canvasRef.value) return

  await loadThree()
  await nextTick()

  const container = canvasRef.value
  if (!container) return

  const width = container.clientWidth || 320
  const height = container.clientHeight || 320

  cleanup()
  cleanupControls()

  scene = new THREE.Scene()
  scene.background = null
  // 使用项目风格的雾效 - 冷色调蓝色雾
  scene.fog = new THREE.Fog(0xF7FAFF, 20, 34)

  camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 200)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = false
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping

  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
  container.appendChild(renderer.domElement)

  // 使用冷色调光照，匹配项目科技风格
  const ambientLight = new THREE.HemisphereLight(0xF7FAFF, 0xEBF2FF, 1.5)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 0.85)
  keyLight.position.set(4.5, 8, 10)
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0xDCE7F5, 0.45)
  fillLight.position.set(-6, 2, 6)
  scene.add(fillLight)

  await loadOrbitControls()
  createBalls()
  animate()
}

function getLayoutConfig(count) {
  if (count >= 1000) {
    return { radius: 0.16, spacing: 0.4, layerGap: 0.52 }
  }

  if (count >= 500) {
    return { radius: 0.17, spacing: 0.42, layerGap: 0.56 }
  }

  if (count >= 100) {
    return { radius: 0.19, spacing: 0.46, layerGap: 0.62 }
  }

  if (count >= 50) {
    return { radius: 0.22, spacing: 0.56, layerGap: 0.72 }
  }

  return { radius: 0.26, spacing: 0.68, layerGap: 0.82 }
}

function createBallMaterial() {
  // 使用 MeshPhongMaterial 获得更好的光泽效果，匹配项目简约科技风格
  return new THREE.MeshPhongMaterial({
    color: colors.ball,
    specular: 0xFFFFFF,
    shininess: 30,
    flatShading: false
  })
}

function updateBackgroundPanel(bounds) {
  if (!scene || !THREE) return

  if (panelMesh) {
    scene.remove(panelMesh)
    panelMesh.geometry?.dispose()
    panelMesh.material?.dispose()
    panelMesh = null
  }

  const panelWidth = Math.max(bounds.width + 1.6, 4.8)
  const panelHeight = Math.max(bounds.height + 1.6, 4.8)
  const geometry = new THREE.PlaneGeometry(panelWidth, panelHeight)
  // 使用柔和的蓝色背景面板，匹配项目风格
  const material = new THREE.MeshBasicMaterial({
    color: 0xEBF2FF, // 匹配 --bg-dark
    transparent: true,
    opacity: 0.15
  })

  panelMesh = new THREE.Mesh(geometry, material)
  panelMesh.position.set(bounds.center.x, bounds.center.y, bounds.center.z - (bounds.depth / 2 + 1.2))
  scene.add(panelMesh)
}

function createBalls() {
  if (!scene || !camera || !THREE) return

  if (instancedMesh) {
    scene.remove(instancedMesh)
    instancedMesh.geometry?.dispose()
    instancedMesh.material?.dispose()
    instancedMesh = null
  }

  const count = props.count
  const layoutConfig = getLayoutConfig(count)
  const positions = calculatePositions(count, layoutConfig)
  const bounds = getBounds(positions)
  const sphereGeometry = new THREE.SphereGeometry(layoutConfig.radius, 24, 24)

  instancedMesh = new THREE.InstancedMesh(sphereGeometry, createBallMaterial(), count)
  instancedMesh.castShadow = false
  instancedMesh.receiveShadow = false

  const dummy = new THREE.Object3D()
  const ballColor = new THREE.Color(colors.ball)
  animationDummy = dummy

  for (let i = 0; i < count; i++) {
    const pos = positions[i]
    dummy.position.set(pos.x, pos.y, pos.z)
    dummy.scale.set(0, 0, 0)
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)
    instancedMesh.setColorAt(i, ballColor)
  }

  instancedMesh.instanceMatrix.needsUpdate = true
  if (instancedMesh.instanceColor) {
    instancedMesh.instanceColor.needsUpdate = true
  }
  
  instancedMesh.userData = {
    positions: positions,
    animating: true
  }

  updateBackgroundPanel(bounds)
  scene.add(instancedMesh)
  fitCameraToBounds(bounds)
  
  introStartTime = performance.now()
}

function fitCameraToBounds(bounds) {
  const center = bounds.center
  const layoutConfig = getLayoutConfig(props.count)
  const padding = layoutConfig.radius * 2.5 + 0.8

  const fovRad = camera.fov * (Math.PI / 180)
  const vFovHalf = fovRad / 2
  const aspect = camera.aspect || 1

  const distV = ((bounds.height + padding) / 2) / Math.tan(vFovHalf)
  const distH = ((bounds.width + padding) / 2) / Math.tan(vFovHalf) / aspect

  let baseDistance = Math.max(distV, distH) * 1.1 + (bounds.depth / 2)
  let distance = Math.max(baseDistance, 4.5)

  let heightBoost = Math.max(bounds.height * 0.08, 0.84)
  let lookTargetY = center.y

  if (props.count >= 100) {
    heightBoost = Math.max(bounds.height * 0.1, 1)
  }

  if (props.count >= 500) {
    heightBoost = Math.max(bounds.height * 0.12, 1.24)
    lookTargetY = center.y + bounds.height * 0.02
  }

  if (props.count >= 1000) {
    heightBoost = Math.max(bounds.height * 0.14, 1.42)
    lookTargetY = center.y + bounds.height * 0.04
  }

  camera.position.set(center.x, center.y + heightBoost, center.z + distance)
  camera.lookAt(center.x, lookTargetY, center.z)

  if (controls) {
    controls.target.set(center.x, lookTargetY, center.z)
    controls.update()
  }
}

function calculatePositions(count, layoutConfig) {
  const positions = []
  const spacing = layoutConfig.spacing
  const layerGap = layoutConfig.layerGap
  const centeredOffset = 4.5

  for (let index = 0; index < count; index++) {
    const ones = index % 10
    const tens = Math.floor(index / 10) % 10
    const hundreds = Math.floor(index / 100)

    positions.push({
      x: (ones - centeredOffset) * spacing,
      y: (centeredOffset - tens) * spacing,
      z: (hundreds - (Math.max(Math.ceil(count / 100), 1) - 1) / 2) * layerGap
    })
  }

  return positions
}

function getBounds(positions) {
  if (positions.length === 0) {
    return {
      width: 0,
      height: 0,
      depth: 0,
      center: { x: 0, y: 0, z: 0 }
    }
  }

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity

  positions.forEach((p) => {
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
    depth: maxZ - minZ,
    center: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: (minZ + maxZ) / 2
    }
  }
}

function animate(time) {
  animationId = requestAnimationFrame(animate)

  if (renderer && scene && camera) {
    controls?.update()
    
    if (instancedMesh && instancedMesh.userData.animating) {
      const positions = instancedMesh.userData.positions
      const count = positions.length
      let allDone = true
      const elapsed = time - introStartTime

      for (let i = 0; i < count; i++) {
        const delay = (count - i) * 1.5
        const ballElapsed = Math.max(0, elapsed - delay)
        const duration = 650
        
        let progress = ballElapsed / duration
        if (progress < 1) {
          allDone = false
        } else {
          progress = 1
        }
        
        const easeOutElastic = (t) => {
          const c4 = (2 * Math.PI) / 3
          return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
        }

        const scale = easeOutElastic(progress)

        const pos = positions[i]
        animationDummy.position.set(pos.x, pos.y, pos.z)
        animationDummy.scale.set(scale, scale, scale)
        animationDummy.updateMatrix()
        instancedMesh.setMatrixAt(i, animationDummy.matrix)
      }
      
      instancedMesh.instanceMatrix.needsUpdate = true
      if (allDone) {
        instancedMesh.userData.animating = false
      }
    }

    renderer.render(scene, camera)
  }
}

function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  if (renderer) {
    renderer.dispose()
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
    renderer = null
  }

  if (instancedMesh) {
    instancedMesh.geometry?.dispose()
    instancedMesh.material?.dispose()
    instancedMesh = null
  }

  if (panelMesh) {
    panelMesh.geometry?.dispose()
    panelMesh.material?.dispose()
    panelMesh = null
  }

  scene = null
  camera = null
  animationDummy = null
}

function handleResize() {
  if (!canvasRef.value || !renderer || !camera) return

  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight

  if (!width || !height) return

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

onMounted(() => {
  nextTick(() => {
    initScene()
    window.addEventListener('resize', handleResize)

    if (window.ResizeObserver && canvasRef.value) {
      resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      resizeObserver.observe(canvasRef.value)
    }
  })
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('resize', handleResize)
  resizeObserver?.disconnect()
})

watch(() => props.count, async () => {
  await nextTick()
  createBalls()
})
</script>

<template>
  <div class="ball-array">
    <div ref="canvasRef" class="canvas-wrapper"></div>
  </div>
</template>

<style scoped>
.ball-array {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 236px;
  border-radius: 28px;
  overflow: hidden;
  /* 使用项目风格的渐变背景 */
  background: linear-gradient(180deg, var(--bg-light) 0%, var(--bg-dark) 100%);
  border: 1px solid var(--border-light);
}

.ball-array::before {
  content: '';
  position: absolute;
  inset: 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.42);
  pointer-events: none;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 236px;
  border-radius: 28px;
  overflow: hidden;
  background: transparent;
}

.canvas-wrapper canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 420px) {
  .ball-array,
  .canvas-wrapper {
    min-height: 212px;
    border-radius: 24px;
  }

  .ball-array::before {
    inset: 10px;
    border-radius: 18px;
  }
}

@media (max-width: 959px) and (max-height: 860px) {
  .ball-array,
  .canvas-wrapper {
    min-height: 196px;
  }
}
</style>
