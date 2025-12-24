<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { getDifficultyById } from '../config/difficulty'
import { useGame } from '../composables/useGame'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
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
const { playSound } = useSound()

// 游戏状态
const game = useGame(difficulty)
const showAnswer = ref(false)
const feedbackMessage = ref('')
const isWaiting = ref(false)
const userAnswer = ref('')

// 调试代码已移除

const isComplete = computed(() => game.isComplete.value)

// 初始化游戏
function initGame() {
  game.startGame()
}

// 提交答案
function submitAnswer() {
  if (isWaiting.value || !userAnswer.value) return

  const answer = parseInt(userAnswer.value)
  const isCorrect = game.submitAnswer(answer)

  showAnswer.value = true
  isWaiting.value = true

  // 播放音效
  if (isCorrect) {
    feedbackMessage.value = '正确！'
    playSound('correct')
  } else {
    feedbackMessage.value = '错误！'
    playSound('wrong')
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

  // 播放胜利音效
  playSound('win')

  // 跳转到结果页（使用弹窗方式）
  showResultModal(result, isNewBest)
}

// 显示结果弹窗
function showResultModal(result, isNewBest) {
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn'
  modal.innerHTML = `
    <div class="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-cute-xl p-8 max-w-md w-full animate-scaleIn shadow-cute-lg border-4 border-peppa-blue-light">
      <div class="text-center mb-6">
        <div class="text-6xl mb-3 animate-bounce-happy">⚽</div>
        <h2 class="text-3xl font-bold text-peppa-blue-dark font-rounded mb-2">游戏结束！</h2>
        ${isNewBest ? '<div class="inline-block bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-lg shadow-cute mb-4">🏆 新纪录！</div>' : ''}
      </div>

      <div class="space-y-3 mb-6">
        <div class="flex justify-between items-center p-4 bg-white rounded-cute-lg border-3 border-peppa-blue-light shadow-cute">
          <span class="text-peppa-blue-dark font-rounded flex items-center gap-2">⭐ 得分</span>
          <span class="text-2xl font-bold text-peppa-blue-dark font-rounded">${result.score}</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-white rounded-cute-lg border-3 border-peppa-green shadow-cute">
          <span class="text-peppa-green-dark font-rounded flex items-center gap-2">✅ 正确数</span>
          <span class="text-2xl font-bold text-peppa-green font-rounded">${result.correctCount}/${result.totalCount}</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-white rounded-cute-lg border-3 border-peppa-cyan shadow-cute">
          <span class="text-peppa-cyan-dark font-rounded flex items-center gap-2">📊 正确率</span>
          <span class="text-2xl font-bold text-peppa-cyan font-rounded">${result.accuracy}%</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-white rounded-cute-lg border-3 border-peppa-yellow shadow-cute">
          <span class="text-peppa-yellow-dark font-rounded flex items-center gap-2">⏱️ 用时</span>
          <span class="text-xl font-bold text-peppa-yellow-dark font-rounded">${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div class="flex gap-3">
        <button onclick="this.closest('.fixed').remove(); window.gameRetry();" class="flex-1 bg-gradient-to-r from-peppa-blue to-peppa-blue-dark text-white font-bold py-4 px-6 rounded-cute-lg hover:from-peppa-blue-dark hover:to-[#2A70C2] transition-all shadow-cute hover:shadow-cute-lg active:scale-95 font-rounded text-lg">
          🔄 再玩一次
        </button>
        <button onclick="this.closest('.fixed').remove(); window.gameHome();" class="flex-1 bg-white text-peppa-blue-dark border-3 border-peppa-blue-light font-bold py-4 px-6 rounded-cute-lg hover:bg-[#E3F2FD]/30 transition-all shadow-cute hover:shadow-cute-lg active:scale-95 font-rounded text-lg">
          🏠 返回主页
        </button>
      </div>

      <div class="mt-4 text-center text-sm text-peppa-blue-dark/50 font-rounded">
        ⚽ 快乐学习数学 ⚽
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

// 返回难度选择
function goBack() {
  router.push('/difficulty')
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
  <div class="min-h-screen flex flex-col p-4 md:p-6 pb-8 relative overflow-hidden">
    <!-- 装饰背景元素 - 精简版 -->
    <div class="absolute top-8 right-8 text-peppa-yellow animate-float opacity-20 pointer-events-none text-4xl">
      ☀️
    </div>
    <div class="absolute bottom-32 left-8 text-peppa-green animate-float opacity-20 pointer-events-none text-2xl" style="animation-delay: 0.5s;">
      ⚽
    </div>

    <!-- 顶部导航 -->
    <div class="flex items-center justify-between mb-4 relative z-10">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-peppa-blue-dark hover:text-peppa-blue font-medium transition-colors font-rounded px-4 py-2 bg-white/60 backdrop-blur-sm rounded-cute-lg shadow-cute hover:shadow-cute-lg hover:scale-105 transition-all"
      >
        <ArrowLeft :size="24" />
        返回
      </button>

      <div class="text-center">
        <div class="text-2xl mb-1 animate-float">⚽</div>
        <h2 class="text-lg font-bold text-peppa-blue-dark font-rounded">{{ difficulty.name }}</h2>
        <p class="text-xs text-peppa-blue-dark/70 font-rounded">{{ difficulty.description }}</p>
      </div>

      <div class="w-24"></div>
    </div>

    <!-- 题目卡片区 -->
    <div class="flex-1 flex flex-col items-center justify-center py-2 relative z-10">
      <!-- 正确/错误反馈动画区 -->
      <div v-if="feedbackMessage" class="mb-4 relative">
        <div
          class="relative z-10 text-6xl font-bold rounded-full p-3 transition-all duration-300"
          :class="feedbackMessage === '正确！' ? 'animate-correct-pop animate-correct-glow text-white bg-gradient-to-br from-peppa-green to-[#388E3C]' : 'animate-wrong-shake animate-wrong-glow text-white bg-gradient-to-br from-peppa-orange to-[#E65100]'"
        >
          {{ feedbackMessage === '正确！' ? '✓' : '✗' }}
        </div>
      </div>

      <QuestionCard
        v-if="game.currentQuestion.value"
        :question="game.currentQuestion.value"
        :show-answer="showAnswer"
      />

      <!-- 答案输入框 -->
      <div v-if="!showAnswer" class="w-full max-w-xs mt-3">
        <div class="rounded-cute-xl shadow-cute-lg p-4 border-4 border-white bg-transparent">
          <!-- 答案显示区 -->
          <div class="rounded-cute-lg p-4 h-[60px] flex items-center justify-center bg-transparent">
            <span v-if="userAnswer" class="text-5xl font-bold text-peppa-blue-dark font-rounded animate-pop">
              {{ userAnswer }}
            </span>
            <span v-else class="text-2xl text-peppa-blue-dark/40 font-rounded">
              请输入答案
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 数字键盘 -->
    <div class="max-w-md mx-auto w-full mb-4 relative z-10">
      <NumberPad
        :disabled="isWaiting.value || isComplete"
        @input="handleInput"
        @delete="handleDelete"
        @submit="submitAnswer"
      />
    </div>

    <!-- 得分板 -->
    <div class="max-w-2xl mx-auto w-full relative z-10">
      <ScoreBoard
        :score="game.score.value"
        :current-index="game.currentIndex.value"
        :total-questions="game.questions.value.length"
        :correct-count="game.correctCount.value"
        :duration="game.duration.value"
        :accuracy="game.accuracy.value"
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
