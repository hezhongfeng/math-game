<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, RotateCcw, Check, X, Sparkles, Heart } from 'lucide-vue-next'
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
  showParticles.value = isCorrect

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
    <!-- 顶部导航 -->
    <header class="header">
      <button @click="goBack" class="back-btn">
        <ArrowLeft :size="24" />
        <span>返回</span>
      </button>

      <div class="title-group">
        <h2 class="title">{{ difficulty.name }}</h2>
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

          <div class="flex flex-col items-center animate-bounce-happy">
            <!-- 大对勾图标 -->
            <div class="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-peppa-green to-peppa-green-dark flex items-center justify-center shadow-cute-lg animate-scale-up">
              <Check :size="52" class="text-white md:text-6xl" />
            </div>
            <!-- 星星装饰 -->
            <div class="absolute -top-2 -right-2 animate-pulse">
              <Sparkles :size="32" class="text-yellow-400 animate-spin-slow" />
            </div>
            <div class="absolute -bottom-2 -left-2 animate-pulse" style="animation-delay: 0.2s">
              <Sparkles :size="28" class="text-yellow-400 animate-spin-slow" />
            </div>
            <!-- 鼓励文字 -->
            <p class="mt-4 text-3xl md:text-4xl font-bold text-peppa-green font-rounded flex items-center gap-3 animate-bounce">
              <Sparkles :size="32" class="animate-spin-slow text-yellow-400" />
              太棒了！
              <Sparkles :size="32" class="animate-spin-slow text-yellow-400" style="animation-delay: 0.3s" />
            </p>
            <!-- 爱心装饰 -->
            <div class="mt-2 flex gap-1">
              <Heart v-for="i in 3" :key="i" :size="20" class="text-peppa-red animate-pulse" :style="{ animationDelay: `${i * 0.1}s` }" fill="currentColor" />
            </div>
          </div>
        </div>
        <div v-else-if="shouldShowFeedback && isIncorrect" class="feedback-overlay">
          <div class="flex flex-col items-center animate-wiggle">
            <!-- 大叉叉图标 -->
            <div class="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-peppa-orange to-peppa-orange-dark flex items-center justify-center shadow-cute-lg animate-scale-up">
              <X :size="52" class="text-white md:text-6xl" />
            </div>
            <!-- 鼓励文字 -->
            <p class="mt-4 text-2xl md:text-3xl font-bold text-peppa-orange font-rounded animate-bounce">
              再接再厉！
            </p>
            <p class="text-lg md:text-xl text-gray-600 mt-2 font-rounded flex items-center gap-2">
              正确答案是：
              <span class="text-peppa-blue-dark font-bold text-2xl md:text-3xl animate-pulse">
                {{ game.currentQuestion.value?.answer }}
              </span>
            </p>
            <!-- 安慰表情 -->
            <div class="mt-3 text-peppa-orange/60 text-sm font-rounded animate-pulse">
              没关系，下一题加油！💪
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
  z-index: 20;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
}

.feedback-enter-active {
  transition: all 0.25s ease-out;
}

.feedback-leave-active {
  transition: all 0.2s ease-in;
}

.feedback-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.feedback-leave-to {
  opacity: 0;
  transform: scale(0.9);
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

.animate-scale-up {
  animation: scaleUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.animate-wiggle {
  animation: wiggle 0.5s ease-in-out;
}

.animate-bounce-happy {
  animation: bounceHappy 0.6s ease-in-out infinite;
}
</style>

