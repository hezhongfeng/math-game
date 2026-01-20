<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, RotateCcw } from 'lucide-vue-next'
import { getDifficultyById } from '../config/difficulty'
import { GAME_CONFIG } from '../config/constants'
import { useGame } from '../composables/useGame'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { useSettingsStore } from '../stores/settings'
import QuestionCard from '../components/QuestionCard.vue'
import ScoreBoard from '../components/ScoreBoard.vue'
import NumberPad from '../components/NumberPad.vue'
import ResultModal from '../components/ResultModal.vue'
import SettingsPanel from '../components/SettingsPanel.vue'
import BackgroundMusic from '../components/BackgroundMusic.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const difficulty = getDifficultyById(parseInt(props.id))
const settingsStore = useSettingsStore()
const { updateBestScore } = useStorage()
const { playSound } = useSound()

// 游戏状态
const game = useGame(difficulty)
const showAnswer = ref(false)
const isWaiting = ref(false)
const userAnswer = ref('')
const showModal = ref(false)
const resultData = ref(null)
const isNewBest = ref(false)

const questionKey = ref(0) // 用于强制重新渲染题目卡片

const isComplete = computed(() => game.isComplete.value)

// 监听题目变化，更新 key
watch(() => game.currentIndex.value, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    questionKey.value++ // 切换题目时改变 key
    userAnswer.value = '' // 立即清空答案
    showAnswer.value = false // 隐藏答案反馈
    isWaiting.value = false // 取消等待状态
  }
})

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

  // 播放反馈音效（不播放点击音效）
  if (isCorrect) {
    playSound('correct')
  } else {
    playSound('wrong')
  }

  // 延迟后进入下一题
  setTimeout(() => {
    if (isComplete.value) {
      handleGameComplete()
    } else {
      // 切换到下一题（这会触发 watch，重置状态）
      game.nextQuestion()
    }
  }, GAME_CONFIG.FEEDBACK_DELAY)

  return isCorrect
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

// 返回难度选择
function goBack() {
  playSound('click')
  router.push('/difficulty')
}

function handleRetry() {
  playSound('click')
  showModal.value = false
  initGame()
}

function handleHome() {
  playSound('click')
  showModal.value = false
  router.push('/')
}

onMounted(() => {
  // 加载设置
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
  <div class="min-h-screen flex flex-col p-4 md:p-6 pb-8">
    <!-- 顶部导航 -->
    <div class="flex items-center justify-between mb-3">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-peppa-blue-dark hover:text-peppa-blue font-medium transition-colors font-rounded px-4 py-2 bg-white/80 backdrop-blur-sm rounded-cute-lg shadow-cute hover:shadow-cute-lg active:scale-95 transition-all border-4 border-peppa-blue-light/30 hover:border-peppa-blue-light/60"
      >
        <ArrowLeft :size="24" />
        返回
      </button>

      <div class="text-center">
        <h2 class="text-xl font-bold text-peppa-blue-dark font-rounded">{{ difficulty.name }}</h2>
        <p class="text-sm text-peppa-blue-dark/70 font-rounded">{{ difficulty.description }}</p>
      </div>

      <button
        @click="handleRetry"
        class="flex items-center gap-2 text-peppa-blue-dark hover:text-peppa-blue font-medium transition-colors font-rounded px-4 py-2 bg-white/80 backdrop-blur-sm rounded-cute-lg shadow-cute hover:shadow-cute-lg active:scale-95 transition-all border-4 border-peppa-blue-light/30 hover:border-peppa-blue-light/60"
        title="重新开始"
      >
        <RotateCcw :size="24" />
        重来
      </button>
    </div>

    <!-- 设置面板 -->
    <div class="flex justify-center mb-6">
      <SettingsPanel
        :sound-enabled="settingsStore.soundEnabled"
        :speech-enabled="settingsStore.speechEnabled"
        :music-enabled="settingsStore.musicEnabled"
        @toggle-sound="settingsStore.toggleSound"
        @toggle-speech="settingsStore.toggleSpeech"
        @toggle-music="settingsStore.toggleMusic"
      />
    </div>
    
    <!-- 背景音乐控制 -->
    <BackgroundMusic
      :enabled="settingsStore.musicEnabled"
      @toggle="settingsStore.toggleMusic"
      @volumeChange="settingsStore.setMusicVolume"
    />

    <!-- 题目卡片区 -->
    <div class="flex-1 flex flex-col items-center justify-center py-4">
      <Transition
        name="question"
        mode="out-in"
      >
        <QuestionCard
          v-if="game.currentQuestion.value"
          :key="questionKey"
          :question="game.currentQuestion.value"
          :show-answer="showAnswer"
          :user-answer="userAnswer"
          @submit="submitAnswer"
        />
      </Transition>
    </div>

    <!-- 数字键盘 -->
    <div class="max-w-md mx-auto w-full mb-4">
      <NumberPad
        :disabled="isWaiting || isComplete"
        @input="handleInput"
        @delete="handleDelete"
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

<style scoped>
.question-enter-active,
.question-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.question-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}
</style>

