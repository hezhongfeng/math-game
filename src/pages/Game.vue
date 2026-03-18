<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle, ArrowLeft, CheckCircle2, RotateCcw, Star } from 'lucide-vue-next'
import { getDifficultyById } from '../config/difficulty'
import { GAME_CONFIG } from '../config/constants'
import { useGame } from '../composables/useGame'
import { useStorage } from '../composables/useStorage'
import { useToast } from '../composables/useToast'
import { useSound } from '../composables/useSound'
import { getStarCount } from '../utils/stars'
import NumberPad from '../components/NumberPad.vue'
import QuestionCard from '../components/QuestionCard.vue'
import ResultModal from '../components/ResultModal.vue'
import ScoreBoard from '../components/ScoreBoard.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const difficulty = getDifficultyById(parseInt(props.id))

if (!difficulty) {
  router.replace('/difficulty')
}

const { updateBestScore } = useStorage()
const { error: showError } = useToast()
const {
  playCorrect,
  playWrong,
  playVictory,
  playUnlock,
  playBack,
  playKeyPress,
  playDelete,
  playSubmit
} = useSound()

const game = useGame(difficulty)
const showAnswer = ref(false)
const isWaiting = ref(false)
const userAnswer = ref('')
const showModal = ref(false)
const resultData = ref(null)
const isNewBest = ref(false)
const questionKey = ref(0)
const isLoading = ref(true)
const currentFeedbackState = ref('idle')
const streakCount = ref(0)
const showStreakReward = ref(false)
const streakRewardText = ref('')

const lastInputTime = ref(0)
const lastSubmitTime = ref(0)
const INPUT_DEBOUNCE = 100
const SUBMIT_DEBOUNCE = 300

const questionTimer = ref(0)
let questionStartTime = null
let timerInterval = null

const gameTime = ref(0)
let gameStartTime = null
let gameTimeInterval = null

let feedbackTimeout = null
let streakRewardTimeout = null

const isComplete = computed(() => game.isComplete.value)
const currentQuestion = computed(() => game.currentQuestion.value)
const isCorrect = computed(() => currentQuestion.value?.isCorrect === true)
const isIncorrect = computed(() => currentQuestion.value?.isCorrect === false)
const shouldShowFeedback = computed(() => showAnswer.value && currentQuestion.value?.userAnswer !== null)

function triggerHapticFeedback(level = 'medium') {
  if (navigator.vibrate) {
    if (level === 'light') {
      navigator.vibrate(20)
      return
    }

    if (level === 'strong') {
      navigator.vibrate([28, 20, 32])
      return
    }

    if (level === 'error') {
      navigator.vibrate([24, 24, 24])
      return
    }

    navigator.vibrate(50)
  }
}

function startGameTimeUpdater() {
  gameStartTime = Date.now()
  gameTime.value = 0

  if (gameTimeInterval) {
    clearInterval(gameTimeInterval)
  }

  gameTimeInterval = setInterval(() => {
    gameTime.value = Math.floor((Date.now() - gameStartTime) / 1000)
  }, 200)
}

function stopGameTimeUpdater() {
  if (gameTimeInterval) {
    clearInterval(gameTimeInterval)
    gameTimeInterval = null
  }
}

function startQuestionTimer() {
  questionStartTime = Date.now()
  questionTimer.value = 0

  if (timerInterval) {
    clearInterval(timerInterval)
  }

  timerInterval = setInterval(() => {
    questionTimer.value = Math.floor((Date.now() - questionStartTime) / 1000)
  }, 200)
}

function stopQuestionTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

async function initGame() {
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 240))
  game.startGame()
  startQuestionTimer()
  startGameTimeUpdater()
  isLoading.value = false
}

function submitAnswer() {
  if (isWaiting.value || !userAnswer.value || userAnswer.value.trim() === '') {
    showError('请先输入答案')
    return
  }

  const now = Date.now()
  if (now - lastSubmitTime.value < SUBMIT_DEBOUNCE) return
  lastSubmitTime.value = now

  const answer = parseInt(userAnswer.value)
  const correct = game.submitAnswer(answer)

  showAnswer.value = true
  isWaiting.value = true
  playSubmit()

  if (correct) {
    streakCount.value += 1
    triggerStreakReward()
    triggerHapticFeedback('strong')
    playCorrect()
  } else {
    streakCount.value = 0
    showStreakReward.value = false
    triggerHapticFeedback('error')
    playWrong()
  }

  if (correct) {
    currentFeedbackState.value = 'correct-auto'
    feedbackTimeout = setTimeout(() => {
      handleNextQuestion()
    }, GAME_CONFIG.FEEDBACK_DELAY)
    return
  }

  currentFeedbackState.value = 'incorrect-wait'
}

