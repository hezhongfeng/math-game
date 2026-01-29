<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, Play, Star, Sparkles } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { DIFFICULTY_GROUPS } from '../config/difficulty'

const router = useRouter()
const { getAllBestScores } = useStorage()
const { playSound, forceInitializeAudioContext } = useSound()

const bestScores = getAllBestScores()
const completedCount = Object.keys(bestScores).length

// 按钮涟漪效果状态
const rippleActive = ref({ start: false, achievements: false })

// 水母数据 - 优化配色方案，更鲜艳柔和
const jellyfishes = [
  // 第一组: 0-4秒 - 珊瑚粉色系
  { color: '#FFAB91', delay: 0, left: '8%', startTop: '85%', size: 42, opacity: 0.7 },
  { color: '#FF8A65', delay: 0.5, left: '5%', startTop: '70%', size: 38, opacity: 0.65 },
  { color: '#FFCCBC', delay: 1, left: '12%', startTop: '55%', size: 40, opacity: 0.7 },
  { color: '#FF8A80', delay: 1.5, left: '3%', startTop: '40%', size: 36, opacity: 0.6 },
  { color: '#F48FB1', delay: 2, left: '15%', startTop: '25%', size: 39, opacity: 0.65 },
  { color: '#FF80AB', delay: 2.5, left: '25%', startTop: '90%', size: 41, opacity: 0.7 },
  { color: '#F06292', delay: 3, left: '22%', startTop: '75%', size: 38, opacity: 0.65 },
  { color: '#FFAB91', delay: 3.5, left: '28%', startTop: '60%', size: 40, opacity: 0.7 },

  // 第二组: 4-8秒 - 天蓝色系
  { color: '#81D4FA', delay: 4, left: '18%', startTop: '45%', size: 36, opacity: 0.6 },
  { color: '#4FC3F7', delay: 4.5, left: '32%', startTop: '35%', size: 39, opacity: 0.65 },
  { color: '#B3E5FC', delay: 5, left: '45%', startTop: '95%', size: 43, opacity: 0.7 },
  { color: '#29B6F6', delay: 5.5, left: '42%', startTop: '80%', size: 40, opacity: 0.65 },
  { color: '#E1F5FE', delay: 6, left: '48%', startTop: '65%', size: 38, opacity: 0.6 },
  { color: '#81D4FA', delay: 6.5, left: '52%', startTop: '50%', size: 41, opacity: 0.7 },
  { color: '#B3E5FC', delay: 7, left: '38%', startTop: '35%', size: 36, opacity: 0.6 },
  { color: '#4FC3F7', delay: 7.5, left: '62%', startTop: '88%', size: 39, opacity: 0.65 },

  // 第三组: 8-12秒 - 薰衣草紫色系
  { color: '#CE93D8', delay: 8, left: '68%', startTop: '72%', size: 41, opacity: 0.7 },
  { color: '#BA68C8', delay: 8.5, left: '75%', startTop: '58%', size: 38, opacity: 0.65 },
  { color: '#E1BEE7', delay: 9, left: '82%', startTop: '42%', size: 40, opacity: 0.7 },
  { color: '#AB47BC', delay: 9.5, left: '88%', startTop: '28%', size: 42, opacity: 0.65 },
  { color: '#F3E5F5', delay: 10, left: '92%', startTop: '82%', size: 37, opacity: 0.6 },
  { color: '#CE93D8', delay: 10.5, left: '78%', startTop: '48%', size: 36, opacity: 0.6 },
  { color: '#E1BEE7', delay: 11, left: '95%', startTop: '15%', size: 40, opacity: 0.7 },
  { color: '#D1C4E9', delay: 11.5, left: '8%', startTop: '60%', size: 38, opacity: 0.65 },

  // 第四组: 12-16秒 - 薄荷绿色系
  { color: '#80CBC4', delay: 12, left: '15%', startTop: '75%', size: 39, opacity: 0.6 },
  { color: '#4DB6AC', delay: 12.5, left: '35%', startTop: '90%', size: 41, opacity: 0.7 },
  { color: '#B2DFDB', delay: 13, left: '55%', startTop: '70%', size: 36, opacity: 0.6 },
  { color: '#26A69A', delay: 13.5, left: '70%', startTop: '55%', size: 38, opacity: 0.65 },
  { color: '#E0F2F1', delay: 14, left: '85%', startTop: '40%', size: 40, opacity: 0.7 },
  { color: '#80CBC4', delay: 14.5, left: '25%', startTop: '30%', size: 37, opacity: 0.6 },
  { color: '#A5D6A7', delay: 15, left: '45%', startTop: '85%', size: 39, opacity: 0.65 },
  { color: '#81C784', delay: 15.5, left: '65%', startTop: '65%', size: 41, opacity: 0.7 },

  // 第五组: 16-20秒 - 奶油黄色系
  { color: '#FFF176', delay: 16, left: '10%', startTop: '50%', size: 36, opacity: 0.6 },
  { color: '#FFEE58', delay: 16.5, left: '30%', startTop: '70%', size: 38, opacity: 0.65 },
  { color: '#FFF59D', delay: 17, left: '50%', startTop: '85%', size: 40, opacity: 0.7 },
  { color: '#FDD835', delay: 17.5, left: '70%', startTop: '60%', size: 37, opacity: 0.6 },
  { color: '#FFF9C4', delay: 18, left: '85%', startTop: '45%', size: 39, opacity: 0.65 },
  { color: '#FFF59D', delay: 18.5, left: '20%', startTop: '35%', size: 35, opacity: 0.6 },
  { color: '#FFF176', delay: 19, left: '40%', startTop: '80%', size: 38, opacity: 0.65 },
  { color: '#FFEE58', delay: 19.5, left: '60%', startTop: '55%', size: 40, opacity: 0.7 },
]

