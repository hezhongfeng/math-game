<script setup>
import { onMounted } from 'vue'
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

function startGame() {
  playSound('click')
  router.push('/difficulty')
}

function viewAchievements() {
  playSound('click')
  router.push('/difficulty')
}

// iOS Safari 兼容性修复
onMounted(() => {
  forceInitializeAudioContext().catch(() => {})
})
</script>

<template>
  <div class="page">
    <!-- 装饰性浮动元素 - Candy Style -->
    <div class="floating-decorations">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
      <div class="deco-circle deco-3"></div>
      <div class="deco-blob deco-blob-1"></div>
      <div class="deco-blob deco-blob-2"></div>
    </div>

    <!-- 主内容区 -->
    <div class="content">
      <!-- 标题区 -->
      <div class="header animate-fade-in-up">
        <!-- 渐变发光标题 - Candy Style -->
        <h1 class="title">
          <span class="title-text">快乐数学</span>
          <Sparkles class="title-sparkle" :size="32" />
        </h1>
        <p class="subtitle animate-pulse-gentle">
          <span class="subtitle-dot dot-1"></span>
          趣味学习，快乐成长！
          <span class="subtitle-dot dot-2"></span>
        </p>
      </div>

      <!-- 统计卡片 - Candy Claymorphism Style -->
      <div class="stats">
        <div
          class="stat-card-candy stat-card-trophy animate-card-entrance"
          style="animation-delay: 100ms"
        >
          <div class="stat-icon-wrapper-candy icon-trophy-candy">
            <Trophy :size="28" class="stat-icon" />
          </div>
          <p class="stat-value">{{ completedCount }}</p>
          <p class="stat-label">已完成关卡</p>
        </div>

        <div
          class="stat-card-candy stat-card-star animate-card-entrance"
          style="animation-delay: 200ms"
        >
          <div class="stat-icon-wrapper-candy icon-star-candy">
            <Star :size="28" class="stat-icon" />
          </div>
          <p class="stat-value">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="stat-label">总关卡数</p>
        </div>
      </div>

      <!-- 主按钮 - Candy Claymorphism Style -->
      <div class="buttons">
        <button
          class="btn-candy-primary animate-button-entrance"
          style="animation-delay: 300ms"
          @click="startGame"
        >
          <Play :size="24" />
          <span>开始游戏</span>
        </button>

        <button
          class="btn-candy-secondary animate-button-entrance"
          style="animation-delay: 400ms"
          @click="viewAchievements"
        >
          <Trophy :size="24" />
          <span>查看成就</span>
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
  background: linear-gradient(180deg, #FFFBF5 0%, #FFF8E7 30%, #F0F9FF 60%, #FFFBF5 100%);
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
  background: linear-gradient(135deg, #FF8FA3, #FFB3C1);
  top: 5%;
  right: -50px;
  animation: float-rotate 8s ease-in-out infinite;
}

.deco-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #4FC3F7, #81D4FA);
  bottom: 15%;
  left: -30px;
  animation: float-rotate 10s ease-in-out infinite reverse;
}

.deco-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #98FF98, #B8FFB8);
  top: 40%;
  left: 5%;
  animation: float-gentle 6s ease-in-out infinite;
}

/* Candy Style Blobs */
.deco-blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  filter: blur(2px);
}

.deco-blob-1 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FFE66D, #FFF5A0);
  top: 20%;
  left: 10%;
  animation: floatClay 4s ease-in-out infinite;
}

.deco-blob-2 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #CE93D8, #E1BEE7);
  top: 60%;
  right: 8%;
  animation: floatClay 5s ease-in-out infinite reverse;
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
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-text {
  background: linear-gradient(135deg, #FF8FA3 0%, #4FC3F7 50%, #98FF98 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.title-sparkle {
  color: #FFE66D;
  animation: starTwinkle 2s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 230, 109, 0.6));
}

.subtitle {
  font-size: 18px;
  color: #7A6A5A;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 500;
}

.subtitle-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot-1 {
  background: #FF8FA3;
  box-shadow: 0 0 8px rgba(255, 143, 163, 0.6);
  animation: glow-clay 2s ease-in-out infinite;
}

.dot-2 {
  background: #98FF98;
  box-shadow: 0 0 8px rgba(152, 255, 152, 0.6);
  animation: glow-clay 2s ease-in-out infinite 1s;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 36px;
}

