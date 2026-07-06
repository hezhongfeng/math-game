<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Move3D, RotateCcw } from 'lucide-vue-next'

const props = defineProps({
  count: {
    type: Number,
    required: true,
    validator: (v) => v >= 1 && v <= 1000
  },
  size: {
    type: String,
    default: 'normal',
    validator: (v) => ['normal', 'compact'].includes(v)
  }
})

const canvasRef = ref(null)
const isLoading = ref(true)
const touchDevice = ref(false)
const isRotationEnabled = ref(false)
const renderError = ref(false)
const isSceneReady = ref(false)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const showRotationControls = computed(() => (
  touchDevice.value && isSceneReady.value && props.size === 'normal' && props.count >= 100
))
const ariaLabel = computed(() => {
  const hundreds = Math.floor(props.count / 100)
  const tens = Math.floor((props.count % 100) / 10)
  const ones = props.count % 10
  const parts = []

  if (hundreds) parts.push(`${hundreds} 个百`)
  if (tens) parts.push(`${tens} 个十`)
  if (ones || !parts.length) parts.push(`${ones} 个一`)

  return `${props.count} 颗小球，按十进制排列为${parts.join('、')}`
})

let scene = null
let camera = null
let renderer = null
let controls = null
let instancedMesh = null
let animationId = null
let introStartTime = 0
let resizeObserver = null
let orbitDomElement = null
let controlsChangeHandler = null
let THREE = null
let animationDummy = null

function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
}

const colors = {
  ballLow: 0x8FD0FF,
  ballMid: 0x78AEFF,
  ballHigh: 0x5B8FF2,
  ballPeak: 0x527FE2
}

function getBallPalette(count) {
  if (count <= 19) {
    return {
      color: colors.ballLow
    }
  }

  if (count <= 99) {
    return {
      color: colors.ballMid
    }
  }

  if (count <= 300) {
    return {
      color: colors.ballHigh
    }
  }

  return {
    color: colors.ballPeak
  }
}

function getGroupedBallColor(count, index) {
  const palette = getBallPalette(count)
  const color = new THREE.Color(palette.color)

  if (count < 20) {
    const lightnessBoost = (index % 5) * 0.018
    color.offsetHSL(0, 0, lightnessBoost)
    return color
  }

  if (count < 100) {
    const tenGroup = Math.floor(index / 10)
    const hueShift = (tenGroup % 2 === 0 ? -1 : 1) * 0.012
    const lightnessShift = (tenGroup % 2 === 0 ? 1 : -1) * 0.025
    color.offsetHSL(hueShift, 0.015, lightnessShift)
    return color
  }

  const hundredGroup = Math.floor(index / 100)
  const tenGroup = Math.floor((index % 100) / 10)
  const alternateHundred = hundredGroup % 2 === 1
  const hueShift = alternateHundred ? 0.022 : -0.012
  const saturationShift = alternateHundred ? -0.012 : 0.012
  const hundredLightnessShift = alternateHundred ? 0.045 : -0.018
  const tenLightnessShift = tenGroup % 2 === 0 ? 0.008 : -0.008
  const lightnessShift = hundredLightnessShift + tenLightnessShift
  color.offsetHSL(hueShift, saturationShift, lightnessShift)

  return color
}

async function loadThree() {
  if (THREE) return

  const threeModule = await import('three')
  THREE = threeModule
}

function cleanupControls() {
  if (orbitDomElement) {
    orbitDomElement.style.touchAction = ''
  }

  if (controls && controlsChangeHandler) {
    controls.removeEventListener('change', controlsChangeHandler)
  }

  controlsChangeHandler = null
  orbitDomElement = null

  if (controls) {
    controls.dispose()
    controls = null
  }
}

function updateControlsInteraction() {
  if (!controls || !orbitDomElement || !THREE) return

  if (!touchDevice.value) {
    controls.enabled = true
    controls.enableRotate = true
    controls.enableZoom = true
    controls.enablePan = true
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY
    }
    orbitDomElement.style.touchAction = 'none'
    return
  }

  const enabled = showRotationControls.value && isRotationEnabled.value
  controls.enabled = enabled
  controls.enableRotate = enabled
  controls.enableZoom = false
  controls.enablePan = false
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.NONE
  }
  orbitDomElement.style.touchAction = enabled ? 'none' : 'pan-y'
}

async function loadOrbitControls() {
  if (controls) return
  await loadThree()
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')

  orbitDomElement = renderer.domElement

  controls = new OrbitControls(camera, orbitDomElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 3
  controls.maxDistance = 25
  controls.autoRotate = false

  controlsChangeHandler = () => { scheduleRender() }
  controls.addEventListener('change', controlsChangeHandler)
  controls.autoRotateSpeed = 0.7
  controls.rotateSpeed = 0.6
  controls.zoomSpeed = 0.8
  updateControlsInteraction()
}

function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
}

