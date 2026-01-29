<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, RotateCcw, Check, Star } from 'lucide-vue-next'
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
import TouchOptimizedButton from '../components/TouchOptimizedButton.vue'

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

// 当前题目计时器
const questionTimer = ref(0)
let timerInterval = null

// 游戏时间更新器
const gameTime = ref(0)
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

// 启动游戏时间更新器
function startGameTimeUpdater() {
  gameTime.value = 0
  if (gameTimeInterval) {
    clearInterval(gameTimeInterval)
  }
  gameTimeInterval = setInterval(() => {
    gameTime.value++
  }, 1000)
}

// 停止游戏时间更新器
function stopGameTimeUpdater() {
  if (gameTimeInterval) {
    clearInterval(gameTimeInterval)
    gameTimeInterval = null
  }
}

// 启动题目计时器
function startQuestionTimer() {
  questionTimer.value = 0
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  timerInterval = setInterval(() => {
    questionTimer.value++
  }, 1000)
}

// 停止题目计时器
function stopQuestionTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// 初始化游戏
function initGame() {
  game.startGame()
  startQuestionTimer()
  startGameTimeUpdater()
}

// 提交答案
function submitAnswer() {
  if (isWaiting.value || !userAnswer.value) return

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

// 点击错误反馈关闭
function handleWrongFeedbackClick() {
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
    <!-- 顶部导航 -->
    <header class="header">
      <TouchOptimizedButton
        size="small"
        variant="secondary"
        :icon="ArrowLeft"
        :icon-size="20"
        @click="goBack"
      />

      <div class="title-group">
        <h2 class="title font-child-friendly bg-gradient-to-r from-peppa-blue to-peppa-blue-dark bg-clip-text text-transparent">
          {{ difficulty.name }}
        </h2>
        <p class="subtitle font-child-friendly">{{ difficulty.description }}</p>
      </div>

      <TouchOptimizedButton
        size="small"
        variant="playful"
        :icon="RotateCcw"
        :icon-size="20"
        @click="handleRetry"
        title="重新开始"
      />
    </header>

    <!-- 题目卡片区 -->
    <main class="main">
      <Transition name="question" mode="out-in">
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
        <div v-if="shouldShowFeedback" class="feedback-container" @click="handleWrongFeedbackClick">
          <div class="feedback-overlay" :class="{ correct: isCorrect, wrong: isIncorrect }">
            <div v-if="isCorrect" class="success-circle">
              <Check :size="40" />
            </div>
            <div v-else-if="isIncorrect" class="answer-number">{{ currentQuestion.answer }}</div>
            <div v-if="isIncorrect" class="hint-text">点击继续</div>
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
  background: linear-gradient(180deg, #FFF8E1 0%, #E0F7FA 40%, #F3E5F5 100%);
  display: flex;
  flex-direction: column;
  padding: 12px 12px 24px;
  touch-action: manipulation;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
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
  margin: 12px 0;
}

.footer {
  margin-top: auto;
}

/* 顶部导航 - 毛玻璃效果 */
.header {
  position: sticky;
  top: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow:
    0 4px 0 0 rgba(0, 0, 0, 0.05),
    0 8px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.5);
  margin: 0 8px 16px;
  padding-top: max(12px, env(safe-area-inset-top));
}

.title-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, #FF8A80, #4FC3F7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 12px;
  color: #78909C;
  margin-top: 4px;
  font-weight: 500;
}

/* 题目切换 - 弹性弹入 */
.question-leave-active {
  transition: all 0.35s ease;
}

.question-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.9);
}

.question-leave-to {
  opacity: 0;
  transform: translateY(-40px) scale(0.9);
}

.question-enter-active {
  animation: questionBounce 0.5s ease-out;
}

@keyframes questionBounce {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  60% {
    transform: translateY(-12px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 反馈容器 */
.feedback-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
}

/* 反馈弹窗 - 立体风格 */
.feedback-overlay {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 9999;
  background: #ffffff;
  border-radius: 32px;
  padding: 32px 28px;
  box-shadow:
    0 8px 0 0 rgba(0, 0, 0, 0.08),
    0 20px 50px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.feedback-overlay.correct {
  border-color: rgba(129, 199, 132, 0.5);
  background: linear-gradient(180deg, #ffffff 0%, #F1F8E9 100%);
}

.feedback-overlay.wrong {
  border-color: rgba(255, 183, 77, 0.5);
  cursor: pointer;
  background: linear-gradient(180deg, #ffffff 0%, #FFF3E0 100%);
}

/* 成功圆圈 - 弹性动画 */
.success-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: circlePop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow:
    0 6px 0 0 #4CAF50,
    0 10px 30px rgba(102, 187, 106, 0.4);
}

.success-circle svg {
  color: white;
  width: 44px;
  height: 44px;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

@keyframes circlePop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 答案数字 - 错误反馈 */
.answer-number {
  font-size: 56px;
  font-weight: 800;
  color: #FF8A65;
  line-height: 1;
  text-align: center;
  text-shadow: 0 2px 4px rgba(255, 138, 101, 0.3);
}

/* 点击提示文字 */
.hint-text {
  font-size: 14px;
  color: #FF8A65;
  font-weight: 600;
  background: rgba(255, 138, 101, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
}

/* 反馈过渡 - 遮罩和弹窗统一动画 */
.feedback-enter-active .feedback-container {
  transition: opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.feedback-leave-active .feedback-container {
  transition: opacity 0.25s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.feedback-enter-from .feedback-container {
  opacity: 0;
}

.feedback-leave-to .feedback-container {
  opacity: 0;
}

/* 弹窗内容动画 */
.feedback-enter-active .feedback-overlay {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feedback-leave-active .feedback-overlay {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.feedback-enter-from .feedback-overlay {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
}

.feedback-leave-to .feedback-overlay {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.85);
}
</style>