/* Candy Claymorphism 风格统计卡片 */
.stat-card-candy {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 16px;
  text-align: center;
  border: 3px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    6px 6px 16px rgba(0, 0, 0, 0.08),
    -3px -3px 10px rgba(255, 255, 255, 0.9),
    inset -2px -2px 6px rgba(0, 0, 0, 0.03),
    inset 2px 2px 6px rgba(255, 255, 255, 0.9);
}

.stat-card-candy:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    10px 10px 25px rgba(0, 0, 0, 0.12),
    -5px -5px 15px rgba(255, 255, 255, 0.9),
    inset -2px -2px 6px rgba(0, 0, 0, 0.03),
    inset 2px 2px 6px rgba(255, 255, 255, 0.9);
}

.stat-card-trophy {
  background: linear-gradient(135deg, #ffffff 0%, #E1F5FE 100%);
}

.stat-card-star {
  background: linear-gradient(135deg, #ffffff 0%, #FFF8E1 100%);
}

.stat-icon-wrapper-candy {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  border: 3px solid white;
  box-shadow:
    3px 3px 10px rgba(0, 0, 0, 0.08),
    -2px -2px 6px rgba(255, 255, 255, 1),
    inset -1px -1px 4px rgba(0, 0, 0, 0.03),
    inset 1px 1px 4px rgba(255, 255, 255, 0.9);
}

.icon-trophy-candy {
  background: linear-gradient(135deg, #B3E5FC 0%, #4FC3F7 100%);
  color: white;
}

.icon-star-candy {
  background: linear-gradient(135deg, #FFF59D 0%, #FFE66D 100%);
  color: #5D4E37;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  font-family: inherit;
  margin-bottom: 4px;
  color: #5D4E37;
}

.stat-card-trophy .stat-value {
  color: #29B6F6;
}

.stat-card-star .stat-value {
  color: #F9A825;
}

.stat-label {
  font-size: 14px;
  color: #7A6A5A;
  font-family: inherit;
  font-weight: 500;
}

/* 按钮区域 */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Candy Claymorphism 风格按钮 */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 草莓粉主按钮 */
.btn-candy-primary {
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
  background: linear-gradient(180deg, #FF8FA3 0%, #E85A70 100%);
  color: white;
  border: 3px solid white;
  box-shadow:
    4px 4px 12px rgba(0, 0, 0, 0.1),
    -2px -2px 8px rgba(255, 255, 255, 0.8),
    inset -2px -2px 6px rgba(0, 0, 0, 0.05),
    inset 2px 2px 6px rgba(255, 255, 255, 0.8);
}

.btn-candy-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    6px 6px 16px rgba(0, 0, 0, 0.12),
    -3px -3px 10px rgba(255, 255, 255, 0.9),
    inset -2px -2px 6px rgba(0, 0, 0, 0.05),
    inset 2px 2px 6px rgba(255, 255, 255, 0.8);
}

.btn-candy-primary:active {
  transform: scale(0.95) translateY(2px);
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.1),
    -1px -1px 4px rgba(255, 255, 255, 0.8),
    inset -3px -3px 8px rgba(0, 0, 0, 0.1),
    inset 3px 3px 8px rgba(255, 255, 255, 0.6);
}

/* 天空蓝次按钮 */
.btn-candy-secondary {
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
  background: linear-gradient(180deg, #ffffff 0%, #F0F9FF 100%);
  color: #29B6F6;
  border: 3px solid white;
  box-shadow:
    4px 4px 12px rgba(0, 0, 0, 0.08),
    -2px -2px 8px rgba(255, 255, 255, 0.9),
    inset -2px -2px 6px rgba(0, 0, 0, 0.03),
    inset 2px 2px 6px rgba(255, 255, 255, 0.9);
}

.btn-candy-secondary:hover {
  transform: translateY(-2px);
  box-shadow:
    6px 6px 16px rgba(0, 0, 0, 0.1),
    -3px -3px 10px rgba(255, 255, 255, 0.9),
    inset -2px -2px 6px rgba(0, 0, 0, 0.03),
    inset 2px 2px 6px rgba(255, 255, 255, 0.9);
}

.btn-candy-secondary:active {
  transform: scale(0.95) translateY(2px);
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.08),
    -1px -1px 4px rgba(255, 255, 255, 0.9),
    inset -3px -3px 8px rgba(0, 0, 0, 0.08),
    inset 3px 3px 8px rgba(255, 255, 255, 0.6);
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
