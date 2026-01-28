<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, Play, Star } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { DIFFICULTY_GROUPS } from '../config/difficulty'

const router = useRouter()
const { getAllBestScores } = useStorage()
const { playSound, forceInitializeAudioContext } = useSound()

const bestScores = getAllBestScores()
const completedCount = Object.keys(bestScores).length

// 水母数据 - 从屏幕各个位置随机升起
const jellyfishes = [
  // 从左侧不同高度
  { color: '#FF6B6B', delay: 0, left: '8%', startTop: '85%', size: 52 },
  { color: '#4ECDC4', delay: 0.3, left: '5%', startTop: '70%', size: 44 },
  { color: '#FFE66D', delay: 0.6, left: '12%', startTop: '55%', size: 48 },
  { color: '#AA96DA', delay: 0.9, left: '3%', startTop: '40%', size: 42 },
  { color: '#FCBAD3', delay: 1.2, left: '15%', startTop: '25%', size: 46 },
  // 从中间偏左
  { color: '#A8D8EA', delay: 1.5, left: '25%', startTop: '90%', size: 50 },
  { color: '#FF9F43', delay: 1.8, left: '22%', startTop: '75%', size: 44 },
  { color: '#6AB04C', delay: 2.1, left: '28%', startTop: '60%', size: 48 },
  { color: '#B5838D', delay: 2.4, left: '18%', startTop: '45%', size: 42 },
  { color: '#E8A87C', delay: 0.2, left: '32%', startTop: '35%', size: 46 },
  // 从中间
  { color: '#41B3A3', delay: 0.5, left: '45%', startTop: '95%', size: 54 },
  { color: '#D65076', delay: 0.8, left: '42%', startTop: '80%', size: 48 },
  { color: '#45B7D1', delay: 1.1, left: '48%', startTop: '65%', size: 44 },
  { color: '#96CEB4', delay: 1.4, left: '52%', startTop: '50%', size: 50 },
  { color: '#FFEAA7', delay: 1.7, left: '38%', startTop: '35%', size: 42 },
  // 从右侧
  { color: '#DFE6E9', delay: 2, left: '62%', startTop: '88%', size: 46 },
  { color: '#81ECEC', delay: 2.3, left: '68%', startTop: '72%', size: 50 },
  { color: '#74B9FF', delay: 0.1, left: '75%', startTop: '58%', size: 44 },
  { color: '#A29BFE', delay: 0.4, left: '82%', startTop: '42%', size: 48 },
  { color: '#FD79A8', delay: 0.7, left: '88%', startTop: '28%', size: 52 },
  { color: '#00B894', delay: 1, left: '92%', startTop: '82%', size: 46 },
  { color: '#E17055', delay: 1.3, left: '78%', startTop: '48%', size: 42 },
  { color: '#FDCB6E', delay: 1.6, left: '95%', startTop: '15%', size: 48 },
]

function startGame() {
  playSound('click')
  router.push('/difficulty')
}

function viewAchievements() {
  playSound('click')
  router.push('/difficulty')
}

// 计算水母样式，减少模板中的重复计算
function jellyStyle(jelly) {
  return {
    left: jelly.left,
    top: jelly.startTop,
    width: `${jelly.size}px`,
    height: `${jelly.size * 0.9}px`,
    animationDelay: `${jelly.delay}s`
  }
}

// iOS Safari 兼容性修复：在应用加载时强制初始化 AudioContext
// 这会在用户看到主页后立即尝试恢复 AudioContext，确保后续音频能够播放
onMounted(() => {
  // iOS Safari 关键修复：必须同步调用，不能是异步函数
  // 虽然 forceInitializeAudioContext 返回 Promise，但我们不 await
  forceInitializeAudioContext().catch(() => {
    // 忽略初始化失败，用户交互时会再次尝试
  })
})
</script>

