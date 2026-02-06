<script setup>
import { useSound } from '../composables/useSound'
import { Trophy, RotateCcw, Home, Target, CheckCircle, BarChart3, Clock, Zap, Shield } from 'lucide-vue-next'

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
      <div v-if="show" class="mission-report-overlay" style="touch-action: manipulation;">
        <div class="mission-report">
          <!-- 扫描线 -->
          <div class="report-scan"></div>
          
          <!-- 装饰角标 -->
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
          
          <!-- 头部 -->
          <div class="report-header">
            <div class="mission-badge">
              <Shield :size="32" stroke-width="2" />
            </div>
            <h2 class="report-title">MISSION COMPLETE</h2>
            <p class="report-subtitle">任务完成报告</p>
            <div v-if="isNewBest" class="high-score-badge">
              <Zap :size="14" fill="currentColor" />
              <span>新高分记录</span>
            </div>
          </div>

          <!-- 数据网格 - 终端风格 -->
          <div class="data-terminal">
            <div class="terminal-row">
              <div class="terminal-cell">
                <div class="cell-icon">
                  <Target :size="18" />
                </div>
                <div class="cell-data">
                  <span class="cell-label">SCORE</span>
                  <span class="cell-value highlight">{{ result.score }}</span>
                </div>
              </div>
              <div class="terminal-cell">
                <div class="cell-icon success">
                  <CheckCircle :size="18" />
                </div>
                <div class="cell-data">
                  <span class="cell-label">ACCURACY</span>
                  <span class="cell-value">{{ result.correctCount }}/{{ result.totalCount }}</span>
                </div>
              </div>
            </div>
            
            <div class="terminal-row">
              <div class="terminal-cell">
                <div class="cell-icon">
                  <BarChart3 :size="18" />
                </div>
                <div class="cell-data">
                  <span class="cell-label">RATE</span>
                  <span class="cell-value highlight">{{ result.accuracy }}%</span>
                </div>
              </div>
              <div class="terminal-cell">
                <div class="cell-icon warning">
                  <Clock :size="18" />
                </div>
                <div class="cell-data">
                  <span class="cell-label">TIME</span>
                  <span class="cell-value">{{ formatTime(result.duration) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 评价等级 -->
          <div class="rank-section">
            <div class="rank-label">MISSION RATING</div>
            <div class="rank-stars">
              <Zap 
                v-for="n in 3" 
                :key="n"
                :size="28"
                :class="['rank-star', n <= Math.ceil(result.accuracy / 34) ? 'active' : '']"
              />
            </div>
            <div class="rank-text">{{ result.accuracy >= 90 ? '完美执行' : result.accuracy >= 70 ? '出色完成' : '任务完成' }}</div>
          </div>

          <!-- 命令按钮 -->
          <div class="command-actions">
            <button @click="handleRetry" class="action-btn btn-retry">
              <div class="btn-icon">
                <RotateCcw :size="20" stroke-width="2.5" />
              </div>
              <div class="btn-text">
                <span class="btn-main">重试任务</span>
                <span class="btn-sub">RETRY</span>
              </div>
            </button>
            <button @click="handleHome" class="action-btn btn-return">
              <div class="btn-icon">
                <Home :size="18" stroke-width="2.5" />
              </div>
              <div class="btn-text">
                <span class="btn-main">返回基地</span>
                <span class="btn-sub">RETURN</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 任务报告遮罩 */
.mission-report-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

/* 任务报告卡片 */
.mission-report {
  position: relative;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%);
  border-radius: var(--radius-sharp-lg);
  border: 2px solid rgba(0, 102, 255, 0.3);
  padding: 32px 28px;
  max-width: 380px;
  width: 100%;
  box-shadow: 
    0 0 60px rgba(0, 102, 255, 0.2),
    0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

/* 扫描线 */
.report-scan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--hero-blue), transparent);
  opacity: 0.6;
  animation: scanMove 3s linear infinite;
}

@keyframes scanMove {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(400px); opacity: 0; }
}

/* 装饰角标 */
.corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(0, 102, 255, 0.4);
}

.corner.top-left {
  top: 12px;
  left: 12px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: 12px;
  right: 12px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: 12px;
  left: 12px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: 12px;
  right: 12px;
  border-left: none;
  border-top: none;
}

/* 头部 */
.report-header {
  text-align: center;
  margin-bottom: 28px;
}

