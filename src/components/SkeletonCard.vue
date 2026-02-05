<template>
  <div class="skeleton-card">
    <div class="skeleton-circle"></div>
    <div class="skeleton-content">
      <div class="skeleton-line skeleton-line-title"></div>
      <div class="skeleton-line skeleton-line-short"></div>
    </div>
    <div class="skeleton-arrow"></div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: linear-gradient(145deg, #f0f0e8 0%, #e8e8e0 100%);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.05),
    inset -2px -2px 4px rgba(255, 255, 255, 0.8);
}

.skeleton-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, #e0e0d5 25%, #d5d5c8 50%, #e0e0d5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 14px;
  border-radius: 7px;
  background: linear-gradient(90deg, #e0e0d5 25%, #d5d5c8 50%, #e0e0d5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line-title {
  width: 70%;
}

.skeleton-line-short {
  width: 40%;
  height: 10px;
}

.skeleton-arrow {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0d5 25%, #d5d5c8 50%, #e0e0d5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-circle,
  .skeleton-line,
  .skeleton-arrow {
    animation: none;
    background: #e0e0d5;
  }
}
</style>