<template>
  <div class="page">
      <!-- 水母背景 -->
    <div class="jellyfishes">
      <div 
        v-for="(jelly, index) in jellyfishes" 
        :key="index"
        class="jellyfish"
        :style="jellyStyle(jelly)"
      >
        <div class="jelly-head" :style="{ background: jelly.color }">
          <div class="jelly-shine"></div>
        </div>
        <div class="jelly-tentacles">
          <div v-for="i in 5" :key="i" class="tentacle" :style="{ background: jelly.color }"></div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content">
      <!-- 标题区 -->
      <div class="header animate-fade-in-up">
        <!-- 渐变标题 -->
        <h1 class="title bg-gradient-to-r from-peppa-blue to-peppa-blue-dark bg-clip-text text-transparent">
          快乐数学
        </h1>
        <p class="subtitle animate-pulse-gentle">趣味学习，快乐成长！</p>
      </div>
      
      <!-- 统计卡片 -->
      <div class="stats">
        <div class="stat-card stat-card-blue animate-card-entrance" style="animation-delay: 100ms">
          <div class="stat-icon-wrapper">
            <Trophy :size="32" class="stat-icon" />
          </div>
          <p class="stat-value">{{ completedCount }}</p>
          <p class="stat-label">已完成关卡</p>
        </div>

        <div class="stat-card stat-card-yellow animate-card-entrance" style="animation-delay: 200ms">
          <div class="stat-icon-wrapper">
            <Star :size="32" class="stat-icon" />
          </div>
          <p class="stat-value">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="stat-label">总关卡数</p>
        </div>
      </div>
      
      <!-- 主按钮 -->
      <div class="buttons">
        <button 
          @click="startGame" 
          class="btn btn-primary animate-button-entrance"
          style="animation-delay: 300ms"
        >
          <Play :size="24" />
          开始游戏
        </button>

        <button 
          @click="viewAchievements" 
          class="btn btn-secondary animate-button-entrance"
          style="animation-delay: 400ms"
        >
          <Trophy :size="24" />
          查看成就
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  background: linear-gradient(180deg, #E3F2FD 0%, #F5F9FF 50%, #81ECEC 100%);
  /* Allow scrolling on mobile while maintaining layout */
  overflow-y: auto;
  overflow-x: hidden;
  /* Safe area handling for notched devices */
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

/* 水母动画 */
.jellyfishes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.jellyfish {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: floatJellyfish 20s ease-in-out infinite;
}

.jelly-head {
  width: 100%;
  height: 100%;
  border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
  position: relative;
  box-shadow: 
    inset -6px -6px 16px rgba(0, 0, 0, 0.08),
    inset 6px 6px 16px rgba(255, 255, 255, 0.4),
    0 8px 25px rgba(0, 0, 0, 0.1);
  animation: jellyPulse 3s ease-in-out infinite;
}

.jelly-shine {
  position: absolute;
  top: 15%;
  left: 20%;
  width: 25%;
  height: 35%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), transparent);
  border-radius: 50%;
}

@keyframes jellyPulse {
  0%, 100% {
    transform: scale(1);
    border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
  }
  50% {
    transform: scale(1.03);
    border-radius: 52% 52% 48% 48% / 62% 62% 38% 38%;
  }
}

.jelly-tentacles {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: -8px;
}

.tentacle {
  width: 3px;
  height: 30px;
  border-radius: 0 0 50% 50%;
  opacity: 0.6;
  animation: tentacleWave 2s ease-in-out infinite;
}

.tentacle:nth-child(1) { animation-delay: 0s; }
.tentacle:nth-child(2) { animation-delay: 0.2s; }
.tentacle:nth-child(3) { animation-delay: 0.4s; }
.tentacle:nth-child(4) { animation-delay: 0.1s; }
.tentacle:nth-child(5) { animation-delay: 0.3s; }

@keyframes tentacleWave {
  0%, 100% { transform: translateX(0) rotate(-5deg); }
  50% { transform: translateX(2px) rotate(5deg); }
}

@keyframes floatJellyfish {
  0% {
    transform: translateY(0) rotate(-3deg);
    opacity: 0;
  }
  5% {
    opacity: 0.85;
  }
  95% {
    opacity: 0.85;
  }
  100% {
    transform: translateY(-120vh) rotate(3deg);
    opacity: 0;
  }
}

.content {
  width: 100%;
  max-width: 360px;
  position: relative;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 10px;
  font-family: inherit;
  letter-spacing: 2px;
  filter: drop-shadow(0 3px 6px rgba(74, 144, 226, 0.25));
}

.subtitle {
  font-size: 17px;
  color: #5a7a9a;
  font-family: inherit;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 32px;
}

.stat-card {
  background: #ffffff;
  border-radius: 32px;
  padding: 24px 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(74, 144, 226, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: rgba(74, 144, 226, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card-blue {
  border-color: rgba(74, 144, 226, 0.3);
}

.stat-card-blue:hover {
  border-color: #4A90E2;
}

.stat-card-yellow {
  border-color: rgba(255, 193, 7, 0.3);
}

.stat-card-yellow:hover {
  border-color: #FFB300;
}

.stat-icon-wrapper {
  margin-bottom: 10px;
}

.stat-card-blue .stat-icon {
  color: #4A90E2;
}

.stat-card-yellow .stat-icon {
  color: #FFB300;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  font-family: inherit;
  margin-bottom: 4px;
}

.stat-card-blue .stat-value {
  color: #2A70C2;
}

.stat-card-yellow .stat-value {
  color: #FF8F00;
}

.stat-label {
  font-size: 13px;
  color: #94a3b8;
  font-family: inherit;
  font-weight: 500;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 18px 24px;
  font-size: 19px;
  font-weight: 700;
  font-family: inherit;
  border-radius: 32px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.btn:active {
  transform: scale(0.96);
}

.btn-primary {
  background: #4A90E2;
  color: white;
  border: 2px solid #4A90E2;
  box-shadow: 0 4px 20px rgba(74, 144, 226, 0.25);
}

.btn-primary:hover {
  background: #5A9FF2;
  border-color: #5A9FF2;
  box-shadow: 0 6px 25px rgba(74, 144, 226, 0.35);
  transform: translateY(-2px);
}

.btn-secondary {
  background: #ffffff;
  color: #4A90E2;
  border: 2px solid rgba(74, 144, 226, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.btn-secondary:hover {
  background: #ffffff;
  border-color: #4A90E2;
  box-shadow: 0 6px 25px rgba(74, 144, 226, 0.2);
  transform: translateY(-2px);
}

/* 动画延迟类 */
.animate-card-entrance {
  animation: cardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.animate-button-entrance {
  animation: buttonEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: translateY(25px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes buttonEntrance {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