async function initScene() {
  if (!canvasRef.value) return

  renderError.value = false
  isSceneReady.value = false

  try {
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

    const ambientLight = new THREE.HemisphereLight(0xF8FBFF, 0xDCEBFF, 1.22)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.06)
    keyLight.position.set(6, 8, 11)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xA8D7FF, 0.62)
    rimLight.position.set(-7, 5, 8)
    scene.add(rimLight)

    const bounceLight = new THREE.PointLight(0xCBE6FF, 0.6, 32, 2)
    bounceLight.position.set(0, -4, 7)
    scene.add(bounceLight)

    await loadOrbitControls()
    isSceneReady.value = true
    await nextTick()
    syncRendererSize()
    updateControlsInteraction()
    createBalls()
    animate()
    isLoading.value = false
  } catch (error) {
    console.error('初始化 3D 小球失败:', error)
    cleanupControls()
    cleanup()
    renderError.value = true
    isLoading.value = false
  }
}

function getLayoutConfig(count) {
  if (count >= 1000) {
    return { radius: 0.16, spacing: 0.4, layerGap: 0.64 }
  }

  if (count >= 500) {
    return { radius: 0.17, spacing: 0.42, layerGap: 0.68 }
  }

  if (count >= 100) {
    return { radius: 0.19, spacing: 0.46, layerGap: 0.72 }
  }

  if (count >= 50) {
    return { radius: 0.22, spacing: 0.56, layerGap: 0.72 }
  }

  return { radius: 0.26, spacing: 0.68, layerGap: 0.82 }
}

function createBallMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.52,
    metalness: 0.02
  })
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
  animationDummy = dummy

  for (let i = 0; i < count; i++) {
    const pos = positions[i]
    const ballColor = getGroupedBallColor(count, i)
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
  const hasDepth = bounds.depth > 0
  const depthWidth = hasDepth ? bounds.depth * 0.45 : 0
  const depthHeight = hasDepth ? bounds.depth * 0.16 : 0

  const distV = ((bounds.height + depthHeight + padding) / 2) / Math.tan(vFovHalf)
  const distH = ((bounds.width + depthWidth + padding) / 2) / Math.tan(vFovHalf) / aspect

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

  const cameraYaw = props.count >= 500 ? Math.PI / 7 : hasDepth ? Math.PI / 10 : 0
  const cameraX = center.x + Math.sin(cameraYaw) * distance
  const cameraZ = center.z + Math.cos(cameraYaw) * distance

  camera.position.set(cameraX, center.y + heightBoost, cameraZ)
  camera.lookAt(center.x, lookTargetY, center.z)

  if (controls) {
    controls.target.set(center.x, lookTargetY, center.z)
    controls.update()
  }
}

