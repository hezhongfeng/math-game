<script setup>
import { computed } from 'vue'
import { Lock, Star, Trophy, Check, ChevronRight } from 'lucide-vue-next'
import { CUTE_EMOJIS } from '../config/constants'
import { useSound } from '../composables/useSound'

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
const { playSound } = useSound()

const stars = computed(() => {
  if (!props.bestScore) return []
  const accuracy = props.bestScore.accuracy
  if (accuracy === 100) return [1, 2, 3]
  if (accuracy >= 80) return [1, 2]
  if (accuracy >= 60) return [1]
  return []
})

const cuteEmoji = computed(() => CUTE_EMOJIS[props.difficulty.id % CUTE_EMOJIS.length])

const accuracyColor = computed(() => {
  if (!props.bestScore) return ''
  if (props.bestScore.accuracy >= 80) return 'text-peppa-green'
  if (props.bestScore.accuracy >= 60) return 'text-peppa-yellow-dark'
  return 'text-peppa-orange'
})

function handleSelect() {
  if (!props.isLocked) {
    playSound('click')
    emit('select', props.difficulty)
  }
}
</script>

<template>
  <div
    class="group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 touch-feedback"
    :class="[
      isLocked 
        ? 'bg-gray-100 cursor-not-allowed' 
        : 'bg-white hover:bg-gray-50 active:scale-[0.98] cursor-pointer shadow-sm border border-gray-100'
    ]"
    :style="{ borderLeft: isLocked ? undefined : `4px solid ${difficulty.color}` }"
    @click="handleSelect"
  >
    <!-- 左侧图标 -->
    <div 
      class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-200"
      :class="isLocked ? 'bg-gray-200' : 'bg-white shadow-sm'"
      :style="{ border: isLocked ? undefined : `2px solid ${difficulty.color}40` }"
    >
      {{ cuteEmoji }}
    </div>

    <!-- 中间内容 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <h3 
          class="text-base font-bold font-rounded truncate"
          :class="isLocked ? 'text-gray-400' : ''"
          :style="isLocked ? {} : { color: difficulty.color }"
        >
          {{ difficulty.name }}
        </h3>
        <!-- 完成标记 -->
        <Check v-if="isCompleted && !isLocked" :size="14" class="text-peppa-green flex-shrink-0" />
        <!-- 锁定标记 -->
        <Lock v-else-if="isLocked" :size="14" class="text-gray-400 flex-shrink-0" />
      </div>
      
      <p class="text-xs font-rounded truncate" :class="isLocked ? 'text-gray-300' : 'text-gray-500'">{{ difficulty.level }}</p>
      
      <!-- 已完成显示成绩 -->
      <div v-if="bestScore && !isLocked" class="flex items-center gap-3 mt-1.5">
        <span class="text-xs text-gray-400">{{ bestScore.correctCount }}/{{ bestScore.totalCount }}</span>
        <span 
          class="text-sm font-bold"
          :class="accuracyColor"
        >
          {{ bestScore.accuracy }}%
        </span>
        <!-- 星级 -->
        <div class="flex items-center gap-0.5">
          <Star 
            v-for="n in 3" 
            :key="n"
            :size="14" 
            :fill="n <= stars.length ? 'currentColor' : 'none'"
            class="text-peppa-yellow"
            :style="{ opacity: n <= stars.length ? 1 : 0.2 }"
          />
        </div>
      </div>
      
      <!-- 未完成且未锁定 -->
      <div v-else-if="!isLocked" class="flex items-center gap-1.5 mt-1">
        <span class="text-xs font-bold" :style="{ color: difficulty.color }">{{ difficulty.questionCount }}题</span>
        <span class="text-xs px-1.5 py-0.5 rounded font-medium"
              :style="{ backgroundColor: `${difficulty.color}15`, color: difficulty.color }">
          点击挑战
        </span>
      </div>
      
      <!-- 锁定状态 -->
      <div v-else class="flex items-center gap-1.5 mt-1 text-gray-400">
        <Lock :size="12" />
        <span class="text-xs">完成上一关解锁</span>
      </div>
    </div>

    <!-- 右侧箭头 -->
    <div 
      class="flex-shrink-0 transition-transform duration-200"
      :class="isLocked ? 'opacity-30' : 'group-hover:translate-x-1'"
    >
      <ChevronRight :size="20" class="text-gray-300" />
    </div>
  </div>
</template>

<style scoped>
.touch-feedback {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>
