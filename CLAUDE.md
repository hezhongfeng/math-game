# CLAUDE.md

本项目的代理执行规范统一维护在 [`AGENTS.md`](./AGENTS.md)。请先阅读该文件。

快速上下文：

- Vue 3 + Vite 7 的 JavaScript 项目，不使用 TypeScript。
- 26 个渐进式关卡，题量为 20-40。
- 正确率达到 85% 通过；错题可单独重练。
- 每关保存与当前题量一致的本地前 10 名计时记录。
- `/explore` 使用 Three.js 展示 1-1000 十进制球阵。
- 音效、振动和本地结算语音默认开启。
- PWA 由 vite-plugin-pwa 生成，更新提示位于 `PWAUpdatePrompt.vue`。

开发和验证：

```bash
npm run dev
npm run build
npm run test:unit
npm run test:e2e
```

架构、组件和课程说明：

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- [`COMPONENTS.md`](./COMPONENTS.md)
- [`docs/DIFFICULTY_CURVE.md`](./docs/DIFFICULTY_CURVE.md)
