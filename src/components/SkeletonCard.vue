<template>
  <div class="skeleton-card">
    <div class="skeleton-badge"></div>
    <div class="skeleton-content">
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-desc"></div>
      <div class="skeleton-line skeleton-meta"></div>
    </div>
    <div class="skeleton-tail"></div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: var(--radius-lg);
  background: var(--bg-panel-strong);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

.skeleton-badge,
.skeleton-line,
.skeleton-tail {
  background: linear-gradient(90deg, #e8eff7 0%, #f7fbff 50%, #e8eff7 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}

.skeleton-badge {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  border-radius: 999px;
}

.skeleton-title {
  width: 62%;
  height: 16px;
}

.skeleton-desc {
  width: 78%;
  height: 12px;
}

.skeleton-meta {
  width: 42%;
  height: 12px;
}

.skeleton-tail {
  width: 24px;
  height: 24px;
  border-radius: 10px;
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
  .skeleton-badge,
  .skeleton-line,
  .skeleton-tail {
    animation: none;
    background: #e8eff7;
  }
}
</style>
