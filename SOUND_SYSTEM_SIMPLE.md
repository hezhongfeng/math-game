# 数感闯关音频系统

> 软件全称：数感闯关儿童数学启蒙训练软件｜产品简称：数感闯关｜软件版本：V1.0

当前音频系统由 Web Audio 合成交互音效，并用本地 MP3 播放结算鼓励语音。实现集中在 `src/composables/useSound.js`。

## 设计目标

- 声音短、清晰、不过度刺激。
- 高频操作有冷却，避免连点叠音。
- 同一轮只播放一条结算主反馈。
- iOS 音频上下文被中断后可恢复。
- 音频不可用时不阻塞游戏。

音效和振动默认开启，目前没有设置开关。

## 核心文件

| 文件 | 作用 |
|------|------|
| `src/config/constants.js` | master gain、冷却、频率和播放参数 |
| `src/composables/useSound.js` | AudioContext 生命周期和播放 API |
| `public/audio/praise/*.mp3` | 本地结算语音 |
| `tests/unit/useSound.spec.js` | 语音选择、恢复和生命周期测试 |

## 输出链路

```text
Oscillator / AudioBufferSource
          ↓
      Master Gain
          ↓
       Low-pass
          ↓
      Destination
```

所有音频共享一个 AudioContext、master gain 和 low-pass filter。

## 播放 API

`useSound()` 返回：

```javascript
const {
  playClick,
  playKeyPress,
  playDelete,
  playSubmit,
  playCorrect,
  playWrong,
  playQuestion,
  playBack,
  playVictory,
  playUnlock,
  playResultPraise,
  stopPraise
} = useSound()
```

组件应调用语义化方法，不直接创建振荡器或新的 AudioContext。

## 反馈策略

| 场景 | 行为 |
|------|------|
| 点击/数字/删除 | 短三角波或下滑音 |
| 提交 | 短上行音序 |
| 正确 | 明亮上行音序 |
| 错误 | 温和下降音 |
| 下一题 | 低音量提示音 |
| 返回 | 短下降音 |
| 通关 | 庆祝音序 |
| 解锁 | 独立高音提示 |

具体频率和时长以 `AUDIO_FREQUENCIES`、`AUDIO_PARAMS` 为准，不在本文复制易漂移的数值。

## 结算语音

语音 key：

- `new-best`
- `review-perfect`
- `review-more`
- `perfect`
- `great-pass`
- `pass`
- `try-again`

选择优先级：

1. 新纪录
2. 错题重练
3. 满分
4. 高分通过
5. 普通通过
6. 再试一次

胜利或解锁音先播放，主反馈语音延后。重新开始、返回或组件卸载时必须调用 `stopPraise()` 清理待播和正在播放的语音。

本地 MP3 已包含在 PWA 的预缓存类型中，不依赖联网语音服务。

## 移动端生命周期

- 首次用户交互时初始化或恢复 AudioContext。
- `visibilitychange`、`pagehide` 和 `pageshow` 覆盖锁屏、切后台和页面缓存恢复。
- 页面隐藏时停止鼓励语音，丢弃未播放的反馈；返回后的首次点按重建上下文，兼容 Safari 状态仍为 `running` 却无声的情况。
- 在捕获阶段监听 `touchend`、`click` 和 `keydown`，先恢复音频再处理按钮；`resume()` 最多等待 800ms，失败时留待下次交互重试。
- 播放前再次检查上下文、前台状态和恢复代次，防止旧反馈在解锁后补播。重建时关闭旧上下文，复用已解码的本地语音。
- 多个页面组件共用恢复监听，最后一个使用者卸载后才移除。
- iOS 物理静音、系统策略或浏览器限制仍可能导致无声，应静默降级。

## 调整音效

1. 在 `src/config/constants.js` 修改对应频率或参数。
2. 保持增益克制，避免多个音序叠加失真。
3. 不绕过冷却机制。
4. 更新或新增 `useSound.spec.js`。
5. 在 Android Chrome 和 iOS Safari 真机检查。

## 验证

```bash
pnpm run test:unit -- useSound
pnpm run test:e2e
```

自动化测试不能验证主观听感和 iOS 物理静音行为。音频变化需要游戏内实听。

iPhone 真机回归：分别用 Safari 和添加到主屏幕的应用进入做题，确认按键音正常；锁屏至少 10 秒后解锁，第一次点数字应恢复按键音，并继续检查正确、错误和结算反馈。重复两次，再检查切到其他应用后返回的情况。