function triggerStreakReward() {
  const isFirstReward = streakCount.value === 3
  const isMilestoneReward = streakCount.value > 0 && streakCount.value % 5 === 0

  if (!isFirstReward && !isMilestoneReward) {
    return
  }

  streakRewardText.value = `连对 ${streakCount.value} 题`
  showStreakReward.value = true

  if (streakRewardTimeout) {
    clearTimeout(streakRewardTimeout)
  }

  streakRewardTimeout = setTimeout(() => {
    showStreakReward.value = false
  }, 760)
}

function handleInput(num) {
  if (isWaiting.value) return

  const now = Date.now()
  if (now - lastInputTime.value < INPUT_DEBOUNCE) return
  lastInputTime.value = now

  if (userAnswer.value.length < GAME_CONFIG.MAX_ANSWER_LENGTH) {
    userAnswer.value += num
    playKeyPress()
    return
  }

  triggerHapticFeedback('light')
}

function handleDelete() {
  if (isWaiting.value) return

  const now = Date.now()
  if (now - lastInputTime.value < INPUT_DEBOUNCE) return
  lastInputTime.value = now
  userAnswer.value = userAnswer.value.slice(0, -1)
  playDelete()
}

function handleNextQuestion() {
  if (game.currentIndex.value >= game.questions.value.length - 1) {
    showAnswer.value = false
    isWaiting.value = false
    handleGameComplete()
    return
  }

  questionKey.value += 1
  userAnswer.value = ''
  showAnswer.value = false
  isWaiting.value = false
  currentFeedbackState.value = 'idle'
  game.nextQuestion()
  startQuestionTimer()
}

function handleFeedbackClick() {
  if (!isCorrect.value && currentFeedbackState.value === 'incorrect-wait') {
    currentFeedbackState.value = 'idle'
    handleNextQuestion()
  }
}

function handleGameComplete() {
  stopQuestionTimer()
  stopGameTimeUpdater()
  game.completeGame()
  const result = game.getResult()
  const best = updateBestScore(parseInt(props.id), result)
  const stars = getStarCount(result.accuracy)

  triggerHapticFeedback(stars >= 4 ? 'strong' : 'medium')

  resultData.value = result
  isNewBest.value = best
  showModal.value = true

  if (stars >= 4) {
    playVictory()
    if (best) {
      setTimeout(() => playUnlock(), 300)
    }
  }
}

function goBack() {
  playBack()
  router.push('/difficulty')
}

function handleRetry() {
  showModal.value = false
  userAnswer.value = ''
  showAnswer.value = false
  isWaiting.value = false
  currentFeedbackState.value = 'idle'
  streakCount.value = 0
  showStreakReward.value = false
  questionKey.value = 0
  stopQuestionTimer()
  stopGameTimeUpdater()

  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout)
    feedbackTimeout = null
  }

  if (streakRewardTimeout) {
    clearTimeout(streakRewardTimeout)
    streakRewardTimeout = null
  }

  initGame()
}

function handleHome() {
  showModal.value = false
  router.push('/difficulty')
}

function handleKeyPress(event) {
  if (event.key >= '0' && event.key <= '9') {
    handleInput(parseInt(event.key))
  } else if (event.key === 'Backspace') {
    handleDelete()
  } else if (event.key === 'Enter') {
    submitAnswer()
  }
}

onMounted(() => {
  initGame()
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  stopQuestionTimer()
  stopGameTimeUpdater()

  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout)
    feedbackTimeout = null
  }

  if (streakRewardTimeout) {
    clearTimeout(streakRewardTimeout)
    streakRewardTimeout = null
  }
})
</script>

