<script setup>
import { ref, computed } from 'vue'
import { useSound } from '../composables/useSound'
import { getStarCount, getRatingText, getCelebrationEmoji } from '../utils/stars'
import { formatTime } from '../utils/format'
import { RotateCcw, Home, Target, CheckCircle, Clock, Star, Sparkles, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  result: {
    type: Object,
    required: true
  },
  isNewBest: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['retry', 'home'])
const { playSound } = useSound()

// 错题查看展开状态
const showIncorrectReview = ref(false)

// 是否有错题
const hasIncorrectQuestions = computed(() => {
  return props.result.incorrectQuestions && props.result.incorrectQuestions.length > 0
})

// 错题数量
const incorrectCount = computed(() => {
  return props.result.incorrectQuestions ? props.result.incorrectQuestions.length : 0
})

function toggleIncorrectReview() {
  playSound('click')
  showIncorrectReview.value = !showIncorrectReview.value
}

// 使用共享的星星评级函数
function handleRetry() {
  playSound('click')
  emit('retry')
}

function handleHome() {
  playSound('click')
  emit('home')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="result-overlay">
        <div class="result-card">
          <!-- mascot 庆祝 -->
          <div class="celebration-mascot">
            <span class="mascot-emoji">{{ getCelebrationEmoji(result.accuracy) }}</span>
            <div v-if="isNewBest" class="new-badge">
              <Sparkles :size="16" />
              <span>新纪录</span>
            </div>
          </div>
          
          <!-- 标题 -->
          <h2 class="result-title">{{ getRatingText(result.accuracy) }}</h2>
          <p class="result-subtitle">挑战完成啦！</p>
          
          <!-- 星星评级 -->
          <div class="star-rating">
            <Star 
              v-for="n in 3" 
              :key="n"
              :size="44"
              :class="['star-icon', n <= getStarCount(result.accuracy) ? 'star-active' : 'star-inactive']"
              fill="currentColor"
            />
          </div>

          <!-- 数据卡片 -->
          <div class="stats-box">
            <div class="stat-row">
              <div class="stat-item">
                <div class="stat-icon coral">
                  <Target :size="24" />
                </div>
                <div class="stat-info">
                  <span class="stat-label">得分</span>
                  <span class="stat-value">{{ result.score }}</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon green">
                  <CheckCircle :size="24" />
                </div>
                <div class="stat-info">
                  <span class="stat-label">正确</span>
                  <span class="stat-value">{{ result.correctCount }}/{{ result.totalCount }}</span>
                </div>
              </div>
            </div>
            <div class="stat-row">
              <div class="stat-item">
                <div class="stat-icon yellow">
                  <Star :size="24" />
                </div>
                <div class="stat-info">
                  <span class="stat-label">正确率</span>
                  <span class="stat-value">{{ result.accuracy }}%</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon purple">
                  <Clock :size="24" />
                </div>
                <div class="stat-info">
                  <span class="stat-label">用时</span>
                  <span class="stat-value">{{ formatTime(result.duration) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="action-btns">
            <button @click="handleRetry" class="btn-retry">
              <RotateCcw :size="24" />
              <span>再玩一次</span>
            </button>
            <button @click="handleHome" class="btn-home">
              <Home :size="22" />
              <span>返回</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.result-card {
  width: 100%;
  max-width: 420px;
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: 40px 28px;
  text-align: center;
  box-shadow: var(--shadow-lg);
  animation: cardPop 0.5s var(--ease-bounce);
}

@keyframes cardPop {
  0% {
    transform: scale(0.5) translateY(50px);
    opacity: 0;
  }
  60% {
    transform: scale(1.05) translateY(-10px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* mascot 庆祝区 */
.celebration-mascot {
  position: relative;
  margin-bottom: 20px;
}

.mascot-emoji {
  font-size: 80px;
  line-height: 1;
  display: inline-block;
  animation: mascotBounce 1s ease infinite;
}

@keyframes mascotBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-15px) scale(1.1); }
}

.new-badge {
  position: absolute;
  top: -8px;
  right: 50%;
  transform: translateX(70px);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(145deg, var(--energy-yellow) 0%, var(--warning-orange) 100%);
  color: white;
  font-size: var(--font-md);
  font-weight: 800;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  animation: badgePop 0.5s ease 0.3s both;
}

@keyframes badgePop {
  0% {
    transform: translateX(70px) scale(0);
    opacity: 0;
  }
  60% {
    transform: translateX(70px) scale(1.2);
  }
  100% {
    transform: translateX(70px) scale(1);
    opacity: 1;
  }
}

/* 标题 */
.result-title {
  font-size: var(--font-h1);
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.result-subtitle {
  font-size: var(--font-lg);
  color: var(--text-gray);
  margin-bottom: 24px;
}

/* 星星评级 */
.star-rating {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.star-icon {
  transition: all 0.3s ease;
}

.star-active {
  color: var(--warning);
  filter: drop-shadow(0 0 10px rgba(255, 199, 0, 0.4));
  animation: starAppear 0.4s ease both;
}

.star-inactive {
  color: var(--border-light);
}

@keyframes starAppear {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

/* 数据统计 */
.stats-box {
  background: var(--bg-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 28px;
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-row:not(:last-child) {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon.coral { background: var(--coral); }
.stat-icon.green { background: var(--success); }
.stat-icon.yellow { background: var(--warning); }
.stat-icon.purple { background: var(--hero-blue-light); }

.stat-info {
  text-align: left;
}

.stat-label {
  display: block;
  font-size: var(--font-md);
  color: var(--text-gray);
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: var(--font-h3);
  font-weight: 700;
  color: var(--text-dark);
  font-variant-numeric: tabular-nums;
}

/* 错题回顾 */
.incorrect-review {
  margin-bottom: 24px;
}

.review-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: rgba(255, 107, 53, 0.08);
  border: 2px solid rgba(255, 107, 53, 0.2);
  border-radius: var(--radius-md);
  color: var(--warning-orange);
  font-size: var(--font-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.review-toggle:active {
  transform: scale(0.98);
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-icon.is-expanded {
  transform: rotate(180deg);
}

.review-content {
  margin-top: 12px;
  max-height: 200px;
  overflow-y: auto;
  text-align: left;
}

.review-item {
  padding: 12px;
  background: var(--bg-light);
  border-radius: var(--radius-md);
  margin-bottom: 8px;
}

.review-item:last-child {
  margin-bottom: 0;
}

.review-question {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.review-answers {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.answer {
  font-size: var(--font-sm);
}

.answer.wrong {
  color: var(--warning-orange);
}

.answer.correct {
  color: var(--success);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
  opacity: 1;
  margin-top: 12px;
}

/* 按钮 */
.action-btns {
  display: flex;
  gap: 16px;
}

.btn-retry, .btn-home {
  flex: 1;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: var(--font-lg);
  font-weight: 700;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Active state for tactile feedback */
.btn-retry:active {
  transform: scale(0.95);
  box-shadow: none;
}

.btn-home:active {
  transform: scale(0.95);
  background: var(--bg-light);
}


.btn-retry {
  background: var(--coral);
  color: white;
  border: none;
  box-shadow: var(--shadow-sm);
}


.btn-home {
  background: var(--white);
  color: var(--text-gray);
  border: 3px solid var(--border-light);
}


/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