function calculatePositions(count, layoutConfig) {
  const positions = []
  const spacing = layoutConfig.spacing
  const rowSpacing = count > 10 ? spacing * 1.12 : spacing
  const layerGap = layoutConfig.layerGap
  const centeredOffset = 4.5

  for (let index = 0; index < count; index++) {
    const ones = index % 10
    const tens = Math.floor(index / 10) % 10
    const hundreds = Math.floor(index / 100)

    positions.push({
      x: (ones - centeredOffset) * spacing,
      y: (centeredOffset - tens) * rowSpacing,
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

function scheduleRender() {
  if (!animationId && renderer && scene && camera) {
    animationId = requestAnimationFrame(renderOnce)
  }
}

function renderOnce() {
  animationId = null
  if (renderer && scene && camera) {
    controls?.update()
    renderer.render(scene, camera)
  }
}

function animate(time) {
  animationId = requestAnimationFrame(animate)

  if (renderer && scene && camera) {
    controls?.update()

    if (instancedMesh && instancedMesh.userData.animating) {
      const positions = instancedMesh.userData.positions
      const count = positions.length

      if (prefersReducedMotion) {
        for (let i = 0; i < count; i++) {
          const pos = positions[i]
          animationDummy.position.set(pos.x, pos.y, pos.z)
          animationDummy.scale.set(1, 1, 1)
          animationDummy.updateMatrix()
          instancedMesh.setMatrixAt(i, animationDummy.matrix)
        }
        instancedMesh.instanceMatrix.needsUpdate = true
        instancedMesh.userData.animating = false
        if (animationId) {
          cancelAnimationFrame(animationId)
          animationId = null
        }
        renderer.render(scene, camera)
        return
      }

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
        // Stop the rAF loop — render on demand from here on
        if (animationId) {
          cancelAnimationFrame(animationId)
          animationId = null
        }
        // Do one final render so the last frame is displayed
        renderer.render(scene, camera)
        return
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

  scene = null
  camera = null
  animationDummy = null
  isSceneReady.value = false
}

function syncRendererSize() {
  if (!canvasRef.value || !renderer || !camera) return false

  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight

  if (!width || !height) return false

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  return true
}

function handleResize() {
  if (!syncRendererSize()) return
  scheduleRender()
}

function toggleRotation() {
  isRotationEnabled.value = !isRotationEnabled.value
  updateControlsInteraction()
  scheduleRender()
}

function resetCameraView() {
  const positions = instancedMesh?.userData.positions
  if (!positions?.length) return

  fitCameraToBounds(getBounds(positions))
  scheduleRender()
}

onMounted(() => {
  touchDevice.value = isTouchDevice()
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
  isRotationEnabled.value = false
  if (renderError.value) return
  await nextTick()
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  syncRendererSize()
  createBalls()
  updateControlsInteraction()
  animate(performance.now())
})
</script>

<template>
  <div
    class="ball-array"
    :class="{
      'ball-array--compact': size === 'compact',
      'ball-array--has-controls': showRotationControls
    }"
  >
    <div v-if="isLoading" class="loading-indicator" aria-hidden="true">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <div
      v-if="renderError"
      class="render-fallback"
      role="img"
      :aria-label="ariaLabel"
      data-testid="ball-render-fallback"
    >
      <strong>暂时无法显示 3D 小球</strong>
      <span>请刷新页面后再试。</span>
    </div>
    <div v-else ref="canvasRef" class="canvas-wrapper" role="img" :aria-label="ariaLabel"></div>

    <div v-if="showRotationControls" class="view-controls" aria-label="3D 视角控制">
      <button
        class="view-control-btn view-control-btn--toggle"
        :class="{ 'is-active': isRotationEnabled }"
        type="button"
        data-testid="rotation-toggle"
        :aria-label="isRotationEnabled ? '结束旋转并恢复页面滚动' : '启用小球旋转查看'"
        :aria-pressed="isRotationEnabled"
        @click="toggleRotation"
      >
        <Move3D :size="18" aria-hidden="true" />
        <span>{{ isRotationEnabled ? '完成' : '旋转查看' }}</span>
      </button>
      <button
        v-if="isRotationEnabled"
        class="view-control-btn view-control-btn--icon"
        type="button"
        data-testid="rotation-reset"
        aria-label="重置小球视角"
        @click="resetCameraView"
      >
        <RotateCcw :size="18" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.ball-array {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 236px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #f4f8ff;
  border: 1px solid rgba(146, 186, 236, 0.32);
  box-shadow: 0 12px 28px rgba(72, 116, 188, 0.1);
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 236px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: transparent;
}

.canvas-wrapper canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.render-fallback {
  width: 100%;
  height: 100%;
  min-height: inherit;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--text-blue-light);
  text-align: center;
}

.render-fallback strong {
  color: var(--text-blue-dark);
  font-size: 15px;
}

.render-fallback span {
  font-size: 13px;
}

.ball-array--has-controls .canvas-wrapper {
  height: calc(100% - 56px);
  min-height: 0;
}

.view-controls {
  position: absolute;
  right: 8px;
  bottom: 6px;
  z-index: 2;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.view-control-btn {
  min-height: 44px;
  border: 1px solid rgba(92, 157, 255, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.94);
  color: var(--text-blue-dark);
  box-shadow: 0 6px 16px rgba(72, 116, 188, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 800;
  touch-action: manipulation;
  transition: background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}

.view-control-btn--toggle {
  padding: 0 13px;
}

.view-control-btn--icon {
  width: 44px;
  padding: 0;
}

.view-control-btn.is-active {
  border-color: rgba(74, 144, 226, 0.28);
  background: var(--brand-primary);
  color: #fff;
}

.ball-array--compact,
.ball-array--compact .canvas-wrapper {
  min-height: 138px;
  border-radius: var(--radius-md);
}

.loading-indicator {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 1;
  pointer-events: none;
}

.loading-indicator .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(91, 143, 242, 0.6);
  animation: dot-pulse 1.2s ease-in-out infinite;
}

.loading-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-indicator .dot {
    animation: none;
    transform: scale(1);
    opacity: 0.6;
  }
}

@media (max-width: 420px) {
  .ball-array,
  .canvas-wrapper {
    min-height: 212px;
    border-radius: var(--radius-md);
  }

  .ball-array--compact,
  .ball-array--compact .canvas-wrapper {
    min-height: 124px;
  }
}

@media (max-width: 959px) and (max-height: 860px) {
  .ball-array,
  .canvas-wrapper {
    min-height: 196px;
  }
}
</style>
