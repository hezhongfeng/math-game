<script setup>
import { useRouter } from 'vue-router'
import { Calculator, Trophy, Play, Star, Heart } from 'lucide-vue-next'
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

// 装饰元素（使用emoji）
const decorations = [
  { emoji: '☀️', class: 'top-8 right-8 animate-float', size: 48 },
  { emoji: '☁️', class: 'top-16 left-12 animate-wiggle', size: 32 },
  { emoji: '☁️', class: 'top-24 right-24 animate-wiggle', size: 24 },
  { emoji: '⚽', class: 'bottom-20 left-8 animate-bounce-slow', size: 28 },
  { emoji: '⚽', class: 'bottom-16 right-12 animate-bounce-slow', size: 24 },
  { emoji: '✨', class: 'top-32 left-1/4 animate-pulse-slow', size: 20 },
  { emoji: '⭐', class: 'top-40 right-1/3 animate-pulse-slow', size: 16 },
]
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <!-- 装饰背景元素 -->
    <div v-for="(deco, index) in decorations" :key="index"
         :class="['absolute decoration', deco.class]"
         :style="{ fontSize: `${deco.size}px`, animationDelay: `${index * 0.3}s` }">
      {{ deco.emoji }}
    </div>

    <!-- 背景装饰图案 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div
        v-for="i in 8"
        :key="`flower-${i}`"
        class="absolute text-6xl animate-float"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }"
      >
        🌸
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="relative z-10 w-full max-w-2xl">
      <!-- 标题区 -->
      <div class="text-center mb-12 animate-slideIn">
        <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-peppa-blue to-peppa-blue-dark rounded-cute-xl shadow-cute-xl animate-pulse-glow mb-6">
          <div class="text-7xl">⚽</div>
        </div>
        
        <h1 class="text-4xl md:text-6xl font-bold text-peppa-blue-dark mb-4 font-rounded">
          快乐数学
        </h1>

        <p class="text-lg md:text-xl text-peppa-cyan-dark/80 font-rounded">
          趣味学习，快乐成长！
        </p>

        <!-- 装饰表情 -->
        <div class="flex justify-center gap-4 mt-4">
          <span class="text-3xl animate-bounce-slow" style="animation-delay: 0s">⚽</span>
          <span class="text-3xl animate-bounce-slow" style="animation-delay: 0.2s">🚀</span>
          <span class="text-3xl animate-bounce-slow" style="animation-delay: 0.4s">⭐</span>
        </div>
      </div>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-gradient-to-br from-peppa-blue to-peppa-blue-dark rounded-cute-xl p-6 text-center text-white shadow-cute animate-slideIn" style="animation-delay: 0.1s">
          <Trophy :size="40" class="mx-auto mb-3" />
          <p class="text-3xl font-bold">{{ completedCount }}</p>
          <p class="text-sm opacity-90 font-rounded">已完成关卡</p>
        </div>

        <div class="bg-gradient-to-br from-peppa-yellow to-peppa-yellow-dark rounded-cute-xl p-6 text-center text-gray-800 shadow-cute animate-slideIn" style="animation-delay: 0.2s">
          <Star :size="40" class="mx-auto mb-3" />
          <p class="text-3xl font-bold">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="text-sm opacity-90 font-rounded">总关卡数</p>
        </div>
      </div>
      
      <!-- 主按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slideIn" style="animation-delay: 0.3s">
        <button
          @click="startGame"
          class="flex-1 max-w-xs mx-auto bg-gradient-to-r from-peppa-blue to-peppa-blue-dark hover:from-peppa-blue-light hover:to-peppa-blue text-white font-bold text-xl py-6 px-12 rounded-cute-xl shadow-cute-lg hover:shadow-cute-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 font-rounded"
        >
          <Play :size="28" />
          开始游戏
        </button>

        <button
          @click="viewAchievements"
          class="flex-1 max-w-xs mx-auto bg-white hover:bg-peppa-blue-light/30 text-peppa-blue-dark font-bold text-xl py-6 px-12 rounded-cute-xl shadow-cute hover:shadow-cute-lg transition-all duration-300 flex items-center justify-center gap-3 font-rounded"
        >
          <Trophy :size="28" />
          查看成就
        </button>
      </div>
      
      <!-- 提示信息 -->
      <div class="mt-12 text-center animate-slideIn" style="animation-delay: 0.4s">
        <div class="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-cute-lg px-6 py-4 shadow-cute">
          <span class="text-2xl">⚽</span>
          <p class="text-sm md:text-base text-peppa-blue-dark/80 font-rounded">
            每天练习，快乐学习数学！
          </p>
          <span class="text-2xl">⭐</span>
        </div>
      </div>
    </div>

    <!-- 底部小猪脚印装饰 -->
    <div class="absolute bottom-0 left-0 right-0 h-16 flex justify-around items-end opacity-30 pointer-events-none">
      <span class="text-2xl">👣</span>
      <span class="text-2xl">👣</span>
      <span class="text-2xl">👣</span>
      <span class="text-2xl">👣</span>
      <span class="text-2xl">👣</span>
      <span class="text-2xl">👣</span>
    </div>
  </div>
</template>

<style scoped>
.decoration {
  z-index: 0;
  opacity: 0.6;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
