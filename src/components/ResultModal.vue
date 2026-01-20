<script setup>
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
      <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-cute-xl p-8 max-w-md w-full shadow-cute-lg border-4 border-peppa-blue-light animate-scaleIn">
          <div class="text-center mb-6">
            <div class="text-6xl mb-3 animate-bounce-happy">⚽</div>
            <h2 class="text-3xl font-bold text-peppa-blue-dark font-rounded mb-2">游戏结束！</h2>
            <div v-if="isNewBest" class="inline-block bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-lg shadow-cute mb-4">🏆 新纪录！</div>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between items-center p-4 bg-white rounded-cute-lg border-3 border-peppa-blue-light shadow-cute">
              <span class="text-peppa-blue-dark font-rounded flex items-center gap-2">⭐ 得分</span>
              <span class="text-2xl font-bold text-peppa-blue-dark font-rounded">{{ result.score }}</span>
            </div>
            <div class="flex justify-between items-center p-4 bg-white rounded-cute-lg border-3 border-peppa-green shadow-cute">
              <span class="text-peppa-green-dark font-rounded flex items-center gap-2">✅ 正确数</span>
              <span class="text-2xl font-bold text-peppa-green font-rounded">{{ result.correctCount }}/{{ result.totalCount }}</span>
            </div>
            <div class="flex justify-between items-center p-4 bg-white rounded-cute-lg border-3 border-peppa-cyan shadow-cute">
              <span class="text-peppa-cyan-dark font-rounded flex items-center gap-2">📊 正确率</span>
              <span class="text-2xl font-bold text-peppa-cyan font-rounded">{{ result.accuracy }}%</span>
            </div>
            <div class="flex justify-between items-center p-4 bg-white rounded-cute-lg border-3 border-peppa-yellow shadow-cute">
              <span class="text-peppa-yellow-dark font-rounded flex items-center gap-2">⏱️ 用时</span>
              <span class="text-xl font-bold text-peppa-yellow-dark font-rounded">{{ formatTime(result.duration) }}</span>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="handleRetry"
              class="flex-1 bg-gradient-to-r from-peppa-blue to-peppa-blue-dark text-white font-bold py-4 px-6 rounded-cute-lg hover:from-peppa-blue-dark hover:to-[#2A70C2] transition-all shadow-cute hover:shadow-cute-lg active:scale-95 font-rounded text-lg"
            >
              🔄 再玩一次
            </button>
            <button
              @click="handleHome"
              class="flex-1 bg-white text-peppa-blue-dark border-3 border-peppa-blue-light font-bold py-4 px-6 rounded-cute-lg hover:bg-[#E3F2FD]/30 transition-all shadow-cute hover:shadow-cute-lg active:scale-95 font-rounded text-lg"
            >
              🏠 返回主页
            </button>
          </div>

          <div class="mt-4 text-center text-sm text-peppa-blue-dark/50 font-rounded">
            ⚽ 快乐学习数学 ⚽
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-gradient-to-br,
.modal-leave-active .bg-gradient-to-br {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .bg-gradient-to-br,
.modal-leave-to .bg-gradient-to-br {
  transform: scale(0.9);
  opacity: 0;
}
</style>
