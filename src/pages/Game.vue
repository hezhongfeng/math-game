<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, RotateCcw, Check } from 'lucide-vue-next'
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
const questionKey = ref(0)
const isLoading = ref(true)

// 防抖控制 - 防止快速连击
const lastInputTime = ref(0)
const lastSubmitTime = ref(0)
const INPUT_DEBOUNCE = 100 // 输入防抖 100ms
const SUBMIT_DEBOUNCE = 300 // 提交防抖 300ms

// 当前题目计时器
const questionTimer = ref(0)
let questionStartTime = null
let timerInterval = null

// 游戏时间更新器
const gameTime = ref(0)
let gameStartTime = null
let gameTimeInterval = null

const isComplete = computed(() => game.isComplete.value)
const currentQuestion = computed(() => game.currentQuestion.value)
const isCorrect = computed(() => currentQuestion.value?.isCorrect === true)
const isIncorrect = computed(() => currentQuestion.value?.isCorrect === false)
const shouldShowFeedback = computed(() => showAnswer.value && currentQuestion.value?.userAnswer !== null)

// 触发触觉反馈（振动）
function triggerHapticFeedback() {
  if (navigator.vibrate) {
    navigator.vibrate(50)
  }
}

// 启动游戏时间更新器 - 使用 Date.now() 避免 setInterval 漂移
function startGameTimeUpdater() {
  gameStartTime = Date.now()
  gameTime.value = 0
  if (gameTimeInterval) {
    clearInterval(gameTimeInterval)
  }
  gameTimeInterval = setInterval(() => {
    gameTime.value = Math.floor((Date.now() - gameStartTime) / 1000)
  }, 200) // 200ms 更新一次，确保流畅且精准
}

// 停止游戏时间更新器
function stopGameTimeUpdater() {
  if (gameTimeInterval) {
    clearInterval(gameTimeInterval)
    gameTimeInterval = null
  }
}

// 启动题目计时器 - 使用 Date.now() 避免 setInterval 漂移
function startQuestionTimer() {
  questionStartTime = Date.now()
  questionTimer.value = 0
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  timerInterval = setInterval(() => {
    questionTimer.value = Math.floor((Date.now() - questionStartTime) / 1000)
  }, 200) // 200ms 更新一次，确保流畅且精准
}

// 停止题目计时器
function stopQuestionTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// 初始化游戏 - 带加载状态
async function initGame() {
  isLoading.value = true
  
  // 模拟加载延迟，让用户体验更流畅
  await new Promise(resolve => setTimeout(resolve, 300))
  
  game.startGame()
  startQuestionTimer()
  startGameTimeUpdater()
  
  isLoading.value = false
}

// 提交答案 - 带防抖
function submitAnswer() {
  if (isWaiting.value || !userAnswer.value) return
  const now = Date.now()
  if (now - lastSubmitTime.value < SUBMIT_DEBOUNCE) return
  lastSubmitTime.value = now

  const answer = parseInt(userAnswer.value)
  const correct = game.submitAnswer(answer)

  showAnswer.value = true
  isWaiting.value = true

  // 播放反馈音效
  if (correct) {
    playSound('correct')
  } else {
    playSound('wrong')
  }

  // 触发触觉反馈
  triggerHapticFeedback()

  // 正确反馈：延迟后自动进入下一题
  // 错误反馈：点击任意位置关闭
  if (correct) {
    setTimeout(() => {
      if (game.currentIndex.value >= game.questions.value.length - 1) {
        showAnswer.value = false
        isWaiting.value = false
        handleGameComplete()
      } else {
        questionKey.value++
        userAnswer.value = ''
        showAnswer.value = false
        isWaiting.value = false
        game.nextQuestion()
        startQuestionTimer() // 重置题目计时器
      }
    }, GAME_CONFIG.FEEDBACK_DELAY)
  }
}

// 处理输入 - 带防抖
function handleInput(num) {
  if (isWaiting.value) return
  const now = Date.now()
  if (now - lastInputTime.value < INPUT_DEBOUNCE) return
  lastInputTime.value = now
  if (userAnswer.value.length < GAME_CONFIG.MAX_ANSWER_LENGTH) {
    userAnswer.value += num
  }
}

