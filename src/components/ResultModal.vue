<script setup>
import { useSound } from '../composables/useSound'

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

function handleRetry() {
  emit('retry')
}

function handleHome() {
  emit('home')
}

// 生成彩带样式
function getConfettiStyle(n) {
  const colors = ['#FF8A80', '#4FC3F7', '#81C784', '#FFD54F', '#CE93D8', '#FFAB91']
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 2
  const color = colors[Math.floor(Math.random() * colors.length)]

  return {
    left: `${left}%`,
    backgroundColor: color,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" style="touch-action: manipulation;">
        <!-- 庆祝彩带 -->
        <div class="confetti-container">
          <div v-for="n in 20" :key="n" class="confetti" :style="getConfettiStyle(n)"></div>
        </div>

        <div class="modal-content">
          <div class="text-center mb-6">
            <div class="trophy-icon">🏆</div>
            <h2 class="modal-title">游戏结束！</h2>
            <div v-if="isNewBest" class="new-record-badge">
              <span class="record-star">⭐</span>
              新纪录！
              <span class="record-star">⭐</span>
            </div>
          </div>

          <!-- 数据卡片 - 玻璃拟态 -->
          <div class="stats-grid">
            <div class="stat-card score-card">
              <div class="stat-icon-wrapper">🎯</div>
              <span class="stat-label">得分</span>
              <span class="stat-value">{{ result.score }}</span>
            </div>
            <div class="stat-card correct-card">
              <div class="stat-icon-wrapper">✅</div>
              <span class="stat-label">正确数</span>
              <span class="stat-value">{{ result.correctCount }}/{{ result.totalCount }}</span>
            </div>
            <div class="stat-card accuracy-card">
              <div class="stat-icon-wrapper">📊</div>
              <span class="stat-label">正确率</span>
              <span class="stat-value">{{ result.accuracy }}%</span>
            </div>
            <div class="stat-card time-card">
              <div class="stat-icon-wrapper">⏱️</div>
              <span class="stat-label">用时</span>
              <span class="stat-value">{{ formatTime(result.duration) }}</span>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="button-group">
            <button
              @click="handleRetry"
              class="btn btn-retry"
            >
              <span class="btn-icon">🔄</span>
              再玩一次
            </button>
            <button
              @click="handleHome"
              class="btn btn-home"
            >
              <span class="btn-icon">🏠</span>
              返回选择
            </button>
          </div>

          <div class="footer-text">
            🌟 快乐学习数学 🌟
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 模态框遮罩 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  overflow: hidden;
}

/* 彩带动画 */
.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 20px;
  top: -20px;
  animation: confetti-fall linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 模态框内容 */
.modal-content {
  background: linear-gradient(180deg, #ffffff 0%, #F5F5F5 100%);
  border-radius: 32px;
  padding: 32px 24px;
  max-width: 380px;
  width: 100%;
  box-shadow:
    0 8px 0 0 rgba(0, 0, 0, 0.08),
    0 20px 60px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 1;
}

/* 奖杯图标 */
.trophy-icon {
  font-size: 64px;
  margin-bottom: 12px;
  animation: bounce-gentle 2s ease-in-out infinite;
  display: inline-block;
}

@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 标题 */
.modal-title {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #FF8A80, #4FC3F7, #81C784);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

/* 新纪录徽章 */
.new-record-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FFD54F 0%, #FFB300 100%);
  color: #5D4037;
  padding: 10px 20px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 16px;
  box-shadow:
    0 4px 0 0 #F57F17,
    0 6px 15px rgba(255, 179, 0, 0.4);
  animation: pulse-gentle 2s ease-in-out infinite;
}

.record-star {
  font-size: 18px;
  animation: star-twinkle 1s ease-in-out infinite;
}

.record-star:last-child {
  animation-delay: 0.5s;
}

@keyframes star-twinkle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 数据网格 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

/* 玻璃拟态数据卡片 */
.stat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 16px 12px;
  text-align: center;
  box-shadow:
    0 3px 0 0 rgba(0, 0, 0, 0.06),
    0 6px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 5px 0 0 rgba(0, 0, 0, 0.06),
    0 10px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon-wrapper {
  font-size: 28px;
  margin-bottom: 8px;
}

.stat-label {
  display: block;
  font-size: 13px;
  color: #78909C;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #37474F;
}

.score-card .stat-value { color: #FF7043; }
.correct-card .stat-value { color: #66BB6A; }
.accuracy-card .stat-value { color: #42A5F5; }
.time-card .stat-value { color: #FFA726; }

/* 按钮组 */
.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 20px;
  font-size: 17px;
  font-weight: 700;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  border: none;
}

.btn-icon {
  font-size: 20px;
}

.btn-retry {
  background: linear-gradient(180deg, #81C784 0%, #66BB6A 100%);
  color: white;
  box-shadow:
    0 4px 0 0 #4CAF50,
    0 6px 20px rgba(102, 187, 106, 0.3);
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 0 0 #4CAF50,
    0 10px 30px rgba(102, 187, 106, 0.4);
}

.btn-retry:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 0 #4CAF50,
    0 4px 15px rgba(102, 187, 106, 0.3);
}

.btn-home {
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  color: #4FC3F7;
  box-shadow:
    0 4px 0 0 #B0BEC5,
    0 6px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #E1F5FE;
}

.btn-home:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 0 0 #B0BEC5,
    0 10px 30px rgba(0, 0, 0, 0.15);
  border-color: #B3E5FC;
}

.btn-home:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 0 #B0BEC5,
    0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 底部文字 */
.footer-text {
  text-align: center;
  font-size: 14px;
  color: #9E9E9E;
  font-weight: 500;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active .modal-content {
  animation: modal-out 0.3s ease;
}

@keyframes modal-in {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(30px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

@keyframes pulse-gentle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
