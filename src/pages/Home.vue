<script setup>
import { useRouter } from 'vue-router'
import { Calculator, Trophy, Play, Star } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { DIFFICULTY_GROUPS } from '../config/difficulty'

const router = useRouter()
const { getAllBestScores } = useStorage()

const bestScores = getAllBestScores()
const completedCount = Object.keys(bestScores).length

function startGame() {
  router.push('/difficulty')
}

function viewAchievements() {
  router.push('/difficulty')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        v-for="i in 10"
        :key="i"
        class="absolute rounded-full opacity-10 animate-float"
        :style="{
          width: `${Math.random() * 100 + 50}px`,
          height: `${Math.random() * 100 + 50}px`,
          backgroundColor: ['#4F46E5', '#3B82F6', '#6366F1', '#10B981', '#F59E0B'][i % 5],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }"
      ></div>
    </div>
    
    <!-- 主内容区 -->
    <div class="relative z-10 w-full max-w-2xl">
      <!-- 标题区 -->
      <div class="text-center mb-12 animate-slideIn">
        <div class="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-xl shadow-indigo-200 mb-6 animate-pulse-glow">
          <Calculator :size="56" class="text-white" />
        </div>
        
        <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
          数学运算游戏
        </h1>
        
        <p class="text-lg md:text-xl text-gray-600">
          轻松学数学，快乐成长！
        </p>
      </div>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 text-center text-white shadow-lg shadow-indigo-200 animate-slideIn" style="animation-delay: 0.1s">
          <Trophy :size="40" class="mx-auto mb-3" />
          <p class="text-3xl font-bold">{{ completedCount }}</p>
          <p class="text-sm opacity-90">已完成关卡</p>
        </div>
        
        <div class="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-center text-white shadow-lg shadow-green-200 animate-slideIn" style="animation-delay: 0.2s">
          <Star :size="40" class="mx-auto mb-3" />
          <p class="text-3xl font-bold">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="text-sm opacity-90">总关卡数</p>
        </div>
      </div>
      
      <!-- 主按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slideIn" style="animation-delay: 0.3s">
        <button
          @click="startGame"
          class="flex-1 max-w-xs mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xl py-6 px-12 rounded-full shadow-xl shadow-indigo-200 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Play :size="28" />
          开始游戏
        </button>
        
        <button
          @click="viewAchievements"
          class="flex-1 max-w-xs mx-auto bg-white hover:bg-gray-50 text-indigo-600 font-bold text-xl py-6 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Trophy :size="28" />
          查看成就
        </button>
      </div>
      
      <!-- 提示信息 -->
      <div class="mt-12 text-center animate-slideIn" style="animation-delay: 0.4s">
        <p class="text-gray-500 text-sm">
          🎯 循序渐进，从简单到复杂<br />
          🏆 挑战自己，创造最佳成绩
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}
</style>
