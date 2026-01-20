<script setup>
import { useRouter } from 'vue-router'
import { Calculator, Trophy, Play, Star, Heart } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { DIFFICULTY_GROUPS } from '../config/difficulty'
import { DECORATIONS } from '../config/constants'

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

const decorations = DECORATIONS.home
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6">
    <!-- 主内容区 -->
    <div class="w-full max-w-2xl">
      <!-- 标题区 -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-peppa-blue to-peppa-blue-dark rounded-cute-xl shadow-cute-xl mb-6">
          <div class="text-7xl">⚽</div>
        </div>

        <h1 class="text-4xl md:text-6xl font-bold text-peppa-blue-dark mb-4 font-rounded">
          快乐数学
        </h1>

        <p class="text-lg md:text-xl text-peppa-cyan-dark/80 font-rounded">
          趣味学习，快乐成长！
        </p>
      </div>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-gradient-to-br from-peppa-blue to-peppa-blue-dark rounded-cute-xl p-6 text-center text-white shadow-cute">
          <Trophy :size="40" class="mx-auto mb-3" />
          <p class="text-3xl font-bold">{{ completedCount }}</p>
          <p class="text-sm opacity-90 font-rounded">已完成关卡</p>
        </div>

        <div class="bg-gradient-to-br from-peppa-yellow to-peppa-yellow-dark rounded-cute-xl p-6 text-center text-gray-800 shadow-cute">
          <Star :size="40" class="mx-auto mb-3" />
          <p class="text-3xl font-bold">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="text-sm opacity-90 font-rounded">总关卡数</p>
        </div>
      </div>
      
      <!-- 主按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="startGame"
          class="flex-1 max-w-xs mx-auto bg-gradient-to-r from-peppa-blue to-peppa-blue-dark hover:from-peppa-blue-light hover:to-peppa-blue text-white font-bold text-xl py-6 px-12 rounded-cute-xl shadow-cute-lg hover:shadow-cute-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 font-rounded"
        >
          <Play :size="28" />
          开始游戏
        </button>

        <button
          @click="viewAchievements"
          class="flex-1 max-w-xs mx-auto bg-white hover:bg-peppa-blue-light/30 text-peppa-blue-dark font-bold text-xl py-6 px-12 rounded-cute-xl shadow-cute hover:shadow-cute-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 font-rounded"
        >
          <Trophy :size="28" />
          查看成就
        </button>
      </div>
    </div>
  </div>
</template>

