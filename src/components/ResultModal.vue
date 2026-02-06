<script setup>
import { useSound } from '../composables/useSound'
import { Trophy, RotateCcw, Home, Target, CheckCircle, BarChart3, Clock, Star } from 'lucide-vue-next'

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
      <div v-if="show" class="modal-overlay" style="touch-action: manipulation;">
        <div class="modal-content">
          <!-- 头部 -->
          <div class="modal-header">
            <div class="trophy-icon-wrapper">
              <Trophy :size="32" stroke-width="2" />
            </div>
            <h2 class="modal-title">挑战完成！</h2>
            <div v-if="isNewBest" class="new-record-badge">
              <Star :size="12" fill="currentColor" />
              <span>新纪录</span>
            </div>
          </div>

          <!-- 数据卡片 -->
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon bg-blue">
                <Target :size="20" stroke-width="2.5" />
              </div>
              <span class="stat-label">得分</span>
              <span class="stat-value">{{ result.score }}</span>
            </div>
            <div class="stat-item">
              <div class="stat-icon bg-green">
                <CheckCircle :size="20" stroke-width="2.5" />
              </div>
              <span class="stat-label">正确</span>
              <span class="stat-value">{{ result.correctCount }}/{{ result.totalCount }}</span>
            </div>
            <div class="stat-item">
              <div class="stat-icon bg-purple">
                <BarChart3 :size="20" stroke-width="2.5" />
              </div>
              <span class="stat-label">正确率</span>
              <span class="stat-value">{{ result.accuracy }}%</span>
            </div>
            <div class="stat-item">
              <div class="stat-icon bg-orange">
                <Clock :size="20" stroke-width="2.5" />
              </div>
              <span class="stat-label">用时</span>
              <span class="stat-value">{{ formatTime(result.duration) }}</span>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="action-buttons">
            <button @click="handleRetry" class="btn-primary retry-btn">
              <RotateCcw :size="18" stroke-width="2.5" />
              <span>再玩一次</span>
            </button>
            <button @click="handleHome" class="btn-secondary home-btn">
              <Home :size="18" stroke-width="2.5" />
              <span>返回</span>
            </button>
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
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

/* 模态框内容 */
.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  padding: 28px 24px;
  max-width: 340px;
  width: 100%;
  box-shadow: var(--shadow-float);
}

/* 头部 */
.modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.trophy-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--ios-orange) 0%, var(--ios-orange-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--ios-text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.new-record-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--ios-yellow);
  color: var(--ios-text-primary);
  font-size: 12px;
  font-weight: 700;
  border-radius: var(--radius-full);
}

/* 数据网格 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-item {
  background: var(--ios-gray-6);
  border-radius: var(--radius-md);
  padding: 16px 12px;
  text-align: center;
  transition: all var(--duration-micro) var(--ease-standard);
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  color: white;
}

.stat-icon.bg-blue { background: var(--ios-blue); }
.stat-icon.bg-green { background: var(--ios-green); }
.stat-icon.bg-purple { background: var(--ios-purple); }
.stat-icon.bg-orange { background: var(--ios-orange); }

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--ios-gray-1);
  font-weight: 500;
  margin-bottom: 2px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--ios-text-primary);
  font-variant-numeric: tabular-nums;
}

/* 按钮组 */
.action-buttons {
  display: flex;
  gap: 12px;
}

.retry-btn,
.home-btn {
  flex: 1;
  height: 48px;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 600;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-micro) var(--ease-standard);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: modal-in var(--duration-macro) var(--ease-spring);
}

.modal-leave-active .modal-content {
  animation: modal-out var(--duration-micro) var(--ease-accelerate);
}

@keyframes modal-in {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-out {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}

/* 无障碍 - 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.01ms !important;
  }
  
  .modal-enter-active .modal-content,
  .modal-leave-active .modal-content {
    animation: none !important;
  }
}
</style>
