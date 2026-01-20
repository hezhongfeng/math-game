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
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-flow">
    <!-- 浮动装饰元素 -->
    <div class="fixed inset-0 pointer-events-none z-0">
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
    <div class="w-full max-w-2xl relative z-10">
      <!-- 标题区 -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-peppa-blue to-peppa-blue-dark rounded-cute-xl shadow-cute-xl mb-6 animate-pulse-gentle">
          <div class="text-7xl">⚽</div>
        </div>

        <h1 class="text-4xl md:text-6xl font-bold text-peppa-blue-dark mb-4 font-rounded animate-title-glow">
          快乐数学
        </h1>

        <p class="text-lg md:text-xl text-peppa-cyan-dark/80 font-rounded animate-fade-in-up">
          趣味学习，快乐成长！
        </p>
      </div>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-gradient-to-br from-peppa-blue to-peppa-blue-dark rounded-cute-xl p-6 text-center text-white shadow-cute animate-card-entrance" style="animation-delay: 0.2s">
          <Trophy :size="40" class="mx-auto mb-3" />
          <p class="text-3xl font-bold">{{ completedCount }}</p>
          <p class="text-sm opacity-90 font-rounded">已完成关卡</p>
        </div>

        <div class="bg-gradient-to-br from-peppa-yellow to-peppa-yellow-dark rounded-cute-xl p-6 text-center text-gray-800 shadow-cute animate-card-entrance" style="animation-delay: 0.4s">
          <Star :size="40" class="mx-auto mb-3" />
          <p class="text-3xl font-bold">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="text-sm opacity-90 font-rounded">总关卡数</p>
        </div>
      </div>
      
      <!-- 主按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="startGame"
          class="flex-1 max-w-xs mx-auto bg-gradient-to-r from-peppa-blue to-peppa-blue-dark hover:from-peppa-blue-light hover:to-peppa-blue text-white font-bold text-xl py-6 px-12 rounded-cute-xl shadow-cute-lg hover:shadow-cute-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 font-rounded border-4 border-transparent hover:border-peppa-blue-light/50 animate-button-entrance"
          style="animation-delay: 0.6s"
        >
          <Play :size="28" />
          开始游戏
        </button>

        <button
          @click="viewAchievements"
          class="flex-1 max-w-xs mx-auto bg-white hover:bg-peppa-blue-light/30 text-peppa-blue-dark font-bold text-xl py-6 px-12 rounded-cute-xl shadow-cute hover:shadow-cute-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 font-rounded border-4 border-peppa-blue-light/30 hover:border-peppa-blue-light/60 animate-button-entrance"
          style="animation-delay: 0.8s"
        >
          <Trophy :size="28" />
          查看成就
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 背景渐变流动动画 */
.bg-gradient-flow {
  background: linear-gradient(-45deg, #E3F2FD, #F0F9FF, #E8F5E9, #FFF3E0);
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 标题发光动画 */
.animate-title-glow {
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(33, 150, 243, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(33, 150, 243, 0.6), 0 0 30px rgba(33, 150, 243, 0.4);
  }
}

/* 温柔脉冲动画 */
.animate-pulse-gentle {
  animation: pulseGentle 2s ease-in-out infinite;
}

@keyframes pulseGentle {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 淡入上升动画 */
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片入场动画 */
.animate-card-entrance {
  animation: cardEntrance 0.6s ease-out both;
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 按钮入场动画 */
.animate-button-entrance {
  animation: buttonEntrance 0.8s ease-out both;
}

@keyframes buttonEntrance {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 浮动动画 */
.animate-float {
  animation: float 6s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-15px) rotate(-5deg);
  }
}
</style>

