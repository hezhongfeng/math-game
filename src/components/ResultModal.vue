<script setup>
import { useSound } from '../composables/useSound'
import { Trophy, RotateCcw, Home, Target, CheckCircle, BarChart3, Clock } from 'lucide-vue-next'

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
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" style="touch-action: manipulation;">
        <div class="modal-content">
          <!-- 头部 -->
          <div class="modal-header">
            <div class="trophy-wrapper">
              <Trophy :size="44" class="trophy-icon" />
            </div>
            <h2 class="modal-title text-child-2xl">挑战完成！</h2>
            <div v-if="isNewBest" class="new-record-badge text-child-sm">
              新纪录
            </div>
          </div>

          <!-- 数据卡片 -->
          <div class="stats-grid">
            <div class="stat-card score-card">
              <div class="stat-icon">
                <Target :size="24" />
              </div>
              <span class="stat-label text-child-xs">得分</span>
              <span class="stat-value text-child-lg">{{ result.score }}</span>
            </div>
            <div class="stat-card correct-card">
              <div class="stat-icon">
                <CheckCircle :size="24" />
              </div>
              <span class="stat-label text-child-xs">正确</span>
              <span class="stat-value text-child-lg">{{ result.correctCount }}/{{ result.totalCount }}</span>
            </div>
            <div class="stat-card accuracy-card">
              <div class="stat-icon">
                <BarChart3 :size="24" />
              </div>
              <span class="stat-label text-child-xs">正确率</span>
              <span class="stat-value text-child-lg">{{ result.accuracy }}%</span>
            </div>
            <div class="stat-card time-card">
              <div class="stat-icon">
                <Clock :size="24" />
              </div>
              <span class="stat-label text-child-xs">用时</span>
              <span class="stat-value text-child-lg">{{ formatTime(result.duration) }}</span>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="button-group">
            <button @click="handleRetry" class="btn btn-retry text-child-xs">
              <RotateCcw :size="20" />
              再玩一次
            </button>
            <button @click="handleHome" class="btn btn-home text-child-xs">
              <Home :size="20" />
              返回选择
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
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}

/* 模态框内容 */
.modal-content {
  background: white;
  border-radius: 24px;
  padding: 28px 24px;
  max-width: 360px;
  width: 100%;
  box-shadow:
    0 4px 0 0 rgba(0, 0, 0, 0.06),
    0 20px 50px rgba(0, 0, 0, 0.2);
  position: relative;
}

/* 头部 */
.modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.trophy-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--game-warning) 0%, var(--game-warning-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 6px 16px rgba(234, 179, 8, 0.35);
}

.trophy-icon {
  color: white;
}

.modal-title {
  font-weight: 800;
  color: var(--game-text);
  margin-bottom: 8px;
}

/* 新纪录徽章 */
.new-record-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--game-accent) 0%, var(--game-accent-dark) 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 3px 0 0 #7C2D12;
}

/* 数据网格 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 22px;
}

.stat-card {
  background: var(--game-bg-light);
  border-radius: 16px;
  padding: 14px 10px;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
}

.score-card .stat-icon {
  background: rgba(79, 70, 229, 0.1);
  color: var(--game-primary-dark);
}

.correct-card .stat-icon {
  background: rgba(34, 197, 94, 0.1);
  color: var(--game-success-dark);
}

.accuracy-card .stat-icon {
  background: rgba(249, 115, 22, 0.1);
  color: var(--game-accent-dark);
}

.time-card .stat-icon {
  background: rgba(234, 179, 8, 0.1);
  color: var(--game-warning-dark);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--game-text-secondary);
  font-weight: 500;
  margin-bottom: 3px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--game-text);
}

.score-card .stat-value { color: var(--game-primary-dark); }
.correct-card .stat-value { color: var(--game-success-dark); }
.accuracy-card .stat-value { color: var(--game-accent-dark); }
.time-card .stat-value { color: var(--game-warning-dark); }

/* 按钮组 */
.button-group {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 700;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  border: none;
}

.btn-retry {
  background: linear-gradient(135deg, var(--game-success) 0%, var(--game-success-dark) 100%);
  color: white;
  box-shadow: 0 3px 0 0 #14532D;
}

.btn-retry:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 0 #14532D;
}

.btn-retry:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 #14532D;
}

.btn-home {
  background: var(--game-bg-light);
  color: var(--game-text-secondary);
  box-shadow: 0 3px 0 0 var(--game-border);
}

.btn-home:hover {
  background: var(--game-bg);
  transform: translateY(-1px);
  box-shadow: 0 4px 0 0 var(--game-border);
}

.btn-home:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 0 var(--game-border);
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  animation: modal-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active .modal-content {
  animation: modal-out 0.25s ease;
}

@keyframes modal-in {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
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
    transform: scale(0.9);
  }
}
</style>
