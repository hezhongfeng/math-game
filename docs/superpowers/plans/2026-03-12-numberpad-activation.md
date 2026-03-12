# NumberPad 激活态优化实施计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan.

**目标:** 为数字键盘按钮添加背景色变化的激活态，使触摸反馈更明显

**方案:** 在 NumberPad.vue 中修改 CSS，为数字键、删除键、确认键的 `:active` 状态添加背景色变化

**技术栈:** Vue 3, CSS

---

## Task 1: 修改 NumberPad.vue CSS

**文件:**
- 修改: `src/components/NumberPad.vue`

- [ ] **Step 1: 修改数字键激活态 CSS**

在 `.num-btn:active:not(:disabled)` 中添加 `background: #F0F4F8;`

```css
.num-btn:active:not(:disabled) {
  transform: scale(0.95);
  background: #F0F4F8;        /* 新增 */
  box-shadow: var(--shadow-sm);
}
```

- [ ] **Step 2: 修改删除键激活态 CSS**

在 `.btn-delete:active:not(:disabled)` 中添加 `background: #FFD5C8;`

```css
.btn-delete:active:not(:disabled) {
  transform: scale(0.95);
  background: #FFD5C8;        /* 新增 */
}
```

- [ ] **Step 3: 修改确认键激活态 CSS**

在 `.btn-submit:active:not(:disabled)` 中修改背景和阴影

```css
.btn-submit:active:not(:disabled) {
  transform: scale(0.95);
  background: #00B870;                   /* 新增：加深绿色 */
  box-shadow: 0 0 15px rgba(0, 208, 132, 0.4);  /* 发光增强 */
}
```

- [ ] **Step 4: 运行 lint 检查**

```bash
npm run lint
```

预期: 无错误

- [ ] **Step 5: 验证构建**

```bash
npm run build
```

预期: 构建成功
