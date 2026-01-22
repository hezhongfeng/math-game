<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'

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

// 粒子配置
const particleConfigs = {
  correct: {
    colors: ['#4CAF50', '#66BB6A', '#81C784', '#FFD700', '#FFEB3B', '#00E676', '#00C853'],
    count: 80,
    velocity: { min: 100, max: 250 },
    size: { min: 4, max: 12 },
    gravity: -0.5,
    duration: 1.2
  },
  wrong: {
    colors: ['#FF9800', '#FF5722', '#FF7043', '#FFB74D', '#FFD54F', '#EF5350'],
    count: 50,
    velocity: { min: 80, max: 180 },
    size: { min: 5, max: 14 },
    gravity: 1.5,
    duration: 1.0
  }
}

function createParticles() {
  const config = particleConfigs[props.type]
  const isCorrect = props.type === 'correct'

  const newParticles = []

  // 主爆炸粒子
  for (let i = 0; i < config.count; i++) {
    const angle = Math.random() * Math.PI * 2
    const velocity = config.velocity.min + Math.random() * (config.velocity.max - config.velocity.min)
    const size = config.size.min + Math.random() * (config.size.max - config.size.min)

    // 随机延迟，让粒子不是同时发射
    const delay = Math.random() * 0.15

    newParticles.push({
      id: particleId++,
      type: 'circle',
      x: 0,
      y: 0,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - (isCorrect ? 50 : -30), // 正确向上，错误向下
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      size: size,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 20,
      opacity: 1,
      delay: delay,
      duration: config.duration
    })
  }

  // 添加星星粒子（仅正确反馈）
  if (isCorrect) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12
      const velocity = 150 + Math.random() * 100

      newParticles.push({
        id: particleId++,
        type: 'star',
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 80,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size: 8 + Math.random() * 8,
        rotation: 0,
        rotationSpeed: 5,
        opacity: 1,
        delay: Math.random() * 0.1,
        duration: 1.5
      })
    }
  }

  // 添加光环效果（仅正确反馈）
  if (isCorrect) {
    newParticles.push({
      id: particleId++,
      type: 'ring',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      color: '#4CAF50',
      size: 20,
      opacity: 0.8,
      delay: 0,
      duration: 0.8
    })
  }

  particles.value = newParticles
  animateParticles()
}

function animateParticles() {
  if (!props.show && particles.value.length === 0) {
    return
  }

  if (!props.show) {
    // 快速淡出
    particles.value = particles.value.filter(p => {
      p.opacity -= 0.1
      return p.opacity > 0
    })
  } else {
    particles.value = particles.value.map(p => {
      const progress = Math.max(0, 1 - p.opacity)
      const easedProgress = 1 - Math.pow(1 - progress, 3) // ease-out

      // 根据进度计算位置
      const currentVx = p.vx * (1 - easedProgress)
      const currentVy = p.vy * (1 - easedProgress) + (particleConfigs[props.type].gravity * easedProgress * 100)

      return {
        ...p,
        x: p.x + currentVx * 0.016,
        y: p.y + currentVy * 0.016,
        opacity: 1 - easedProgress,
        rotation: p.rotation + (p.rotationSpeed || 0),
        scale: 1 - easedProgress * 0.3
      }
    }).filter(p => p.opacity > 0)
  }

  if (particles.value.length > 0) {
    animationFrame = requestAnimationFrame(animateParticles)
  } else {
    particles.value = []
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

watch(() => props.show, (newVal) => {
  if (newVal) {
    createParticles()
  } else if (!newVal) {
    // 停止动画，快速清理
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
    particles.value = []
  }
})
</script>

<template>
  <div class="particle-wrapper">
    <!-- 中心发光效果 -->
    <div v-if="type === 'correct'" class="center-glow"></div>
    
    <!-- 粒子容器 -->
    <div class="particle-container">
      <div
        v-for="p in particles"
        :key="p.id"
        class="particle"
        :class="[p.type, { 'star-particle': p.type === 'star', 'ring-particle': p.type === 'ring' }]"
        :style="{
          '--x': `${p.x}px`,
          '--y': `${p.y}px`,
          '--color': p.color,
          '--size': `${p.size}px`,
          '--rotation': `${p.rotation}deg`,
          '--opacity': p.opacity,
          '--scale': p.scale
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.particle-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* 中心发光效果 - 仅正确反馈 */
.center-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0) 70%);
  animation: centerGlow 1.5s ease-out forwards;
}

@keyframes centerGlow {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  30% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.particle-container {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  box-shadow: 
    0 0 8px var(--color),
    0 0 16px var(--color, 0.5),
    0 0 24px var(--color, 0.3);
}

/* 星星粒子 */
.star-particle {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  background: var(--color);
  filter: drop-shadow(0 0 4px var(--color));
}

/* 环形粒子 */
.ring-particle {
  width: calc(var(--size) * 12);
  height: calc(var(--size) * 12);
  border: 4px solid var(--color);
  background: transparent;
  border-radius: 50%;
  box-shadow: none;
  animation: ringExpand 0.8s ease-out forwards;
}

@keyframes ringExpand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* 粒子出现动画 */
.particle {
  animation: particleAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

@keyframes particleAppear {
  0% {
    transform: translate(-50%, -50%) translate(var(--x), var(--y)) rotate(var(--rotation)) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) translate(calc(var(--x) * 0.3), calc(var(--y) * 0.3)) rotate(calc(var(--rotation) * 0.3)) scale(1.3);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--x), var(--y)) rotate(var(--rotation)) scale(1);
    opacity: var(--opacity);
  }
}
</style>
