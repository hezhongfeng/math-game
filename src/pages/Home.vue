<script setup>
import { useRouter } from 'vue-router'
import { Trophy, Play, Star } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { DIFFICULTY_GROUPS } from '../config/difficulty'

const router = useRouter()
const { getAllBestScores } = useStorage()
const { playSound } = useSound()

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
</script>

<template>
  <div class="page">
    <!-- 装饰星星 -->
    <div class="stars">
      <span class="star star-1">✨</span>
      <span class="star star-2">⭐</span>
      <span class="star star-3">✨</span>
      <span class="star star-4">⭐</span>
    </div>

    <!-- 主内容区 -->
    <div class="content">
      <!-- 标题区 -->
      <div class="header animate-fade-in-up">
        <div class="logo-wrapper">
          <!-- 浮动动画 Logo -->
          <div class="logo animate-float">
            <span class="logo-emoji">⚽</span>
          </div>
          
          <!-- 渐变标题 -->
          <h1 class="title bg-gradient-to-r from-peppa-blue to-peppa-blue-dark bg-clip-text text-transparent">
            快乐数学
          </h1>
          <p class="subtitle animate-pulse-gentle">趣味学习，快乐成长！</p>
        </div>
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
  overflow: hidden;
}

/* 装饰星星 */
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  font-size: 24px;
  opacity: 0.6;
  animation: floatStar 4s ease-in-out infinite;
}

.star-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.star-2 {
  top: 15%;
  right: 15%;
  font-size: 20px;
  animation-delay: 1s;
}

.star-3 {
  bottom: 20%;
  left: 8%;
  animation-delay: 2s;
}

.star-4 {
  bottom: 15%;
  right: 10%;
  font-size: 28px;
  animation-delay: 1.5s;
}

@keyframes floatStar {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-10px) rotate(10deg) scale(1.1);
    opacity: 0.8;
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
  margin-bottom: 32px;
}

.logo-wrapper {
  margin-bottom: 20px;
}

.logo {
  width: 110px;
  height: 110px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #4A90E2 0%, #2A70C2 100%);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 24px rgba(74, 144, 226, 0.3),
    0 4px 12px rgba(74, 144, 226, 0.2);
  border: 4px solid rgba(255, 255, 255, 0.9);
}

.logo-emoji {
  font-size: 56px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
  font-family: inherit;
  letter-spacing: 1px;
  filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.2));
}

.subtitle {
  font-size: 16px;
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
  background: white;
  border-radius: 20px;
  padding: 22px 16px;
  text-align: center;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.05),
    0 2px 8px rgba(0, 0, 0, 0.03);
  border: 3px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 
    0 12px 30px rgba(0, 0, 0, 0.1),
    0 6px 15px rgba(74, 144, 226, 0.15);
}

.stat-card-blue {
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
  border-color: #4A90E2;
}

.stat-card-yellow {
  background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
  border-color: #FFD54F;
}

.stat-icon-wrapper {
  margin-bottom: 10px;
}

.stat-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
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
  color: #6b7c93;
  font-family: inherit;
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
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:active {
  transform: scale(0.96);
}

.btn-primary {
  background: linear-gradient(135deg, #4A90E2 0%, #2A70C2 100%);
  color: white;
  box-shadow: 
    0 6px 20px rgba(74, 144, 226, 0.35),
    0 3px 10px rgba(74, 144, 226, 0.25);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5A9FF2 0%, #3A80D2 100%);
  box-shadow: 
    0 8px 25px rgba(74, 144, 226, 0.45),
    0 4px 15px rgba(74, 144, 226, 0.3);
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #2A70C2;
  border: 3px solid #4A90E2;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
  border-color: #5A9FF2;
  box-shadow: 
    0 6px 18px rgba(74, 144, 226, 0.25),
    0 3px 10px rgba(74, 144, 226, 0.15);
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

