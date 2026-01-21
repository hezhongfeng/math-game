<script setup>
import { onMounted, ref, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'correct' // 'correct' or 'wrong'
  }
})

const particles = ref([])
let animationFrame = null
let particleId = 0

function createParticles() {
  const colors = props.type === 'correct' 
    ? ['#4CAF50', '#8BC34A', '#CDDC39', '#FFD700', '#FFEB3B']
    : ['#FF9800', '#FF5722', '#FFEB3B', '#FFC107']

  const newParticles = []
  for (let i = 0; i < 30; i++) {
    const angle = (Math.PI * 2 * i) / 30 + Math.random() * 0.5
    const velocity = 80 + Math.random() * 120
    newParticles.push({
      id: particleId++,
      x: 0,
      y: 0,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
      scale: 1,
      opacity: 1
    })
  }
  particles.value = newParticles
  animateParticles()
}

function animateParticles() {
  if (!props.show) {
    particles.value = []
    return
  }

  particles.value = particles.value.map(p => ({
    ...p,
    x: p.x + p.vx * 0.05,
    y: p.y + p.vy * 0.05,
    vy: p.vy + 2, // 重力
    opacity: p.opacity - 0.02,
    scale: p.scale * 0.98,
    rotation: p.rotation + 10
  })).filter(p => p.opacity > 0)

  if (particles.value.length > 0) {
    animationFrame = requestAnimationFrame(animateParticles)
  }
}

onMounted(() => {
  if (props.show) {
    createParticles()
  }
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

// 监听 show 属性变化
import { watch } from 'vue'
watch(() => props.show, (newVal) => {
  if (newVal) {
    createParticles()
  } else if (!newVal) {
    particles.value = []
  }
})
</script>

<template>
  <div class="particle-container">
    <div
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        '--x': `${p.x}px`,
        '--y': `${p.y}px`,
        '--color': p.color,
        '--size': `${p.size}px`,
        '--rotation': `${p.rotation}deg`,
        '--opacity': p.opacity
      }"
    />
  </div>
</template>

<style scoped>
.particle-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
  overflow: visible;
}

.particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  transform: translate(-50%, -50%) translate(var(--x), var(--y)) rotate(var(--rotation)) scale(var(--scale));
  opacity: var(--opacity);
  box-shadow: 0 0 10px var(--color);
  animation: particleBurst 0.8s ease-out forwards;
}

@keyframes particleBurst {
  0% {
    transform: translate(-50%, -50%) translate(0, 0) rotate(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--x), var(--y)) rotate(var(--rotation)) scale(0);
    opacity: 0;
  }
}
</style>