// 处理删除 - 带防抖
function handleDelete() {
  if (isWaiting.value) return
  const now = Date.now()
  if (now - lastInputTime.value < INPUT_DEBOUNCE) return
  lastInputTime.value = now
  userAnswer.value = userAnswer.value.slice(0, -1)
}

// 点击反馈遮罩处理
function handleFeedbackClick() {
  // 只有错误答题时才允许点击关闭，正确答题由自动延迟处理
  if (!isCorrect.value) {
    showAnswer.value = false
    isWaiting.value = false
    if (game.currentIndex.value >= game.questions.value.length - 1) {
      handleGameComplete()
    } else {
      questionKey.value++
      userAnswer.value = ''
      game.nextQuestion()
      startQuestionTimer() // 重置题目计时器
    }
  }
}

// 游戏完成处理
function handleGameComplete() {
  stopQuestionTimer() // 停止题目计时器
  stopGameTimeUpdater() // 停止游戏时间更新器
  game.completeGame()  // 先设置结束时间
  const result = game.getResult()
  const best = updateBestScore(parseInt(props.id), result)

  playSound('win')

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
  userAnswer.value = ''  // 重置用户输入
  showAnswer.value = false  // 重置答案显示状态
  isWaiting.value = false  // 重置等待状态
  questionKey.value = 0    // 重置题目key确保重新渲染
  stopQuestionTimer()      // 停止计时器
  stopGameTimeUpdater()    // 停止游戏时间更新器
  initGame()
}

function handleHome() {
  playSound('click')
  showModal.value = false
  router.push('/difficulty')
}

// 键盘事件处理器 - 提取为命名函数便于清理
function handleKeyPress(e) {
  if (e.key >= '0' && e.key <= '9') {
    handleInput(parseInt(e.key))
  } else if (e.key === 'Backspace') {
    handleDelete()
  } else if (e.key === 'Enter') {
    submitAnswer()
  }
}

onMounted(() => {
  settingsStore.loadSettings()
  initGame()
  window.addEventListener('keydown', handleKeyPress)
})

// onUnmounted 应该在顶层，不嵌套在 onMounted 内
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  stopQuestionTimer() // 清理计时器
  stopGameTimeUpdater() // 清理游戏时间更新器
  settingsStore.saveSettings()
})
</script>

<template>
  <div class="page">
    <!-- 加载状态 -->
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text text-child-base">加载中...</p>
      </div>
    </Transition>

    <!-- 顶部导航 -->
    <header class="header">
      <button class="nav-btn" @click="goBack">
        <ArrowLeft :size="22" />
      </button>

      <div class="title-group">
        <h2 class="title text-child-xl">{{ difficulty.name }}</h2>
        <p class="subtitle text-child-sm">{{ difficulty.description }}</p>
      </div>

      <button class="nav-btn nav-btn-accent" @click="handleRetry" title="重新开始">
        <RotateCcw :size="20" />
      </button>
    </header>

    <!-- 题目卡片区 -->
    <main class="main">
      <Transition name="question">
        <QuestionCard
          v-if="game.currentQuestion.value"
          :key="questionKey"
          :question="game.currentQuestion.value"
          :show-answer="showAnswer"
          :user-answer="userAnswer"
          :current-index="game.currentIndex.value"
          :total-questions="game.questions.value.length"
          :question-timer="questionTimer"
          @submit="submitAnswer"
        />
      </Transition>

      <!-- 答题反馈遮罩 -->
      <Transition name="feedback">
        <div v-if="shouldShowFeedback" class="feedback-container" @click="handleFeedbackClick">
          <div class="feedback-overlay" :class="{ correct: isCorrect, wrong: isIncorrect }">
            <div v-if="isCorrect" class="success-circle">
              <Check :size="40" />
            </div>
            <div v-else-if="isIncorrect" class="answer-number text-child-3xl">{{ currentQuestion.answer }}</div>
            <div v-if="isIncorrect" class="hint-text text-child-sm">点击继续</div>
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
        :duration="gameTime"
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
  background: linear-gradient(180deg, var(--game-bg-light) 0%, var(--game-bg) 50%, var(--game-bg-dark) 100%);
  display: flex;
  flex-direction: column;
  padding: 12px 12px 20px;
  touch-action: manipulation;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  position: relative;
}

