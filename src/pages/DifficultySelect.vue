<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy, Star } from 'lucide-vue-next'
import { DIFFICULTY_LEVELS, DIFFICULTY_GROUPS } from '../config/difficulty'
import { DECORATIONS, CUTE_EMOJIS } from '../config/constants'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import DifficultyCard from '../components/DifficultyCard.vue'

const router = useRouter()
const { getBestScore, getCompletedDifficulties, getAllBestScores } = useStorage()
const { playSound } = useSound()

const completedDifficulties = computed(() => getCompletedDifficulties())
const allBestScores = computed(() => getAllBestScores())
const completedCount = computed(() => Object.keys(allBestScores.value).length)

function getDifficultyById(id) {
  return DIFFICULTY_LEVELS.find(d => d.id === id)
}

function goBack() {
  playSound('click')
  router.push('/')
}

function selectDifficulty(difficulty) {
  playSound('click')
  router.push(`/game/${difficulty.id}`)
}

function getDifficultyBestScore(difficultyId) {
  return getBestScore(difficultyId)
}

function isDifficultyLocked(difficulty) {
  // 第一关不锁定
  if (difficulty.id === 1) return false
  // 检查前一关是否完成
  const previousId = difficulty.id - 1
  return !completedDifficulties.value.includes(previousId)
}

const decorations = DECORATIONS.difficulty
const cuteEmojis = CUTE_EMOJIS

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="min-h-screen flex flex-col px-3 py-4 pb-24 bg-gradient-flow">
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

    <!-- 顶部导航 -->
    <div class="w-full mb-4 relative z-10">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-peppa-blue-dark hover:text-peppa-blue font-medium transition-colors font-rounded px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-cute-lg shadow-cute hover:shadow-cute-lg active:scale-95 transition-all border-4 border-peppa-blue-light/30 hover:border-peppa-blue-light/60"
      >
        <ArrowLeft :size="22" />
        <span>返回主页</span>
      </button>
    </div>

    <!-- 标题区 -->
    <div class="w-full mb-4 text-center relative z-10">
      <h1 class="text-2xl md:text-3xl font-bold text-peppa-blue-dark mb-1 font-rounded animate-title-glow">
        选择难度
      </h1>
      <p class="text-base text-peppa-cyan-dark/80 font-rounded">
        选择一个难度开始挑战吧！
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="w-full mb-4 grid grid-cols-2 gap-3 relative z-10">
      <div class="bg-gradient-to-br from-peppa-green to-peppa-green-dark rounded-cute-xl py-4 px-3 text-center text-white shadow-cute animate-card-entrance" style="animation-delay: 0.1s">
        <Trophy :size="32" class="mx-auto mb-1" />
        <p class="text-2xl font-bold">{{ completedCount }}</p>
        <p class="text-xs opacity-90 font-rounded">已完成关卡</p>
      </div>

      <div class="bg-gradient-to-br from-peppa-purple to-peppa-purple-dark rounded-cute-xl py-4 px-3 text-center text-white shadow-cute animate-card-entrance" style="animation-delay: 0.2s">
        <Star :size="32" class="mx-auto mb-1" />
        <p class="text-2xl font-bold">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
        <p class="text-xs opacity-90 font-rounded">总关卡数</p>
      </div>
    </div>

    <!-- 难度列表 -->
    <div class="w-full space-y-5 relative z-10">
      <div v-for="(group, groupIndex) in DIFFICULTY_GROUPS" :key="group.name" class="difficulty-group">
        <h2 class="text-xl font-bold text-peppa-blue-dark mb-3 flex items-center gap-2 font-rounded">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-cute-lg shadow-cute text-lg"
                :style="{ backgroundColor: group.color }">
            {{ groupIndex === 0 ? '🌟' : groupIndex === 1 ? '🎯' : groupIndex === 2 ? '🚀' : groupIndex === 3 ? '💪' : '👑' }}
          </span>
          {{ group.name }}阶段
        </h2>

        <div class="grid grid-cols-1 gap-3">
          <DifficultyCard
            v-for="id in group.levels"
            :key="id"
            :difficulty="getDifficultyById(id)"
            :is-locked="isDifficultyLocked(getDifficultyById(id))"
            :is-completed="completedDifficulties.includes(id)"
            :best-score="getDifficultyBestScore(id)"
            @select="selectDifficulty"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 背景渐变流动动画 */
.bg-gradient-flow {
  background: linear-gradient(-45deg, #E3F2FD, #F0F9FF, #E8F5E9, #FFF3E0, #FCE4EC);
  background-size: 400% 400%;
  animation: gradientFlow 20s ease infinite;
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
    text-shadow: 0 0 10px rgba(156, 39, 176, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(156, 39, 176, 0.6), 0 0 30px rgba(156, 39, 176, 0.4);
  }
}

/* 温柔脉冲动画 */
.animate-pulse-gentle {
  animation: pulseGentle 3s ease-in-out infinite;
}

@keyframes pulseGentle {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 卡片入场动画 */
.animate-card-entrance {
  animation: cardEntrance 0.6s ease-out both;
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 浮动动画 */
.animate-float {
  animation: float 8s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-10px) rotate(-5deg);
  }
}

.difficulty-group {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