<template>
  <div v-if="difficulty" class="page">
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-panel">
          <div class="spinner"></div>
          <p class="loading-text text-child-base">加载中...</p>
        </div>
      </div>
    </Transition>

    <header class="header-panel">
      <button class="nav-btn" @click="goBack" aria-label="返回关卡页">
        <ArrowLeft :size="20" />
      </button>

      <div class="title-group">
        <p class="eyebrow">Mission Running</p>
        <h1 class="title text-child-lg">{{ difficulty.name }}</h1>
        <p class="subtitle text-child-sm">{{ difficulty.description }}</p>
      </div>

      <button class="nav-btn nav-btn-accent" title="重新开始" aria-label="重新开始" @click="handleRetry">
        <RotateCcw :size="18" />
      </button>
    </header>

    <main class="main-layout">
      <section class="question-section">
        <Transition name="streak-reward">
          <div v-if="showStreakReward" class="streak-reward">
            <Star :size="16" fill="currentColor" />
            <span>{{ streakRewardText }}</span>
          </div>
        </Transition>

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
          />
        </Transition>

        <Transition name="feedback">
          <div
            v-if="shouldShowFeedback"
            class="feedback-wrap"
            :class="{ 'is-success': isCorrect, 'is-error': isIncorrect }"
            @click="handleFeedbackClick"
          >
            <div class="feedback-card" :class="{ success: isCorrect, error: isIncorrect }" @click.stop>
              <template v-if="isCorrect">
                <div class="feedback-icon success">
                  <CheckCircle2 :size="22" />
                </div>
                <strong class="feedback-main">正确</strong>
              </template>

              <template v-else>
                <div class="feedback-icon error">
                  <AlertCircle :size="22" />
                </div>
                <strong class="feedback-main">{{ currentQuestion.answer }}</strong>
                <button class="feedback-continue-btn" @click="handleFeedbackClick">继续</button>
              </template>
            </div>
          </div>
        </Transition>
      </section>

      <section class="control-section">
        <div class="score-wrap">
          <ScoreBoard
            :score="game.score.value"
            :current-index="game.currentIndex.value"
            :total-questions="game.questions.value.length"
            :correct-count="game.correctCount.value"
            :duration="gameTime"
            :accuracy="game.accuracy.value"
            :streak="streakCount"
          />
        </div>

        <div class="keypad-wrap">
          <NumberPad
            :disabled="isWaiting || isComplete"
            @input="handleInput"
            @delete="handleDelete"
            @submit="submitAnswer"
          />
        </div>
      </section>
    </main>

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
  min-height: 100dvh;
  padding: 12px;
}

.header-panel,
.loading-panel {
  background: var(--bg-panel);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(18px);
}

.header-panel {
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: var(--radius-xl);
}

.nav-btn,
.loading-panel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.76);
  color: var(--text-secondary);
}

.nav-btn:active {
  transform: scale(0.97);
}

@media (hover: hover) {
  .nav-btn:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.92);
  }
}

.nav-btn-accent {
  color: var(--hero-blue-dark);
  background: var(--hero-blue-soft);
}

.title-group {
  min-width: 0;
  text-align: center;
}

.eyebrow {
  margin-bottom: 4px;
  color: var(--hero-blue);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.title {
  color: var(--text-primary);
  font-weight: 800;
}

.subtitle {
  margin-top: 2px;
  color: var(--text-secondary);
  line-height: 1.35;
}

.main-layout {
  display: grid;
  gap: 10px;
}

.question-section,
.control-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-section {
  position: relative;
  justify-content: flex-start;
  min-height: 180px;
}

.score-wrap {
  order: 1;
}

.keypad-wrap {
  order: 2;
}

.feedback-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  pointer-events: none;
  border-radius: 22px;
}

.feedback-wrap.is-success {
  align-items: flex-start;
  padding-top: 12px;
}

.feedback-wrap.is-error {
  position: fixed;
  inset: 0;
  z-index: 35;
  padding: 20px;
  border-radius: 0;
  align-items: center;
  pointer-events: auto;
  background: rgba(18, 28, 46, 0.32);
  backdrop-filter: blur(6px);
}

.streak-reward {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: var(--radius-full);
  background: var(--energy-yellow-soft);
  color: var(--energy-yellow-dark);
  border: 1px solid rgba(244, 180, 0, 0.24);
  font-size: 12px;
  font-weight: 800;
  box-shadow: var(--shadow-sm);
}

.streak-reward-enter-active,
.streak-reward-leave-active {
  transition: opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
}

