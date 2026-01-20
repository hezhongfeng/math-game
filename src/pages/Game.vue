<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { getDifficultyById } from '../config/difficulty'
import { GAME_CONFIG, DECORATIONS } from '../config/constants'
import { useGame } from '../composables/useGame'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { useSettingsStore } from '../stores/settings'
import QuestionCard from '../components/QuestionCard.vue'
import ScoreBoard from '../components/ScoreBoard.vue'
import NumberPad from '../components/NumberPad.vue'
import ResultModal from '../components/ResultModal.vue'

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
const showModal = ref(false)
const resultData = ref(null)
const isNewBest = ref(false)

const decorations = DECORATIONS.game

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
  }, GAME_CONFIG.FEEDBACK_DELAY)
}

// 处理输入
function handleInput(num) {
  if (isWaiting.value) return
  if (userAnswer.value.length < GAME_CONFIG.MAX_ANSWER_LENGTH) {
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
  const best = updateBestScore(parseInt(props.id), result)

  // 播放胜利音效
  playSound('win')

  // 设置结果数据并显示弹窗
  resultData.value = result
  isNewBest.value = best
  showModal.value = true
}

function handleRetry() {
  showModal.value = false
  initGame()
}

function handleHome() {
  showModal.value = false
  router.push('/')
}

// 返回难度选择
function goBack() {
  router.push('/difficulty')
}

onMounted(() => {
  // 加载设置
  const settingsStore = useSettingsStore()
  settingsStore.loadSettings()

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
    // 保存设置
    settingsStore.saveSettings()
  })
})
</script>

<template>
  <div class="min-h-screen flex flex-col p-4 md:p-6 pb-8 relative overflow-hidden">
    <!-- 装饰背景元素 - 精简版 -->
    <div v-for="(deco, index) in decorations" :key="index"
         :class="['absolute decoration', deco.class]"
         :style="{ fontSize: `${deco.size}px`, opacity: 0.2 }">
      {{ deco.emoji }}
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

    <!-- 结果弹窗 -->
    <ResultModal
      v-if="resultData"
      :show="showModal"
      :result="resultData"
      :is-new-best="isNewBest"
      @retry="handleRetry"
      @home="handleHome"
    />
  </div>
</template>