.mission-badge {
  width: 72px;
  height: 72px;
  background: linear-gradient(145deg, rgba(0, 208, 132, 0.2) 0%, rgba(0, 168, 107, 0.3) 100%);
  border: 2px solid rgba(0, 208, 132, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: var(--win-green);
  box-shadow: 0 0 30px rgba(0, 208, 132, 0.3);
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { box-shadow: 0 0 30px rgba(0, 208, 132, 0.3); }
  50% { box-shadow: 0 0 50px rgba(0, 208, 132, 0.5); }
}

.report-title {
  font-size: 24px;
  font-weight: 800;
  color: white;
  margin-bottom: 4px;
  letter-spacing: 0.1em;
  text-shadow: 0 0 20px rgba(0, 102, 255, 0.5);
}

.report-subtitle {
  font-size: 13px;
  color: rgba(148, 163, 184, 0.8);
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
}

.high-score-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(145deg, var(--energy-yellow) 0%, var(--energy-yellow-dark) 100%);
  color: var(--bg-dark-navy);
  font-size: 12px;
  font-weight: 800;
  border-radius: var(--radius-full);
  box-shadow: 0 0 20px rgba(255, 199, 0, 0.4);
}

/* 数据终端 */
.data-terminal {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.terminal-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.terminal-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 102, 255, 0.08);
  border: 1px solid rgba(0, 102, 255, 0.2);
  border-radius: var(--radius-sharp-md);
  transition: all var(--duration-micro) ease;
}

.terminal-cell:hover {
  border-color: rgba(0, 102, 255, 0.4);
  background: rgba(0, 102, 255, 0.12);
}

.cell-icon {
  width: 36px;
  height: 36px;
  background: rgba(0, 102, 255, 0.2);
  border-radius: var(--radius-sharp-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--hero-blue);
  flex-shrink: 0;
}

.cell-icon.success {
  background: rgba(0, 208, 132, 0.2);
  color: var(--win-green);
}

.cell-icon.warning {
  background: rgba(255, 107, 53, 0.2);
  color: var(--alert-orange);
}

.cell-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cell-label {
  font-size: 10px;
  color: rgba(148, 163, 184, 0.8);
  letter-spacing: 0.1em;
  font-family: 'Courier New', monospace;
}

.cell-value {
  font-size: 20px;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
}

.cell-value.highlight {
  color: var(--hero-blue);
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
}

/* 评价等级 */
.rank-section {
  text-align: center;
  padding: 20px 0;
  margin-bottom: 24px;
  border-top: 1px solid rgba(0, 102, 255, 0.2);
  border-bottom: 1px solid rgba(0, 102, 255, 0.2);
}

.rank-label {
  font-size: 11px;
  color: rgba(148, 163, 184, 0.8);
  letter-spacing: 0.15em;
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
}

.rank-stars {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.rank-star {
  color: rgba(255, 255, 255, 0.2);
  transition: all var(--duration-micro) ease;
}

.rank-star.active {
  color: var(--energy-yellow);
  filter: drop-shadow(0 0 10px rgba(255, 199, 0, 0.8));
  animation: starPulse 1s ease-in-out;
}

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.rank-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--win-green);
  text-shadow: 0 0 15px rgba(0, 208, 132, 0.5);
}

/* 命令按钮 */
.command-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 20px;
  border-radius: var(--radius-sharp-md);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: all var(--duration-micro) ease;
  border: none;
}

.btn-retry {
  background: linear-gradient(145deg, rgba(0, 102, 255, 0.2) 0%, rgba(0, 82, 204, 0.3) 100%);
  border: 2px solid rgba(0, 102, 255, 0.5);
  color: white;
}

.btn-retry:hover {
  border-color: rgba(0, 102, 255, 0.8);
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.3);
  transform: translateY(-2px);
}

.btn-return {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-return:hover {
  border-color: rgba(255, 199, 0, 0.5);
  box-shadow: 0 0 20px rgba(255, 199, 0, 0.1);
  transform: translateY(-2px);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.btn-main {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.btn-sub {
  font-size: 10px;
  opacity: 0.7;
  letter-spacing: 0.1em;
  font-family: 'Courier New', monospace;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-micro) ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .mission-report {
  animation: reportIn var(--duration-macro) var(--ease-spring);
}

.modal-leave-active .mission-report {
  animation: reportOut var(--duration-micro) ease forwards;
}

@keyframes reportIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes reportOut {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
}

/* 无障碍 */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.01ms !important;
  }
  
  .modal-enter-active .mission-report,
  .modal-leave-active .mission-report {
    animation: none !important;
  }
  
  .report-scan,
  .mission-badge {
    animation: none !important;
  }
}
</style>