.numpad-section {
  margin: 8px 0;
}

.footer {
  margin-top: auto;
}

/* 顶部导航 */
.header {
  position: sticky;
  top: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.08);
  margin: 0 4px 12px;
  padding-top: max(10px, env(safe-area-inset-top));
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--game-bg-light);
  color: var(--game-text-secondary);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: var(--game-bg);
  color: var(--game-primary-dark);
}

.nav-btn:active {
  transform: scale(0.95);
}

.nav-btn-accent {
  background: linear-gradient(135deg, var(--game-accent) 0%, var(--game-accent-dark) 100%);
  color: white;
}

.nav-btn-accent:hover {
  background: linear-gradient(135deg, var(--game-accent-light) 0%, var(--game-accent) 100%);
}

.title-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  font-weight: 700;
  color: var(--game-text);
  letter-spacing: 0.5px;
}

.subtitle {
  color: var(--game-text-secondary);
  margin-top: 2px;
  font-weight: 500;
}

/* 题目切换 - 从下方快速滚入 */
.question-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.question-enter-from {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
}

/* 反馈容器 */
.feedback-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
}

/* 反馈弹窗 */
.feedback-overlay {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  z-index: 9999;
  background: var(--game-bg-light);
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow:
    0 4px 0 0 rgba(0, 0, 0, 0.06),
    0 16px 40px rgba(0, 0, 0, 0.15);
}

.feedback-overlay.correct {
  border: 2px solid var(--game-success);
}

.feedback-overlay.wrong {
  border: 2px solid var(--game-warning);
  cursor: pointer;
}

/* 成功圆圈 */
.success-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--game-success) 0%, var(--game-success-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: circlePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 4px 0 0 rgba(56, 158, 13, 0.4),
    0 8px 20px rgba(82, 196, 26, 0.35);
}

.success-circle svg {
  color: white;
  width: 32px;
  height: 32px;
}

@keyframes circlePop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 答案数字 - 错误反馈 */
.answer-number {
  font-weight: 800;
  color: var(--game-warning);
  line-height: 1;
  text-align: center;
}

/* 点击提示文字 */
.hint-text {
  color: var(--game-warning-dark);
  font-weight: 600;
  background: rgba(212, 130, 13, 0.12);
  padding: 6px 14px;
  border-radius: 16px;
}

/* 反馈过渡 - 流畅衔接 */
.feedback-enter-active .feedback-container {
  transition: opacity 0.2s ease-out;
}

.feedback-leave-active .feedback-container {
  transition: opacity 0.2s ease-out;
}

.feedback-enter-from .feedback-container {
  opacity: 0;
}

.feedback-leave-to .feedback-container {
  opacity: 0;
}

.feedback-enter-active .feedback-overlay {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feedback-leave-active .feedback-overlay {
  transition: all 0.2s ease-out;
}

.feedback-enter-from .feedback-overlay {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.feedback-leave-to .feedback-overlay {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  gap: 16px;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 4px solid transparent;
  border-top-color: var(--game-primary);
  border-radius: 50%;
  /* 加载动画可以无限循环，因为它是功能性的 */
  animation: spin 1s linear infinite;
}

/* 减少动画偏好 - 静态显示 */
@media (prefers-reduced-motion: reduce) {
  .spinner-ring {
    animation: none;
    border: 4px solid var(--game-primary);
    opacity: 0.6;
  }
}

.spinner-ring:nth-child(1) {
  animation-duration: 1s;
}

.spinner-ring:nth-child(2) {
  animation-duration: 1.2s;
  animation-direction: reverse;
  border-top-color: var(--game-success);
  inset: 8px;
}

.spinner-ring:nth-child(3) {
  animation-duration: 0.8s;
  border-top-color: var(--game-accent);
  inset: 16px;
}

.loading-text {
  color: var(--game-text-secondary);
  font-weight: 600;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
