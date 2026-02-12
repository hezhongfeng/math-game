<script setup>
import { useSound } from '../composables/useSound'
import { getStarCount, getRatingText, getCelebrationEmoji } from '../utils/stars'
import { RotateCcw, Home, Target, CheckCircle, Clock, Star, Sparkles } from 'lucide-vue-next'

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

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
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
  background: linear-gradient(145deg, #FFD700 0%, #FFA500 100%);
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
  color: #FFB347;
  filter: drop-shadow(0 0 10px rgba(255, 179, 71, 0.5));
  animation: starAppear 0.4s ease both;
}

.star-inactive {
  color: #E8E8E8;
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
  background: #F8F9FA;
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
.stat-icon.green { background: #00D084; }
.stat-icon.yellow { background: #FFB347; }
.stat-icon.purple { background: #A55EEA; }

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

.btn-retry {
  background: var(--coral);
  color: white;
  border: none;
  box-shadow: var(--shadow-sm);
}

.btn-retry:hover {
  background: var(--coral-dark);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.btn-retry:active {
  transform: scale(0.98);
}

.btn-home {
  background: var(--white);
  color: var(--text-gray);
  border: 3px solid #E8E8E8;
}

.btn-home:hover {
  border-color: var(--coral);
  color: var(--coral);
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
