# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