.streak-reward-enter-from,
.streak-reward-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}

.feedback-card {
  width: min(100%, 300px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 18px 18px;
  border-radius: 24px;
  background: #ffffff;
  border: 2px solid var(--border-default);
  box-shadow: var(--shadow-lg);
}

.feedback-card.success {
  width: min(100%, 340px);
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--win-green-soft);
  border-color: rgba(18, 185, 129, 0.48);
  box-shadow: var(--shadow-md), var(--glow-green);
  pointer-events: none;
}

.feedback-card.error {
  width: min(100%, 360px);
  background: #fff4f2;
  border-color: rgba(239, 83, 80, 0.42);
  box-shadow: var(--shadow-xl);
  pointer-events: auto;
}

.feedback-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-icon.success {
  color: var(--win-green-dark);
  background: rgba(18, 185, 129, 0.18);
}

.feedback-icon.error {
  color: var(--error-red-dark);
  background: rgba(239, 83, 80, 0.12);
}

.feedback-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.feedback-kicker,
.feedback-note {
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: 800;
}

.feedback-main {
  color: #101828;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.1;
}

.feedback-card.success .feedback-main {
  font-size: 20px;
  color: var(--win-green-dark);
}

.feedback-card.error .feedback-main {
  color: var(--error-red-dark);
}

.feedback-continue-btn {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 14px;
  background: var(--error-red);
  color: white;
  font-size: var(--font-base);
  font-weight: 800;
}

.feedback-continue-btn:active {
  transform: scale(0.98);
}

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(243, 247, 251, 0.78);
  backdrop-filter: blur(8px);
}

.loading-panel {
  flex-direction: column;
  gap: 14px;
  width: 180px;
  height: 160px;
  border-radius: 28px;
}

.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid rgba(49, 120, 246, 0.16);
  border-top-color: var(--hero-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  color: var(--text-secondary);
  font-weight: 700;
}

.question-enter-active,
.question-leave-active,
.feedback-enter-active,
.feedback-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out);
}

.question-enter-from,
.question-leave-to,
.feedback-enter-from,
.feedback-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 960px) {
  .page {
    max-width: 1120px;
    margin: 0 auto;
    padding: 20px;
  }

  .main-layout {
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 360px);
    align-items: start;
  }

  .question-section {
    justify-content: center;
    min-height: 560px;
  }

  .control-section {
    position: sticky;
    top: 20px;
  }
}

@media (max-width: 420px) {
  .page {
    padding: 8px;
  }

  .header-panel {
    grid-template-columns: 44px 1fr 44px;
    gap: 8px;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 20px;
  }

  .nav-btn {
    width: 44px;
    height: 44px;
    border-radius: 14px;
  }

  .title {
    font-size: 18px;
    line-height: 1.2;
  }

  .eyebrow {
    margin-bottom: 2px;
    font-size: 11px;
  }

  .subtitle {
    margin-top: 2px;
    font-size: 12px;
    line-height: 1.45;
  }

  .main-layout {
    gap: 8px;
  }

  .question-section,
  .control-section {
    gap: 8px;
  }

  .question-section {
    min-height: 152px;
  }

  .feedback-card {
    padding: 16px 14px;
    border-radius: 20px;
  }

  .feedback-card.success {
    padding: 12px 14px;
    border-radius: 16px;
  }

  .streak-reward {
    top: 4px;
    right: 4px;
    padding: 6px 9px;
    font-size: 11px;
  }

  .feedback-main {
    font-size: 28px;
  }

  .feedback-card.success .feedback-main {
    font-size: 17px;
  }
}

@media (max-width: 959px) and (max-height: 860px) {
  .header-panel {
    grid-template-columns: 42px 1fr 42px;
    gap: 8px;
    margin-bottom: 8px;
    padding: 8px;
  }

  .nav-btn {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }

  .eyebrow,
  .subtitle {
    display: none;
  }

  .title {
    font-size: 18px;
    line-height: 1.15;
  }

  .main-layout,
  .question-section,
  .control-section {
    gap: 8px;
  }

  .question-section {
    min-height: 136px;
  }
}

@media (max-width: 959px) {
  .score-wrap {
    order: 2;
  }

  .keypad-wrap {
    order: 1;
  }
}
</style>