function startGame() {
  rippleActive.value.start = true
  setTimeout(() => rippleActive.value.start = false, 600)
  playSound('click')
  router.push('/difficulty')
}

function viewAchievements() {
  rippleActive.value.achievements = true
  setTimeout(() => rippleActive.value.achievements = false, 600)
  playSound('click')
  router.push('/difficulty')
}

// 计算水母样式
function jellyStyle(jelly) {
  return {
    left: jelly.left,
    top: jelly.startTop,
    width: `${jelly.size}px`,
    height: `${jelly.size * 0.9}px`,
    animationDelay: `${jelly.delay}s`
  }
}

// iOS Safari 兼容性修复
onMounted(() => {
  forceInitializeAudioContext().catch(() => {})
})
</script>

<template>
  <div class="page">
    <!-- 装饰性浮动元素 -->
    <div class="floating-decorations">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
      <div class="deco-circle deco-3"></div>
      <div class="deco-star">⭐</div>
      <div class="deco-sparkle">✨</div>
    </div>

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
        <!-- 渐变发光标题 -->
        <h1 class="title">
          <span class="title-text">快乐数学</span>
          <Sparkles class="title-sparkle" :size="32" />
        </h1>
        <p class="subtitle animate-pulse-gentle">
          <span class="subtitle-icon">🎯</span>
          趣味学习，快乐成长！
          <span class="subtitle-icon">🚀</span>
        </p>
      </div>

      <!-- 统计卡片 - Cliomorphism 风格 -->
      <div class="stats">
        <div class="stat-card stat-card-trophy animate-card-entrance" style="animation-delay: 100ms">
          <div class="stat-icon-wrapper icon-trophy">
            <Trophy :size="28" class="stat-icon" />
          </div>
          <p class="stat-value">{{ completedCount }}</p>
          <p class="stat-label">已完成关卡</p>
        </div>

        <div class="stat-card stat-card-star animate-card-entrance" style="animation-delay: 200ms">
          <div class="stat-icon-wrapper icon-star">
            <Star :size="28" class="stat-icon" />
          </div>
          <p class="stat-value">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="stat-label">总关卡数</p>
        </div>
      </div>

      <!-- 主按钮 - 立体按钮 -->
      <div class="buttons">
        <button
          @click="startGame"
          class="btn btn-clay-primary animate-button-entrance"
          :class="{ 'btn-ripple': rippleActive.start }"
          style="animation-delay: 300ms"
        >
          <span class="btn-icon-wrapper">
            <Play :size="24" class="btn-icon" />
          </span>
          <span class="btn-text">开始游戏</span>
          <span class="btn-shine"></span>
        </button>

        <button
          @click="viewAchievements"
          class="btn btn-clay-secondary animate-button-entrance"
          :class="{ 'btn-ripple': rippleActive.achievements }"
          style="animation-delay: 400ms"
        >
          <span class="btn-icon-wrapper">
            <Trophy :size="24" class="btn-icon" />
          </span>
          <span class="btn-text">查看成就</span>
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
  background: linear-gradient(180deg, #FFF8E1 0%, #F3E5F5 30%, #E0F7FA 60%, #FFF8E1 100%);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

/* 装饰性浮动元素 */
.floating-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
}

