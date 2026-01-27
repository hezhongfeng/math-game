<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
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

// 初始化游戏
function initGame() {
  game.startGame()
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
  }
}

// 游戏完成处理
function handleGameComplete() {
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
  initGame()
}

function handleHome() {
  playSound('click')
  showModal.value = false
  router.push('/difficulty')
}

onMounted(() => {
  settingsStore.loadSettings()
  initGame()

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
      </button>

      <div class="title-group">
        <h2 class="title bg-gradient-to-r from-peppa-blue to-peppa-blue-dark bg-clip-text text-transparent">
          {{ difficulty.name }}
        </h2>
        <p class="subtitle">{{ difficulty.description }}</p>
      </div>

      <button @click="handleRetry" class="retry-btn" title="重新开始">
        <RotateCcw :size="24" />
      </button>
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
          @submit="submitAnswer"
        />
      </Transition>

      <!-- 答题反馈 -->
      <Transition name="feedback">
        <div v-if="shouldShowFeedback && isCorrect" class="feedback-overlay correct">
          <div class="success-circle">
            <div class="green-ring"></div>
            <div class="ripple-green ripple-1"></div>
            <div class="ripple-green ripple-2"></div>
            <div class="circle-bg">
              <Check :size="40" />
            </div>
          </div>
        </div>
        <div v-else-if="shouldShowFeedback && isIncorrect" class="feedback-overlay wrong" @click="handleWrongFeedbackClick">
          <div class="error-circle">
            <div class="orange-ring"></div>
            <div class="ripple-orange ripple-1"></div>
            <div class="ripple-orange ripple-2"></div>
            <div class="circle-bg-error">
              <span class="error-icon">✕</span>
            </div>
          </div>
          <div class="answer-card">
            <span class="answer-label">正确答案</span>
            <span class="answer-number">{{ currentQuestion.answer }}</span>
          </div>
          <div class="hint-text">点击任意位置继续</div>
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
  background: linear-gradient(180deg, #E3F2FD 0%, #F5F9FF 50%, #E8F5E9 100%);
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

/* 顶部导航 */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%);
  border-radius: 20px;
  box-shadow: 
    0 4px 20px rgba(74, 144, 226, 0.15),
    0 2px 8px rgba(74, 144, 226, 0.08);
  margin: 0 12px 12px;
  padding-top: max(10px, env(safe-area-inset-top));
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #4A90E2;
  background: linear-gradient(135deg, #e0efff 0%, #f0f7ff 100%);
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.back-btn:active {
  background: #d0e4ff;
}

.back-btn span {
  font-size: 14px;
}

.title-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  font-size: 18px;
  font-weight: 800;
  font-family: inherit;
  color: #1e3a5f;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 11px;
  color: #5a7a9a;
  font-family: inherit;
  margin-top: 2px;
}

.retry-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #4A90E2;
  background: linear-gradient(135deg, #e0efff 0%, #f0f7ff 100%);
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.retry-btn:active {
  background: #d0e4ff;
}

.retry-btn svg {
  width: 20px;
  height: 20px;
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

/* 反馈层 */
.feedback-overlay {
  position: fixed;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  z-index: 9999;
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.feedback-overlay.correct {
  box-shadow: 0 12px 40px rgba(76, 175, 80, 0.25);
}

.feedback-overlay.wrong {
  box-shadow: 0 12px 40px rgba(255, 152, 0, 0.25);
  cursor: pointer;
}

/* 成功圆圈 */
.success-circle {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.green-ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 4px solid #66BB6A;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.circle-bg {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #4CAF50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 25px rgba(76, 175, 80, 0.45),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  animation: circlePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.circle-bg svg {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

@keyframes circlePop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 绿色涟漪 */
.ripple-green {
  position: absolute;
  border-radius: 50%;
  border: 4px solid #4CAF50;
  opacity: 0;
}

.ripple-green.ripple-1 {
  inset: -25px;
  animation: rippleExpand 1.2s ease-out 0.2s;
}

.ripple-green.ripple-2 {
  inset: -45px;
  border-color: #66BB6A;
  animation: rippleExpand 1.2s ease-out 0.5s;
}

@keyframes rippleExpand {
  0% {
    transform: scale(0.9);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* 错误圆圈 */
.error-circle {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orange-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 4px solid #FFB74D;
  animation: orangeRingPulse 2s ease-in-out infinite;
}

@keyframes orangeRingPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.circle-bg-error {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 50%, #FF9800 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 6px 20px rgba(255, 152, 0, 0.4),
    inset 0 2px 8px rgba(255, 255, 255, 0.3);
  animation: errorPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes errorPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.error-icon {
  color: white;
  font-size: 40px;
  font-weight: bold;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* 橙色涟漪 */
.ripple-orange {
  position: absolute;
  border-radius: 50%;
  border: 3px solid #FF9800;
  opacity: 0;
}

.ripple-orange.ripple-1 {
  inset: -15px;
  animation: rippleExpand 1.2s ease-out 0.2s;
}

.ripple-orange.ripple-2 {
  inset: -38px;
  border-color: #FFB74D;
  animation: rippleExpand 1.2s ease-out 0.5s;
}

/* 正确答案卡片 */
.answer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 32px 48px;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  border-radius: 24px;
  border: 4px solid #FFD54F;
  min-width: 180px;
}

.answer-label {
  font-size: 16px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.2;
}

.answer-number {
  font-size: 56px;
  font-weight: 800;
  color: #E65100;
  line-height: 1.2;
}

/* 点击提示文字 */
.hint-text {
  font-size: 12px;
  color: #999;
  letter-spacing: 1px;
  animation: hintPulse 1.5s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* 反馈层过渡 */
.feedback-enter-active {
  transition: all 0.4s ease;
}

.feedback-leave-active {
  transition: all 0.25s ease;
}

.feedback-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.7);
}

.feedback-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.85);
}
</style>
