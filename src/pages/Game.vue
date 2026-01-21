<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, RotateCcw, Check, X, Sparkles } from 'lucide-vue-next'
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
const isCorrect = computed(() => game.currentQuestion.value?.isCorrect === true)
const isIncorrect = computed(() => game.currentQuestion.value?.isCorrect === false)
const shouldShowFeedback = computed(() => showAnswer.value && game.currentQuestion.value?.userAnswer !== null)

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
  <div class="page">
    <!-- 顶部导航 -->
    <header class="header">
      <button @click="goBack" class="back-btn">
        <ArrowLeft :size="22" />
        <span>返回</span>
      </button>

      <div class="title-group">
        <h2 class="title">{{ difficulty.name }}</h2>
        <p class="subtitle">{{ difficulty.description }}</p>
      </div>

      <button @click="handleRetry" class="retry-btn" title="重新开始">
        <RotateCcw :size="22" />
      </button>
    </header>

    <!-- 题目卡片区 -->
    <main class="main relative">
      <Transition name="question" mode="out-in">
        <QuestionCard
          v-if="game.currentQuestion.value"
          :key="questionKey"
          :question="game.currentQuestion.value"
          :show-answer="showAnswer"
          :user-answer="userAnswer"
          @submit="submitAnswer"
        />
      </Transition>

      <!-- 悬浮反馈动画 -->
      <Transition name="feedback">
        <div v-if="shouldShowFeedback && isCorrect" class="feedback-overlay">
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-peppa-green to-peppa-green-dark flex items-center justify-center shadow-cute-lg animate-bounce-happy">
              <Check :size="40" class="text-white" />
            </div>
            <p class="mt-3 text-2xl font-bold text-peppa-green font-rounded flex items-center gap-2">
              <Sparkles :size="24" class="animate-spin-slow" />
              太棒了！
              <Sparkles :size="24" class="animate-spin-slow" style="animation-delay: 0.3s" />
            </p>
          </div>
        </div>
        <div v-else-if="shouldShowFeedback && isIncorrect" class="feedback-overlay">
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-peppa-orange to-peppa-orange-dark flex items-center justify-center shadow-cute-lg animate-bounce-happy">
              <X :size="40" class="text-white" />
            </div>
            <p class="mt-3 text-xl font-bold text-peppa-orange font-rounded">
              再接再厉！
            </p>
            <p class="text-base text-gray-600 mt-1 font-rounded">
              正确答案是：<span class="text-peppa-blue-dark font-bold">{{ game.currentQuestion.value?.answer }}</span>
            </p>
          </div>
        </div>
      </Transition>
    </main>

    <!-- 数字键盘 -->
    <section class="numpad-section">
      <NumberPad
        :disabled="isWaiting || isComplete"
        @input="handleInput"
        @delete="handleDelete"
        @submit="submitAnswer"
      />
    </section>

    <!-- 得分板 -->
    <footer class="footer">
      <ScoreBoard
        :score="game.score.value"
        :current-index="game.currentIndex.value"
        :total-questions="game.questions.value.length"
        :correct-count="game.correctCount.value"
        :duration="game.duration.value"
        :accuracy="game.accuracy.value"
      />
    </footer>

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
.page {
  min-height: 100vh;
  background: #f0f7ff;
  display: flex;
  flex-direction: column;
  padding: 12px 12px 24px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: white;
  border-radius: 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #4A90E2;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.back-btn:active {
  background: #f0f7ff;
}

.title-group {
  text-align: center;
}

.title {
  font-size: 17px;
  font-weight: 700;
  color: #1e3a5f;
  font-family: inherit;
}

.subtitle {
  font-size: 12px;
  color: #5a7a9a;
  font-family: inherit;
}

.retry-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #4A90E2;
  background: #f0f7ff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.retry-btn:active {
  background: #e0efff;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.numpad-section {
  margin: 8px 0;
}

.footer {
  margin-top: auto;
}

.question-enter-active,
.question-leave-active {
  transition: all 0.25s ease;
}

.question-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.question-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}

/* 悬浮反馈动画 */
.feedback-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.feedback-enter-active,
.feedback-leave-active {
  transition: all 0.3s ease;
}

.feedback-enter-from,
.feedback-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>

