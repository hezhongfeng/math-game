# Contributing Guide

Thank you for your interest in contributing to the Math Game for Children! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Adding New Features](#adding-new-features)
- [Reporting Bugs](#reporting-bugs)
- [Documentation](#documentation)

## 📝 Code of Conduct

This project is dedicated to providing a positive experience for children. Therefore:

- Keep all content child-friendly and age-appropriate
- Avoid adding any external dependencies without thorough review
- Prioritize performance and accessibility for young users
- Test thoroughly on mobile devices before submitting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- A modern code editor (VS Code recommended)
- Chrome DevTools for mobile device testing

### Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/math-game.git
cd math-game

# 3. Install dependencies
pnpm install
# or: npm install

# 4. Start development server
pnpm dev
```

The dev server will start at `http://localhost:5173`.

## 🔄 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `style/` - UI/styling changes

### 2. Make Changes

- Follow the [Code Style Guidelines](#code-style-guidelines)
- Test your changes on mobile devices using Chrome DevTools
- Verify accessibility (color contrast, touch targets)

### 3. Update Documentation

If your changes affect:
- **README.md**: Public-facing features, usage instructions
- **DESIGN.md**: UI/UX details, responsive design specs
- **CHANGELOG.md**: All notable code changes
- **CLAUDE.md**: Architecture changes, dependencies

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new difficulty level for multiplication"
```

See [Commit Message Guidelines](#commit-message-guidelines) for format.

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 💻 Code Style Guidelines

### Vue Components

Always use `<script setup>` syntax:

```vue
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['input', 'submit'])
</script>
```

### Import Order

1. Vue imports
2. Vue Router imports
3. External libraries
4. Internal composables (`../composables/*`)
5. Internal config (`../config/*`)
6. Internal utils (`../utils/*`)

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `NumberPad.vue` |
| Composables | camelCase with `use` prefix | `useGame` |
| Utilities | camelCase | `generateQuestions` |
| Constants | UPPER_SNAKE_CASE | `DIFFICULTY_LEVELS` |

### Styling

- Use Tailwind utility classes extensively
- Mobile-first responsive design
- Minimum touch target: 64×64px
- Always include `-webkit-tap-highlight-color: transparent`
- Always include `touch-action: manipulation`

Example:
```vue
<button class="min-h-[64px] min-w-[64px] md:min-h-[72px] active:scale-95
               -webkit-tap-highlight-color: transparent touch-action: manipulation">
```

### Error Handling

Never use empty catch blocks:

```javascript
try {
  const data = localStorage.getItem('key')
  return JSON.parse(data)
} catch (error) {
  console.error('Failed to load data:', error)
  return defaultValue
}
```

## 📝 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

提交说明约定：

- 提交信息尽量使用中文
- 若需要保留英文术语，可在中文语义下混用必要的代码标识、模块名或命令名

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or correcting tests
- `chore`: Build process, dependencies, etc.

### Examples

```bash
# Feature
feat: add multiplication difficulty levels

# Bug fix
fix: resolve iOS audio playback issue

# Documentation
docs: update mobile testing guide

# Refactoring
refactor(utils): extract audio synthesis logic

# Performance
perf: optimize particle animation rendering
```

## 🔍 Pull Request Process

1. **Ensure all checks pass**:
   - Code builds without errors: `npm run build`
   - E2E smoke passes: `pnpm run test:e2e`
   - No console errors in browser
   - Mobile testing completed

## 🧪 Testing Expectations

Before opening a PR, please run:

```bash
pnpm build
pnpm run test:e2e
```

For local debugging:

```bash
pnpm run test:e2e:headed
# or
pnpm run test:e2e:ui
```

If your change impacts gameplay flow, add or update at least one smoke test in `tests/e2e/`.

2. **Update documentation**:
   - Add changes to CHANGELOG.md
   - Update relevant docs if needed

3. **PR Description**:
   - Clearly describe what changed and why
   - Include screenshots for UI changes
   - List any breaking changes

4. **Review Process**:
   - Address reviewer feedback promptly
   - Keep commits clean (squash if needed)

## ➕ Adding New Features

### Adding a New Difficulty Level

1. Edit `src/config/difficulty.js`:
```javascript
{
  id: 16,
  name: '大师1',
  level: '大师',
  range: [1, 1000],
  operation: 'add',
  questionCount: 30,
  description: '1-1000 以内加法',
  color: 'bg-purple-400',
  textColor: 'text-purple-600',
  stars: 5
}
```

2. Update `DIFFICULTY_GROUPS` if adding a new group
3. Test the new level in-game
4. Update documentation

### Adding a New Sound Effect

1. Define frequency in `src/config/constants.js`:
```javascript
AUDIO_FREQUENCIES: {
  NEW_SOUND: [523.25, 659.25, 783.99] // C5, E5, G5
}
```

2. Add parameters in `AUDIO_PARAMS`
3. Implement a dedicated playback function in `src/composables/useSound.js`
4. Call that function from the relevant component or page

### Adding a New Component

1. Create file in `src/components/`
2. Use `<script setup>` syntax
3. Define props and emits explicitly
4. Add JSDoc comments for public methods
5. Ensure mobile-first responsive design
6. Add to relevant pages

## 🐛 Reporting Bugs

### Before Reporting

- Check if the issue already exists
- Test on different browsers/devices
- Verify it's not a known limitation

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- Device: [e.g. iPhone 12]
- OS: [e.g. iOS 17.2]
- Browser: [e.g. Safari]
- Version: [e.g. 1.0.0]

**Screenshots**
If applicable, add screenshots

**Additional Context**
Any other relevant information
```

## 📚 Documentation

### Documentation Structure

| File | Purpose | Update When... |
|------|---------|----------------|
| `README.md` | User-facing overview | Features, setup, usage change |
| `DESIGN.md` | Design specifications | UI/UX, responsive design changes |
| `AGENTS.md` | Developer guidelines | Code style, patterns change |
| `CLAUDE.md` | Architecture overview | Project structure, dependencies |
| `CHANGELOG.md` | Version history | Every code change |
| `CONTRIBUTING.md` | Contribution guide | Workflow, standards change |

### Documentation Style

- Use clear, concise language
- Include code examples
- Add tables for structured data
- Use emoji sparingly for visual cues
- Keep line length reasonable (<100 chars)

## 🧪 Testing Checklist

Before submitting a PR, verify:

### Functionality
- [ ] Game starts correctly
- [ ] All difficulty levels work
- [ ] Score calculation is accurate
- [ ] LocalStorage persistence works
- [ ] Wrong-answer flow requires manual confirmation before continuing

### Mobile
- [ ] Tested on Chrome DevTools mobile devices
- [ ] Touch targets are appropriate size (≥64px)
- [ ] No horizontal scroll issues
- [ ] Safe areas work on notched devices

### Audio
- [ ] Sound effects play on interaction
- [ ] iOS Safari audio works
- [ ] No audio errors in console

### Accessibility
- [ ] Color contrast is sufficient
- [ ] Interactive elements are focusable
- [ ] Touch feedback is visible

## 🚀 Release PR Checklist

For PRs that will be merged into `master`, verify:

- [ ] `pnpm build` passes
- [ ] `pnpm run test:e2e` passes
- [ ] Core flow is smoke-tested on mobile browser (iOS Safari / Android Chrome)
- [ ] No new console errors during normal gameplay
- [ ] LocalStorage schema changes (if any) are backward compatible
- [ ] PWA update prompt still works after the change
- [ ] Related docs are updated (`README`, `DESIGN`, `ARCHITECTURE`, etc.)
- [ ] `CHANGELOG.md` has an `Unreleased` entry

## 💡 Questions?

If you have questions or need clarification:

1. Check existing documentation first
2. Search closed issues on GitHub
3. Open a new issue with the "question" label

Thank you for contributing! 🎉
