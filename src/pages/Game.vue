<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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
import ParticleEffects from '../components/ParticleEffects.vue'

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
const showParticles = ref(false)
const particleType = ref('correct')

const questionKey = ref(0) // 用于强制重新渲染题目卡片

const isComplete = computed(() => game.isComplete.value)
const isCorrect = computed(() => game.currentQuestion.value?.isCorrect === true)
const isIncorrect = computed(() => game.currentQuestion.value?.isCorrect === false)
const shouldShowFeedback = computed(() => showAnswer.value && game.currentQuestion.value?.userAnswer !== null)

// 触发触觉反馈（振动）
function triggerHapticFeedback() {
  if (navigator.vibrate) {
    navigator.vibrate(50)
  }
}

// 监听题目变化，更新 key
watch(() => game.currentIndex.value, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    questionKey.value++ // 切换题目时改变 key
    userAnswer.value = '' // 立即清空答案
    showAnswer.value = false // 隐藏答案反馈
    isWaiting.value = false // 取消等待状态
    showParticles.value = false // 隐藏粒子效果
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
  particleType.value = isCorrect ? 'correct' : 'wrong'
  showParticles.value = true // 答对和答错都显示粒子

  // 播放反馈音效（不播放点击音效）
  if (isCorrect) {
    playSound('correct')
  } else {
    playSound('wrong')
  }

  // 触发触觉反馈
  triggerHapticFeedback()

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
    <!-- 装饰星星 -->
    <div class="stars">
      <span class="star star-1">✨</span>
      <span class="star star-2">⭐</span>
      <span class="star star-3">✨</span>
      <span class="star star-4">⭐</span>
    </div>

    <!-- 顶部导航 -->
    <header class="header">
      <button @click="goBack" class="back-btn">
        <ArrowLeft :size="24" />
        <span>返回</span>
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
          <!-- 粒子效果 -->
          <ParticleEffects :show="showParticles" :type="particleType" />

          <!-- 大对勾图标 - 优化版 -->
          <div class="correct-mark">
            <div class="mark-circle">
              <Check :size="56" class="mark-icon" />
            </div>
            <div class="mark-ring"></div>
            <div class="mark-sparkles">
              <span v-for="i in 8" :key="i" class="sparkle" :style="{ '--delay': `${i * 0.1}s`, '--angle': `${i * 45}deg` }">✨</span>
            </div>
          </div>
        </div>
        <div v-else-if="shouldShowFeedback && isIncorrect" class="feedback-overlay">
          <!-- 粒子效果 -->
          <ParticleEffects :show="showParticles" :type="particleType" />

          <!-- 正确答案 - 优化震动效果 -->
          <div class="wrong-answer">
            <div class="answer-card">
              <span class="answer-label">正确答案</span>
              <span class="answer-number animate-bounce-in">{{ game.currentQuestion.value?.answer }}</span>
            </div>
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
  background: linear-gradient(180deg, #E3F2FD 0%, #F5F9FF 50%, #E8F5E9 100%);
  display: flex;
  flex-direction: column;
  padding: 12px 12px 24px;
  touch-action: manipulation;
  position: relative;
  overflow: hidden;
}

/* 装饰星星 */
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  font-size: 20px;
  opacity: 0.4;
  animation: floatStar 4s ease-in-out infinite;
}

.star-1 {
  top: 5%;
  left: 5%;
  animation-delay: 0s;
}

.star-2 {
  top: 8%;
  right: 8%;
  font-size: 16px;
  animation-delay: 1s;
}

.star-3 {
  bottom: 15%;
  left: 5%;
  animation-delay: 2s;
}

.star-4 {
  bottom: 20%;
  right: 8%;
  font-size: 24px;
  animation-delay: 1.5s;
}

@keyframes floatStar {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-10px) rotate(10deg) scale(1.1);
    opacity: 0.6;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.1);
  position: relative;
  z-index: 10;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 16px;
  font-weight: 600;
  color: #4A90E2;
  background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.back-btn:active {
  background: #e0efff;
  transform: scale(0.95);
}

.title-group {
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: 800;
  font-family: inherit;
  filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.2));
}

.subtitle {
  font-size: 13px;
  color: #5a7a9a;
  font-family: inherit;
}

