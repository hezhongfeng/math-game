<script setup>
import { computed, onMounted, onUnmounted, watch, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { X, Home, Volume2, VolumeX, RotateCcw } from 'lucide-vue-next'
import { getDifficultyById } from '../config/difficulty'
import { useGame } from '../composables/useGame'
import { useStorage } from '../composables/useStorage'
import { useSpeech } from '../composables/useSpeech'
import QuestionCard from '../components/QuestionCard.vue'
import ScoreBoard from '../components/ScoreBoard.vue'
import NumberPad from '../components/NumberPad.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const difficulty = getDifficultyById(parseInt(props.id))
const { updateBestScore } = useStorage()
const { speak, speakQuestion, speakCorrect, speakIncorrect, speakEncouragement, isSupported, isEnabled, toggle } = useSpeech()

// 游戏状态
const game = useGame(difficulty)
const showAnswer = ref(false)
const feedbackMessage = ref('')
const isWaiting = ref(false)
const userAnswer = ref('')

const isComplete = computed(() => game.isComplete.value)

// 初始化游戏
function initGame() {
  game.startGame()
  if (isSupported() && isEnabled.value) {
    nextTick(() => {
      speakQuestion(game.currentQuestion.value)
    })
  }
}

// 提交答案
function submitAnswer() {
  if (isWaiting.value || !userAnswer.value) return
  
  const answer = parseInt(userAnswer.value)
  const isCorrect = game.submitAnswer(answer)
  
  showAnswer.value = true
  isWaiting.value = true
  
  if (isCorrect) {
    feedbackMessage.value = '正确！'
    if (isSupported() && isEnabled.value) {
      speakCorrect()
    }
  } else {
    feedbackMessage.value = '错误！'
    if (isSupported() && isEnabled.value) {
      speakIncorrect(game.currentQuestion.value.answer)
    }
  }
  
  // 延迟后进入下一题
  setTimeout(() => {
    if (isComplete.value) {
      handleGameComplete()
    } else {
      showAnswer.value = false
      feedbackMessage.value = ''
      userAnswer.value = ''
      isWaiting.value = false
      if (isSupported() && isEnabled.value) {
        speakQuestion(game.currentQuestion.value)
      }
    }
  }, 1500)
}

// 处理输入
function handleInput(num) {
  if (isWaiting.value) return
  if (userAnswer.value.length < 3) {
    userAnswer.value += num
  }
}

// 处理删除
function handleDelete() {
  if (isWaiting.value) return
  userAnswer.value = userAnswer.value.slice(0, -1)
}

// 游戏完成处理
function handleGameComplete() {
  const result = game.getResult()
  const isNewBest = updateBestScore(parseInt(props.id), result)
  
  if (isSupported() && isEnabled.value) {
    speakEncouragement(result.correctCount, result.totalCount)
  }
  
  // 跳转到结果页（使用弹窗方式）
  showResultModal(result, isNewBest)
}

// 显示结果弹窗
function showResultModal(result, isNewBest) {
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn'
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-md w-full animate-scaleIn shadow-2xl">
      <h2 class="text-3xl font-bold text-center mb-6">游戏结束！</h2>
      
      ${isNewBest ? '<div class="text-center mb-4"><span class="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold">🏆 新纪录！</span></div>' : ''}
      
      <div class="space-y-4 mb-6">
        <div class="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
          <span class="text-gray-600">得分</span>
          <span class="text-2xl font-bold text-indigo-600">${result.score}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-green-50 rounded-xl">
          <span class="text-gray-600">正确数</span>
          <span class="text-2xl font-bold text-green-600">${result.correctCount}/${result.totalCount}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
          <span class="text-gray-600">正确率</span>
          <span class="text-2xl font-bold text-blue-600">${result.accuracy}%</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
          <span class="text-gray-600">用时</span>
          <span class="text-xl font-bold text-orange-600">${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>
      
      <div class="flex gap-4">
        <button onclick="this.closest('.fixed').remove(); window.gameRetry();" class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all">
          再玩一次
        </button>
        <button onclick="this.closest('.fixed').remove(); window.gameHome();" class="flex-1 bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all">
          返回主页
        </button>
      </div>
    </div>
  `
  
  document.body.appendChild(modal)
  
  // 绑定全局函数
  window.gameRetry = () => {
    initGame()
  }
  
  window.gameHome = () => {
    router.push('/')
  }
}

// 返回主页
function goHome() {
  router.push('/')
}

// 重玩游戏
function replay() {
  initGame()
}

// 语音切换
function toggleSpeech() {
  toggle()
}

onMounted(() => {
  initGame()
  
  // 监听键盘输入
  const handleKeyPress = (e) => {
    if (e.key >= '0' && e.key <= '9') {
      handleInput(parseInt(e.key))
    } else if (e.key === 'Backspace') {
      handleDelete()
    } else if (e.key === 'Enter') {
      submitAnswer()
    }
  }
  
  window.addEventListener('keydown', handleKeyPress)
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })
})
</script>

<template>
  <div class="min-h-screen flex flex-col p-4 md:p-6 pb-8">
    <!-- 顶部导航 -->
    <div class="flex items-center justify-between mb-6">
      <button
        @click="goHome"
        class="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <X :size="24" class="text-gray-600" />
      </button>
      
      <div class="text-center">
        <h2 class="text-xl font-bold text-gray-800">{{ difficulty.name }}</h2>
        <p class="text-sm text-gray-500">{{ difficulty.description }}</p>
      </div>
      
      <button
        @click="toggleSpeech"
        class="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Volume2 v-if="isEnabled" :size="24" class="text-indigo-600" />
        <VolumeX v-else :size="24" class="text-gray-400" />
      </button>
    </div>
    
    <!-- 得分板 -->
    <div class="max-w-2xl mx-auto w-full mb-6">
      <ScoreBoard
        :score="game.score"
        :current-index="game.currentIndex"
        :total-questions="questions.value.length"
        :correct-count="game.correctCount"
        :duration="game.duration"
        :accuracy="game.accuracy"
      />
    </div>
    
    <!-- 题目卡片区 -->
    <div class="flex-1 flex flex-col items-center justify-center min-h-0">
      <QuestionCard
        v-if="game.currentQuestion"
        :question="game.currentQuestion"
        :show-answer="showAnswer"
        @speak="speakQuestion"
      />
      
      <!-- 用户答案显示 -->
      <div v-if="userAnswer && !showAnswer" class="mt-6 text-center">
        <p class="text-gray-500 text-sm mb-2">你的答案</p>
        <p class="text-4xl md:text-6xl font-bold text-indigo-600">{{ userAnswer }}</p>
      </div>
      
      <!-- 反馈消息 -->
      <div v-if="feedbackMessage" class="mt-6">
        <p 
          class="text-2xl md:text-4xl font-bold animate-scaleIn"
          :class="feedbackMessage === '正确！' ? 'text-green-500' : 'text-red-500'"
        >
          {{ feedbackMessage }}
        </p>
      </div>
    </div>
    
    <!-- 数字键盘 -->
    <div class="max-w-md mx-auto w-full mt-6">
      <NumberPad
        :disabled="isWaiting || isComplete"
        @input="handleInput"
        @delete="handleDelete"
        @submit="submitAnswer"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
