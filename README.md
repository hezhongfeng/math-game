# 数学运算游戏

一个帮助儿童学习数学运算的教育游戏，通过循序渐进的难度设计，让孩子在玩乐中掌握加减法运算。

## 功能特性

- **15个难度等级**：涵盖5个数值范围（1-3、1-5、1-10、1-20、1-100），每个范围包含加法、减法、加减混合三个阶段
- **随机题目**：每次游戏生成不同的题目，确保新鲜感
- **实时反馈**：答对/答错即时提示
- **成绩记录**：本地保存最佳成绩和游戏进度
- **语音播报**：支持题目和反馈的语音播报（可开关）
- **儿童友好设计**：鲜艳色彩、圆润界面、动画效果

## 技术栈

- **前端框架**：Vue 3 + Vite
- **开发语言**：JavaScript
- **代码组织**：Composition API + Composables
- **样式方案**：Tailwind CSS
- **数据持久化**：LocalStorage
- **语音合成**：浏览器原生 Speech Synthesis API

## 项目结构

```
math-game/
├── src/
│   ├── assets/           # 静态资源
│   ├── components/        # 可复用组件
│   │   ├── QuestionCard.vue   # 题目卡片
│   │   ├── DifficultyCard.vue # 难度卡片
│   │   ├── ScoreBoard.vue     # 得分板
│   │   └── NumberPad.vue     # 数字键盘
│   ├── composables/       # Composables 函数
│   │   ├── useGame.js     # 游戏核心逻辑
│   │   ├── useStorage.js  # 本地存储
│   │   └── useSpeech.js   # 语音播报
│   ├── config/            # 配置文件
│   │   └── difficulty.js  # 难度配置
│   ├── utils/             # 工具函数
│   │   └── generator.js   # 题目生成器
│   ├── pages/             # 页面组件
│   │   ├── Home.vue            # 主页
│   │   ├── DifficultySelect.vue # 难度选择
│   │   └── Game.vue            # 游戏页
│   ├── App.vue
│   ├── main.js
│   ├── router.js          # 路由配置
│   └── style.css          # 全局样式
├── public/
├── package.json
└── vite.config.js
```

## 难度设计

### 入门阶段（1-3）
1. 入门1：1-3 以内加法（10题）
2. 入门2：1-3 以内减法（10题）
3. 入门3：1-3 加减混合（10题）

### 初级阶段（1-5）
4. 初级1：1-5 以内加法（12题）
5. 初级2：1-5 以内减法（12题）
6. 初级3：1-5 加减混合（12题）

### 中级阶段（1-10）
7. 中级1：1-10 以内加法（15题）
8. 中级2：1-10 以内减法（15题）
9. 中级3：1-10 加减混合（15题）

### 进级阶段（1-20）
10. 进级1：1-20 以内加法（20题）
11. 进级2：1-20 以内减法（20题）
12. 进级3：1-20 加减混合（20题）

### 高级阶段（1-100）
13. 高级1：1-100 以内加法（25题）
14. 高级2：1-100 以内减法（25题）
15. 高级3：1-100 加减混合（25题）

## 开发说明

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 使用说明

1. 打开游戏主页，点击"开始游戏"
2. 选择难度等级（需要从第一关开始逐步解锁）
3. 使用数字键盘输入答案
4. 答对得10分，答错不扣分但显示正确答案
5. 完成所有题目后查看成绩
6. 挑战更高难度的关卡

## 数据说明

游戏数据保存在浏览器的 LocalStorage 中，键名为 `math-game-data`，包含：
- `bestScores`：各难度的最佳成绩
- `progress`：游戏进度记录

如需清除所有数据，可在浏览器控制台执行：
```javascript
localStorage.removeItem('math-game-data')
```

## 浏览器兼容性

- Chrome/Edge：✅ 完全支持
- Firefox：✅ 完全支持
- Safari：✅ 完全支持
- 移动端浏览器：✅ 完全支持

注意：语音功能需要浏览器支持 Speech Synthesis API
