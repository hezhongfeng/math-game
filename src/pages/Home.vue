<script setup>
import { useRouter } from 'vue-router'
import { Calculator, Trophy, Play, Star, Heart } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { DIFFICULTY_GROUPS } from '../config/difficulty'
import { DECORATIONS } from '../config/constants'

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

const decorations = DECORATIONS.home
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-gradient-flow">
    <!-- 浮动装饰元素 -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        v-for="(decoration, index) in decorations"
        :key="index"
        class="absolute animate-float"
        :style="decoration.style"
      >
        {{ decoration.emoji }}
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="w-full max-w-lg relative z-10">
      <!-- 标题区 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-peppa-blue to-peppa-blue-dark rounded-cute-xl shadow-cute-xl mb-5 animate-pulse-gentle">
          <div class="text-6xl">⚽</div>
        </div>

        <h1 class="text-3xl md:text-5xl font-bold text-peppa-blue-dark mb-3 font-rounded animate-title-glow">
          快乐数学
        </h1>

        <p class="text-base md:text-lg text-peppa-cyan-dark/80 font-rounded animate-fade-in-up">
          趣味学习，快乐成长！
        </p>
      </div>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-gradient-to-br from-peppa-blue to-peppa-blue-dark rounded-cute-xl py-5 px-4 text-center text-white shadow-cute card-entrance">
          <Trophy :size="36" class="mx-auto mb-2" />
          <p class="text-3xl font-bold">{{ completedCount }}</p>
          <p class="text-sm opacity-90 font-rounded">已完成关卡</p>
        </div>

        <div class="bg-gradient-to-br from-peppa-yellow to-peppa-yellow-dark rounded-cute-xl py-5 px-4 text-center text-gray-800 shadow-cute card-entrance" style="animation-delay: 0.15s">
          <Star :size="36" class="mx-auto mb-2" />
          <p class="text-3xl font-bold">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="text-sm opacity-90 font-rounded">总关卡数</p>
        </div>
      </div>
      
      <!-- 主按钮 -->
      <div class="flex flex-col gap-4">
        <button
          @click="startGame"
          class="btn-primary text-xl py-5 px-8 flex items-center justify-center gap-3 font-rounded w-full"
        >
          <Play :size="26" />
          开始游戏
        </button>

        <button
          @click="viewAchievements"
          class="btn-secondary text-xl py-5 px-8 flex items-center justify-center gap-3 font-rounded w-full"
        >
          <Trophy :size="26" />
          查看成就
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 背景渐变流动动画 */
.bg-gradient-flow {
  background: linear-gradient(-45deg, #E3F2FD, #F5F9FF, #E8F5E9, #FFF3E0);
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-title-glow {
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { text-shadow: 0 0 10px rgba(74, 144, 226, 0.3); }
  50% { text-shadow: 0 0 25px rgba(74, 144, 226, 0.6), 0 0 35px rgba(74, 144, 226, 0.4); }
}

.animate-pulse-gentle {
  animation: pulseGentle 2.5s ease-in-out infinite;
}

@keyframes pulseGentle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-entrance {
  animation: cardEntrance 0.6s ease-out both;
}

@keyframes cardEntrance {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-15px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-10px); }
}
</style>

