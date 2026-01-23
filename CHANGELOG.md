# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Background Music**:
  - Redesigned melody with 8-second loop (ABA structure)
  - Brighter, more cheerful children's song style
  - Default volume increased to 80%
  - Disabled by default (browsers block autoplay)
  - Fixed volume sync with settings persistence

- **Feedback Animations**:
  - Correct feedback: Green circle with ripple effect (instead of stars)
  - Wrong feedback: Orange circle with ripple effect
  - Feedback position adjusted to 38% from top (closer to question)
  - Removed unused CSS animations for cleaner codebase

- **Error Feedback Interaction**:
  - Wrong answer feedback now requires user click to dismiss
  - Shows "点击任意位置继续" (Tap to continue) hint
  - Allows users to see the correct answer before proceeding

- **Game Completion**:
  - Completed game now navigates to difficulty selection page
  - Result modal button changed from "返回主页" to "返回选择"

- **NumberPad**:
  - Removed "请等待..." overlay when disabled
  - Buttons now just show disabled state (grayed out)
  - Simpler UX since feedback overlay covers the screen

- **Difficulty Selection Page**:
  - Fixed excessive bottom padding/blank space
  - Footer is now fixed position at bottom
  - Page content more compact

### Fixed

- **Background Music**:
  - Resolved NaN display issue when volume is undefined
  - Fixed music not playing when toggled on
  - Settings now properly persist to LocalStorage

- **Game Logic**:
  - Fixed game completion detection on last question
  - Feedback overlay now properly dismissed on game complete

### Cleanup

- Removed duplicate `@keyframes rippleExpand` in Game.vue
- Removed unused `@keyframes cardBounce` in QuestionCard.vue
- Overall CSS reduced by ~170 bytes

## [1.0.0] - 2026-01-22

### Added

- **15 difficulty levels** across 5 stages (1-3, 1-5, 1-10, 1-20, 1-100)
- **Three operation types**: addition, subtraction, mixed
- **Game mechanics**:
  - Progressive difficulty unlock system
  - Score tracking (10 points per correct answer)
  - Best score persistence with LocalStorage
  - Accuracy and duration statistics
- **Feedback systems**:
  - Particle effects for correct/wrong answers
  - Sound effects (click, correct, wrong, win)
  - Haptic feedback (vibration) on mobile devices
  - Voice synthesis for question reading
  - Background music toggle
- **UI Components**:
  - Home page with jellyfish animations
  - Difficulty selection with progress tracking
  - Game page with question card and number pad
  - Result modal with detailed statistics
  - Score board with progress bar
  - Toast notifications
- **Mobile-first design**:
  - Touch-optimized buttons (64x64px minimum)
  - Safe area support for notched devices
  - iOS touch optimization (-webkit-tap-highlight-color)
  - Responsive design with md: breakpoints

### Changed

- **Styling**: Peppa Pig inspired color scheme (blue, green, orange, yellow)
- **Animations**: Custom cute rounded corner design (16px-40px)
- **Responsive**: Mobile-first approach with desktop enhancements

### Technical

- Vue 3 with Composition API and `<script setup>`
- Vite 7.x build tool
- Tailwind CSS 3.x with custom theme configuration
- Vue Router 4.x for navigation
- Pinia 3.x for state management
- Lucide Vue Next for icons
- LocalStorage for data persistence
- Web Audio API for dynamic sound generation
- Web Speech API for text-to-speech
- Vibration API for haptic feedback

[1.0.0]: https://github.com/code-yeongyu/math-game/releases/tag/v1.0.0
