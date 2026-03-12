# NumberPad 激活态优化设计方案

**日期**: 2026-03-12
**主题**: 游戏界面数字键盘按钮激活态优化
**状态**: 已批准

---

## 1. 需求背景

用户反馈：游戏界面（数字键盘 NumberPad）的按钮激活态不够明显，特别是缺少颜色变化。

当前实现仅使用 `transform: scale(0.95)` 和轻微的阴影变化，在移动端触摸时反馈不够清晰。

---

## 2. 设计方案

### 方案选择：方案一（加深背景色）

**选择理由**：
- 最符合项目「简约优先」设计原则
- 改动最小，性能最优
- 各按钮统一应用，保持视觉一致性

### 改动详情

| 按钮类型 | 默认背景色 | 激活态背景色 |
|----------|-----------|-------------|
| 数字键 (0-9) | `#FFFFFF` (白色) | `#F0F4F8` (浅灰蓝) |
| 删除键 | `#FFF5F0` (浅橙) | `#FFD5C8` (加深橙) |
| 确认键 | `#00D084` (绿色) | `#00B870` (加深绿) |

### CSS 改动

**文件**: `src/components/NumberPad.vue`

```css
/* 数字键激活态 */
.num-btn:active:not(:disabled) {
  transform: scale(0.95);
  background: #F0F4F8;        /* 新增 */
  box-shadow: var(--shadow-sm);
}

/* 删除键激活态 */
.btn-delete:active:not(:disabled) {
  transform: scale(0.95);
  background: #FFD5C8;        /* 新增：加深橙色 */
}

/* 确认键激活态 */
.btn-submit:active:not(:disabled) {
  transform: scale(0.95);
  background: #00B870;         /* 新增：加深绿色 */
  box-shadow: 0 0 15px rgba(0, 208, 132, 0.4);  /* 发光增强 */
}
```

---

## 3. 验收标准

- [ ] 数字键 0-9 按下时背景变为浅灰蓝 (#F0F4F8)
- [ ] 删除键按下时背景变为深橙色 (#FFD5C8)
- [ ] 确认键按下时背景变为深绿色 (#00B870) + 发光增强
- [ ] 释放后恢复默认状态
- [ ] 响应式正常（移动端/桌面端）
- [ ] 无 lint 错误

---

## 4. 实施计划

1. 修改 `src/components/NumberPad.vue` 中的 CSS
2. 运行 lint 检查
3. 本地测试验证效果
