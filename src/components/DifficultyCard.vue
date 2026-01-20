<script setup>
import { computed } from 'vue'
import { Lock, Star, Trophy, Heart } from 'lucide-vue-next'
import { CUTE_EMOJIS } from '../config/constants'

const props = defineProps({
  difficulty: {
    type: Object,
    required: true
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  bestScore: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select'])

const stars = computed(() => {
  if (!props.bestScore) return []
  const accuracy = props.bestScore.accuracy
  if (accuracy === 100) return [1, 2, 3]
  if (accuracy >= 80) return [1, 2]
  if (accuracy >= 60) return [1]
  return []
})

const cuteEmoji = computed(() => CUTE_EMOJIS[props.difficulty.id % CUTE_EMOJIS.length])
</script>

<template>
<div
    class="difficulty-card relative overflow-hidden rounded-cute-xl cursor-pointer transition-all duration-200 shadow-cute border-4 border-peppa-blue-light bg-white"
    :class="[
      isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-102 hover:-translate-y-1 hover:shadow-cute-lg',
      isCompleted ? 'ring-3 ring-peppa-yellow' : ''
    ]"
    @click="!isLocked && $emit('select', difficulty)"
    :style="{
      background: isLocked ? 'linear-gradient(135deg, #e0e0e0, #d0d0d0)' : `linear-gradient(135deg, ${difficulty.color}10, ${difficulty.color}30)`
    }"
  >
    <!-- 内容 -->
    <div class="relative p-6">
      <!-- 标题 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-cute-lg flex items-center justify-center text-2xl"
               :style="{ backgroundColor: `${difficulty.color}30` }">
            {{ cuteEmoji }}
          </div>
          <div>
            <h3 class="text-xl font-bold font-rounded"
                :style="{ color: difficulty.color }">
              {{ difficulty.name }}
            </h3>
            <p class="text-gray-500 text-sm font-rounded">{{ difficulty.level }}</p>
          </div>
        </div>
        <div v-if="isLocked" class="p-2 bg-gray-200 rounded-cute-full">
          <Lock :size="20" class="text-gray-500" />
        </div>
      </div>

      <!-- 描述 -->
      <p class="text-gray-700 font-medium font-rounded mb-4">{{ difficulty.description }}</p>

      <!-- 题目数量 -->
      <div class="flex items-center gap-2 text-gray-600 text-sm mb-4">
        <Trophy :size="16" class="text-peppa-yellow" />
        <span class="font-rounded">{{ difficulty.questionCount }} 道题目</span>
      </div>

      <!-- 星级评分 -->
      <div v-if="isCompleted && stars.length > 0" class="flex items-center gap-1 mb-3">
        <Star
          v-for="n in 3"
          :key="n"
          :size="20"
          :fill="n <= stars.length ? 'currentColor' : 'none'"
          class="text-peppa-yellow"
        />
      </div>

      <!-- 最佳成绩 -->
      <div v-if="bestScore" class="mt-3 pt-3 border-t-2 border-dashed"
           :style="{ borderColor: `${difficulty.color}30` }">
        <div class="flex items-center justify-between text-gray-600 text-sm">
          <span class="font-rounded">最佳成绩</span>
          <span class="font-bold"
                :style="{ color: difficulty.color }">
            {{ bestScore.correctCount }}/{{ bestScore.totalCount }}
          </span>
        </div>
        <div class="flex items-center justify-between text-gray-600 text-sm">
          <span class="font-rounded">正确率</span>
          <span class="font-bold"
                :style="{ color: difficulty.color }">
            {{ bestScore.accuracy }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