.deco-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #FF8A80, #FFAB91);
  top: 5%;
  right: -50px;
  animation: float-rotate 8s ease-in-out infinite;
}

.deco-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #81D4FA, #4FC3F7);
  bottom: 15%;
  left: -30px;
  animation: float-rotate 10s ease-in-out infinite reverse;
}

.deco-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #CE93D8, #BA68C8);
  top: 40%;
  left: 5%;
  animation: float-gentle 6s ease-in-out infinite;
}

.deco-star, .deco-sparkle {
  position: absolute;
  font-size: 24px;
  animation: starTwinkle 2s ease-in-out infinite;
}

.deco-star {
  top: 15%;
  left: 15%;
  animation-delay: 0.5s;
}

.deco-sparkle {
  top: 25%;
  right: 12%;
  animation-delay: 1s;
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
  animation: floatJellyfish 20s linear infinite;
  opacity: 0;
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
  3% {
    opacity: 0.7;
  }
  97% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-120vh) rotate(3deg);
    opacity: 0;
  }
}

.content {
  width: 100%;
  max-width: 380px;
  position: relative;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 12px;
  font-family: inherit;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-text {
  background: linear-gradient(135deg, #FF8A80 0%, #4FC3F7 50%, #81C784 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.title-sparkle {
  color: #FFD54F;
  animation: starTwinkle 2s ease-in-out infinite;
}

.subtitle {
  font-size: 18px;
  color: #5a7a9a;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.subtitle-icon {
  font-size: 20px;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 36px;
}

/* Cliomorphism 风格统计卡片 */
.stat-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 24px 16px;
  text-align: center;
  box-shadow:
    0 4px 0 0 rgba(0, 0, 0, 0.08),
    0 6px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 6px 0 0 rgba(0, 0, 0, 0.08),
    0 12px 30px rgba(0, 0, 0, 0.15);
}

.stat-card-trophy {
  border-top: 4px solid #4FC3F7;
}

.stat-card-star {
  border-top: 4px solid #FFD54F;
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  box-shadow:
    0 3px 0 0 rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-trophy {
  background: linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%);
  color: #0288D1;
}

.icon-star {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  color: #FFA000;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  font-family: inherit;
  margin-bottom: 4px;
  color: #37474F;
}

.stat-card-trophy .stat-value {
  color: #0277BD;
}

.stat-card-star .stat-value {
  color: #F57F17;
}

.stat-label {
  font-size: 14px;
  color: #78909C;
  font-family: inherit;
  font-weight: 500;
}

/* 按钮区域 */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Cliomorphism 风格立体按钮 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 20px 28px;
  font-size: 20px;
  font-weight: 700;
  font-family: inherit;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  position: relative;
  overflow: hidden;
}

.btn-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  position: relative;
  z-index: 1;
}

/* 主按钮 - 渐变立体 */
.btn-clay-primary {
  background: linear-gradient(180deg, #FF8A80 0%, #FF7043 100%);
  color: white;
  box-shadow:
    0 5px 0 0 #E64A19,
    0 8px 25px rgba(255, 112, 67, 0.4);
  border: none;
}

.btn-clay-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 7px 0 0 #E64A19,
    0 12px 35px rgba(255, 112, 67, 0.5);
}

.btn-clay-primary:active {
  transform: translateY(3px);
  box-shadow:
    0 2px 0 0 #E64A19,
    0 4px 15px rgba(255, 112, 67, 0.4);
}

/* 按钮光泽效果 */
.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-clay-primary:hover .btn-shine {
  left: 100%;
}

/* 次要按钮 */
.btn-clay-secondary {
  background: linear-gradient(180deg, #ffffff 0%, #F5F5F5 100%);
  color: #4FC3F7;
  box-shadow:
    0 4px 0 0 #B0BEC5,
    0 6px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #E0F7FA;
}

.btn-clay-secondary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 0 0 #B0BEC5,
    0 10px 30px rgba(0, 0, 0, 0.15);
  border-color: #B3E5FC;
}

.btn-clay-secondary:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 0 #B0BEC5,
    0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 水波纹效果 */
.btn-ripple::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
  transform: scale(0);
  opacity: 0;
  animation: ripple-effect 0.6s ease-out;
}

@keyframes ripple-effect {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
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

@keyframes starTwinkle {
  0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.6; transform: scale(0.9) rotate(15deg); }
}
</style>