.retry-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #4A90E2;
  background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.retry-btn:active {
  background: #e0efff;
  transform: scale(0.95);
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.numpad-section {
  margin: 12px 0;
}

.footer {
  margin-top: auto;
}

/* 题目切换过渡 */
.question-enter-active,
.question-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
}

.question-leave-to {
  opacity: 0;
  transform: translateY(-40px) scale(0.95);
}

/* ========================================
   高级反馈动画 - 移动端优化版
   ======================================== */

/* 悬浮反馈层 */
.feedback-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(74, 144, 226, 0.2);
  padding: 48px 24px;
}

/* 反馈内容容器 */
.feedback-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* ========================================
   成功反馈样式
   ======================================== */
.feedback-success {
  animation: successContainerEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes successContainerEnter {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 背景光晕 */
.success-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0) 70%);
  animation: glowPulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
}

/* 成功圆圈 */
.success-circle {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: circleEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

@keyframes circleEnter {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* 圆圈边框 - 多层效果 */
.success-circle::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 3px solid transparent;
  background: linear-gradient(135deg, #4CAF50, #81C784, #4CAF50) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: borderRotate 3s linear infinite;
}

@keyframes borderRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 内圈 */
.success-circle-inner {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #81C784 100%);
  box-shadow: 
    inset 0 2px 8px rgba(255, 255, 255, 0.4),
    0 4px 20px rgba(76, 175, 80, 0.4);
}

/* 对勾图标 */
.success-icon {
  position: relative;
  width: 48px;
  height: 48px;
  color: white;
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: checkDraw 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  z-index: 2;
}

@keyframes checkDraw {
  to {
    stroke-dashoffset: 0;
  }
}

/* 装饰光点 */
.success-decorations {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.decoration-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  margin-top: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #FFEB3B);
  box-shadow: 0 0 10px #FFD700, 0 0 20px rgba(255, 215, 0, 0.5);
  transform: rotate(var(--angle)) translateX(var(--distance));
  animation: dotFloat 2s ease-in-out infinite;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes dotFloat {
  0% {
    opacity: 0;
    transform: rotate(var(--angle)) translateX(var(--distance)) scale(0);
  }
  50% {
    opacity: 1;
    transform: rotate(calc(var(--angle) + 20deg)) translateX(calc(var(--distance) + 5px)) scale(1);
  }
  100% {
    opacity: 0;
    transform: rotate(calc(var(--angle) + 40deg)) translateX(calc(var(--distance) + 10px)) scale(0);
  }
}

/* 得分飘字 */
.score-popup {
  margin-top: 20px;
  animation: scorePopup 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
}

@keyframes scorePopup {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scale(1);
  }
}

.score-plus {
  font-size: 28px;
  font-weight: 800;
  color: #4CAF50;
  font-family: inherit;
  text-shadow: 0 2px 10px rgba(76, 175, 80, 0.4);
}

/* ========================================
   错误反馈样式
   ======================================== */
.feedback-error {
  animation: errorContainerEnter 0.4s ease-out forwards;
}

@keyframes errorContainerEnter {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 背景光晕 */
.error-glow {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 152, 0, 0.25) 0%, rgba(255, 152, 0, 0) 70%);
  animation: errorGlowPulse 0.8s ease-in-out;
}

@keyframes errorGlowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* 错误圆圈 */
.error-circle {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: errorCircleShake 0.5s ease-in-out;
}

@keyframes errorCircleShake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-4px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(4px);
  }
}

.error-circle::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 3px solid transparent;
  background: linear-gradient(135deg, #FF9800, #FF5722, #FF9800) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.error-circle-inner {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9800 0%, #FF5722 100%);
  box-shadow: 
    inset 0 2px 8px rgba(255, 255, 255, 0.3),
    0 4px 15px rgba(255, 152, 0, 0.3);
}

/* 错误图标 */
.error-icon {
  width: 36px;
  height: 36px;
  color: white;
  position: relative;
  z-index: 2;
  animation: errorIconAppear 0.3s ease-out 0.15s both;
}

