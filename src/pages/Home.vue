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
    <!-- 主内容区 -->
    <div class="content">
      <!-- 标题区 -->
      <div class="header">
        <div class="logo-wrapper">
          <div class="logo">
            <span class="logo-emoji">⚽</span>
          </div>

          <h1 class="title">快乐数学</h1>
          <p class="subtitle">趣味学习，快乐成长！</p>
        </div>
      </div>
      
      <!-- 统计卡片 -->
      <div class="stats">
        <div class="stat-card stat-card-blue">
          <Trophy :size="32" class="stat-icon" />
          <p class="stat-value">{{ completedCount }}</p>
          <p class="stat-label">已完成关卡</p>
        </div>

        <div class="stat-card stat-card-yellow">
          <Star :size="32" class="stat-icon" />
          <p class="stat-value">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="stat-label">总关卡数</p>
        </div>
      </div>
      
      <!-- 主按钮 -->
      <div class="buttons">
        <button @click="startGame" class="btn btn-primary">
          <Play :size="24" />
          开始游戏
        </button>

        <button @click="viewAchievements" class="btn btn-secondary">
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
  background: #f0f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.content {
  width: 100%;
  max-width: 360px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-wrapper {
  margin-bottom: 20px;
}

.logo {
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #4A90E2, #2A70C2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.3);
}

.logo-emoji {
  font-size: 52px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 8px;
  font-family: inherit;
}

.subtitle {
  font-size: 16px;
  color: #5a7a9a;
  font-family: inherit;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
}

.stat-card-blue {
  border-color: #4A90E2;
}

.stat-card-yellow {
  border-color: #FFD54F;
}

.stat-icon {
  margin-bottom: 8px;
}

.stat-card-blue .stat-icon {
  color: #4A90E2;
}

.stat-card-yellow .stat-icon {
  color: #FFB300;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e3a5f;
  font-family: inherit;
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
  margin-top: 4px;
  font-family: inherit;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 600;
  font-family: inherit;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background: linear-gradient(135deg, #4A90E2, #2A70C2);
  color: white;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.35);
}

.btn-secondary {
  background: white;
  color: #2A70C2;
  border: 2px solid #4A90E2;
}
</style>

