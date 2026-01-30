# 游戏界面字体优化计划

## 问题分析

当前游戏界面字体偏小，特别是：
1. **题目卡片中的数字**：2.2rem (~35px) 对儿童不够醒目
2. **数字键盘按钮**：text-3xl (30px) 在手机上偏小
3. **运算符**：2.2rem (~35px) 与数字不协调
4. **答案反馈**：48px 需要更大更醒目

## 优化方案

### 1. NumberCard.vue - 题目数字放大

**当前值：**
- size-normal: 2.2rem (~35px)
- size-large: 2.6rem (~42px)

**优化后：**
- size-normal: 2.8rem (~45px) 
- size-large: 3.2rem (~51px)

**桌面端响应式：**
- size-normal: 3.2rem (~51px)
- size-large: 3.6rem (~58px)

### 2. NumberPad.vue - 键盘数字放大

**当前值：**
- text-3xl (30px) / text-4xl (36px)

**优化后：**
- 使用 text-4xl (36px) 作为基础
- 桌面端使用自定义 2.5rem (40px)
- 同时增大按钮尺寸：64px→72px, 72px→80px
- 图标也相应增大

### 3. QuestionCard.vue - 运算符放大

**当前值：**
- operator: 2.2rem (~35px)
- equals-operator: 2.2rem (~35px)

**优化后：**
- operator: 2.8rem (~45px)
- equals-operator: 2.8rem (~45px)

**桌面端：**
- operator: 3.2rem (~51px)
- equals-operator: 3.2rem (~51px)

### 4. Game.vue - 答案反馈放大

**当前值：**
- answer-number: text-child-4xl (46px)

**优化后：**
- answer-number: 使用 4rem (64px) 超大字体

## 任务清单 (TODO)

- [ ] 1. 修改 NumberCard.vue 题目数字大小
  - [ ] size-normal: 2.2rem → 2.8rem
  - [ ] size-large: 2.6rem → 3.2rem
  - [ ] 桌面端 size-normal: 2.6rem → 3.2rem
  - [ ] 桌面端 size-large: 3rem → 3.6rem

- [ ] 2. 修改 NumberPad.vue 键盘数字和按钮大小
  - [ ] 数字按钮字体: text-3xl → text-4xl (36px)
  - [ ] 增大按钮最小尺寸: 64px → 72px
  - [ ] 桌面端按钮尺寸: 72px → 80px
  - [ ] 增大删除和确认图标尺寸

- [ ] 3. 修改 QuestionCard.vue 运算符大小
  - [ ] operator: 2.2rem → 2.8rem
  - [ ] equals-operator: 2.2rem → 2.8rem
  - [ ] 桌面端 operator: 2.6rem → 3.2rem
  - [ ] 桌面端 equals-operator: 2.6rem → 3.2rem

- [ ] 4. 修改 Game.vue 答案反馈字体
  - [ ] answer-number: text-child-4xl → 4rem (64px)
  - [ ] 确保提示文字保持合适大小

- [ ] 5. 构建验证
  - [ ] 运行 npm run build 确保无错误
  - [ ] 检查所有修改是否正确应用

## 文件清单

| 文件 | 修改内容 |
|------|----------|
| `src/components/NumberCard.vue` | 放大题目数字 35px→45px, 42px→51px |
| `src/components/NumberPad.vue` | 放大键盘数字 30px→36px, 按钮尺寸增大 |
| `src/components/QuestionCard.vue` | 放大运算符 35px→45px |
| `src/pages/Game.vue` | 放大答案反馈 46px→64px |

## 预期效果

- 题目数字更加醒目，儿童易于识别
- 键盘按钮更大，减少误触
- 整体视觉效果更加饱满
- 保持各元素之间的比例协调

## 设计原则

- **移动优先**：先确保手机端字体够大（最小 36px）
- **渐进增强**：桌面端可以更大但不要过度
- **保持一致**：数字、运算符、按钮之间的比例协调
- **儿童友好**：目标用户是儿童，需要比常规应用更大的字体