@keyframes errorIconAppear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 正确答案卡片 */
.answer-card-advanced {
  margin-top: 24px;
  padding: 16px 32px;
  background: white;
  border-radius: 20px;
  box-shadow: 
    0 10px 40px rgba(255, 152, 0, 0.2),
    0 0 0 1px rgba(255, 152, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: cardAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
}

@keyframes cardAppear {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.answer-hint {
  font-size: 13px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-family: inherit;
}

.answer-value {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #FF9800 0%, #E65100 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: inherit;
  line-height: 1;
}

/* ========================================
   过渡动画
   ======================================== */
.feedback-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feedback-leave-active {
  transition: all 0.25s ease-in;
}

.feedback-enter-from {
  opacity: 0;
}

.feedback-leave-to {
  opacity: 0;
}

/* ========================================
   页面基础样式
   ======================================== */
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E3F2FD 0%, #F5F9FF 50%, #E8F5E9 100%);
  display: flex;
  flex-direction: column;
  padding: 12px 12px 24px;
  touch-action: manipulation;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: white;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 16px;
  font-weight: 600;
  color: #4A90E2;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.back-btn:active {
  background: #f0f7ff;
  transform: scale(0.95);
}

.title-group {
  text-align: center;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #1e3a5f;
  font-family: inherit;
}

.subtitle {
  font-size: 13px;
  color: #5a7a9a;
  font-family: inherit;
}

.retry-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #4A90E2;
  background: #f0f7ff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.retry-btn:active {
  background: #e0efff;
  transform: scale(0.95);
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.numpad-section {
  margin: 12px 0;
}

.footer {
  margin-top: auto;
}

/* 题目切换过渡 */
.question-enter-active,
.question-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
}

.question-leave-to {
  opacity: 0;
  transform: translateY(-40px) scale(0.95);
}

/* 增强动画效果 */
@keyframes scaleUp {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

@keyframes bounceHappy {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes wrongShake {
  0%, 100% { transform: translateX(0) rotate(0); }
  10% { transform: translateX(-8px) rotate(-5deg); }
  20% { transform: translateX(8px) rotate(5deg); }
  30% { transform: translateX(-8px) rotate(-5deg); }
  40% { transform: translateX(8px) rotate(5deg); }
  50% { transform: translateX(-4px) rotate(-3deg); }
  60% { transform: translateX(4px) rotate(3deg); }
  70% { transform: translateX(-2px) rotate(-1deg); }
  80% { transform: translateX(2px) rotate(1deg); }
}

@keyframes markPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes markBreath {
  0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  50% { box-shadow: 0 0 0 20px rgba(76, 175, 80, 0); }
}

@keyframes ringRipple {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

@keyframes sparkleRotate {
  0% { transform: rotate(var(--angle)) translateX(60px) rotate(calc(-1 * var(--angle))); }
  100% { transform: rotate(calc(var(--angle) + 360deg)) translateX(60px) rotate(calc(-1 * calc(var(--angle) + 360deg))); }
}

@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.3); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-scale-up {
  animation: scaleUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.animate-wiggle {
  animation: wiggle 0.5s ease-in-out;
}

.animate-bounce-happy {
  animation: bounceHappy 0.6s ease-in-out infinite;
}

.animate-wrong-shake {
  animation: wrongShake 0.6s ease-in-out;
}

.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

/* 正确反馈样式 - 优化版 */
.correct-mark {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: markPulse 0.6s ease-in-out;
}

.mark-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 30px rgba(76, 175, 80, 0.4), 0 0 60px rgba(76, 175, 80, 0.2);
  animation: markBreath 2s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.mark-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  animation: scaleUp 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s backwards;
}

.mark-ring {
  position: absolute;
  width: 130px;
  height: 130px;
  border: 4px solid #4CAF50;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: ringRipple 1s ease-out 0.2s backwards;
}

.mark-sparkles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 20px;
  animation: sparkleRotate 3s linear infinite;
  animation-delay: var(--delay);
  opacity: 0.9;
}

/* 错误反馈样式 - 优化版 */
.wrong-answer {
  animation: wrongShake 0.5s ease-in-out;
}

.answer-card {
  background: linear-gradient(135deg, #ffffff 0%, #FFF8E1 100%);
  border-radius: 24px;
  padding: 20px 40px;
  box-shadow: 0 10px 40px rgba(255, 152, 0, 0.25), 0 0 0 4px rgba(255, 152, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 3px solid rgba(255, 152, 0, 0.3);
}

.answer-label {
  font-size: 14px;
  font-weight: 600;
  color: #FF9800;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: inherit;
}

.answer-number {
  font-size: 48px;
  font-weight: 800;
  color: #E65100;
  font-family: inherit;
  line-height: 1;
}
</style>

