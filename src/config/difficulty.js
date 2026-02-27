// 难度配置：定义15个循序渐进的难度等级

const DIFFICULTY_LEVELS = [
  // 0-3 数值范围 - 成功绿
  {
    id: 1,
    name: '入门1',
    level: '入门',
    range: [0, 3],
    operation: 'add',
    questionCount: 20,
    description: '0-3 以内加法',
    color: 'bg-game-success-light',
    textColor: 'text-game-success-dark',
    stars: 1
  },
  {
    id: 2,
    name: '入门2',
    level: '入门',
    range: [0, 3],
    operation: 'subtract',
    questionCount: 20,
    description: '0-3 以内减法',
    color: 'bg-game-success',
    textColor: 'text-game-success-dark',
    stars: 1
  },
  {
    id: 3,
    name: '入门3',
    level: '入门',
    range: [0, 3],
    operation: 'mixed',
    questionCount: 20,
    description: '0-3 加减混合',
    color: 'bg-game-success-dark',
    textColor: 'text-game-success-dark',
    stars: 2
  },
  // 0-5 数值范围 - 主色蓝
  {
    id: 4,
    name: '初级1',
    level: '初级',
    range: [0, 5],
    operation: 'add',
    questionCount: 20,
    description: '0-5 以内加法',
    color: 'bg-game-primary-light',
    textColor: 'text-game-primary-dark',
    stars: 2
  },
  {
    id: 5,
    name: '初级2',
    level: '初级',
    range: [0, 5],
    operation: 'subtract',
    questionCount: 20,
    description: '0-5 以内减法',
    color: 'bg-game-primary',
    textColor: 'text-game-primary-dark',
    stars: 2
  },
  {
    id: 6,
    name: '初级3',
    level: '初级',
    range: [0, 5],
    operation: 'mixed',
    questionCount: 20,
    description: '0-5 加减混合',
    color: 'bg-game-primary-dark',
    textColor: 'text-game-primary-dark',
    stars: 3
  },
  // 0-10 数值范围 - 强调黄
  {
    id: 7,
    name: '中级1',
    level: '中级',
    range: [0, 10],
    operation: 'add',
    questionCount: 24,
    description: '0-10 以内加法',
    color: 'bg-game-accent-light',
    textColor: 'text-game-accent-dark',
    stars: 3
  },
  {
    id: 8,
    name: '中级2',
    level: '中级',
    range: [0, 10],
    operation: 'subtract',
    questionCount: 24,
    description: '0-10 以内减法',
    color: 'bg-game-accent',
    textColor: 'text-game-accent-dark',
    stars: 3
  },
  {
    id: 9,
    name: '中级3',
    level: '中级',
    range: [0, 10],
    operation: 'mixed',
    questionCount: 24,
    description: '0-10 加减混合',
    color: 'bg-game-accent-dark',
    textColor: 'text-game-accent-dark',
    stars: 4
  },
  // 0-20 数值范围 - 警告橙
  {
    id: 10,
    name: '进级1',
    level: '进级',
    range: [0, 20],
    operation: 'add',
    questionCount: 28,
    description: '0-20 以内加法',
    color: 'bg-game-warning-light',
    textColor: 'text-game-warning-dark',
    stars: 4
  },
  {
    id: 11,
    name: '进级2',
    level: '进级',
    range: [0, 20],
    operation: 'subtract',
    questionCount: 28,
    description: '0-20 以内减法',
    color: 'bg-game-warning',
    textColor: 'text-game-warning-dark',
    stars: 4
  },
  {
    id: 12,
    name: '进级3',
    level: '进级',
    range: [0, 20],
    operation: 'mixed',
    questionCount: 28,
    description: '0-20 加减混合',
    color: 'bg-game-warning-dark',
    textColor: 'text-game-warning-dark',
    stars: 5
  },
  // 0-100 数值范围 - 错误红
  {
    id: 13,
    name: '高级1',
    level: '高级',
    range: [0, 100],
    operation: 'add',
    questionCount: 32,
    description: '0-100 以内加法',
    color: 'bg-game-error-light',
    textColor: 'text-game-error-dark',
    stars: 5
  },
  {
    id: 14,
    name: '高级2',
    level: '高级',
    range: [0, 100],
    operation: 'subtract',
    questionCount: 32,
    description: '0-100 以内减法',
    color: 'bg-game-error',
    textColor: 'text-game-error-dark',
    stars: 5
  },
  {
    id: 15,
    name: '高级3',
    level: '高级',
    range: [0, 100],
    operation: 'mixed',
    questionCount: 32,
    description: '0-100 加减混合',
    color: 'bg-game-error-dark',
    textColor: 'text-game-error-dark',
    stars: 5
  }
]

// 按等级分组
export const DIFFICULTY_GROUPS = [
  { name: '入门', levels: [1, 2, 3], color: 'green' },
  { name: '初级', levels: [4, 5, 6], color: 'blue' },
  { name: '中级', levels: [7, 8, 9], color: 'yellow' },
  { name: '进级', levels: [10, 11, 12], color: 'orange' },
  { name: '高级', levels: [13, 14, 15], color: 'red' }
]

// 总关卡数
export const TOTAL_LEVELS = DIFFICULTY_LEVELS.length

// 根据 ID 获取难度配置
export function getDifficultyById(id) {
  return DIFFICULTY_LEVELS.find(d => d.id === parseInt(id))
}
