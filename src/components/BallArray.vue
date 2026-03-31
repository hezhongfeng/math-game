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
let instancedMesh = null
let panelMesh = null
let animationId = null
let resizeObserver = null
let THREE = null

const colors = {
  ball: 0xeb5757,
  panel: 0xffffff
}

async function loadThree() {
  if (THREE) return

  const threeModule = await import('three')
  THREE = threeModule
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

  scene = new THREE.Scene()
  scene.background = null
  scene.fog = new THREE.Fog(0xfffaf2, 20, 34)

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

  const ambientLight = new THREE.HemisphereLight(0xfffdf8, 0xf3e4d0, 1.75)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.95)
  keyLight.position.set(4.5, 8, 10)
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0xfff2df, 0.42)
  fillLight.position.set(-6, 2, 6)
  scene.add(fillLight)

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
  return new THREE.MeshLambertMaterial({
    color: colors.ball
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
  const material = new THREE.MeshBasicMaterial({
    color: colors.panel,
    transparent: true,
    opacity: 0.18
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

  for (let i = 0; i < count; i++) {
    const pos = positions[i]
    dummy.position.set(pos.x, pos.y, pos.z)
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)
    instancedMesh.setColorAt(i, ballColor)
  }

  instancedMesh.instanceMatrix.needsUpdate = true
  if (instancedMesh.instanceColor) {
    instancedMesh.instanceColor.needsUpdate = true
  }

  updateBackgroundPanel(bounds)
  scene.add(instancedMesh)
  fitCameraToBounds(bounds)
}

function fitCameraToBounds(bounds) {
  const center = bounds.center
  const maxSpan = Math.max(bounds.width * 1.05, bounds.height * 1.04, bounds.depth * 1.22, 4)

  let distance = maxSpan * 1.04 + 3.6
  let heightBoost = Math.max(bounds.height * 0.08, 0.84)
  let lookTargetY = center.y

  if (props.count >= 100) {
    distance = maxSpan * 1.08 + 4.1
    heightBoost = Math.max(bounds.height * 0.1, 1)
  }

  if (props.count >= 500) {
    distance = maxSpan * 1.12 + 4.6
    heightBoost = Math.max(bounds.height * 0.12, 1.24)
    lookTargetY = center.y + bounds.height * 0.02
  }

  if (props.count >= 1000) {
    distance = maxSpan * 1.14 + 5
    heightBoost = Math.max(bounds.height * 0.14, 1.42)
    lookTargetY = center.y + bounds.height * 0.04
  }

  camera.position.set(center.x, center.y + heightBoost, center.z + distance)
  camera.lookAt(center.x, lookTargetY, center.z)
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

function animate() {
  animationId = requestAnimationFrame(animate)

  if (renderer && scene && camera) {
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
  await initScene()
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
  background: linear-gradient(180deg, #fffdfb 0%, #fff9f1 100%);
  border: 1px solid rgba(214, 182, 140, 0.16);
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
