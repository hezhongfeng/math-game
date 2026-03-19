const DIFFICULTY_LEVELS = [
  {
    id: 1,
    name: '入门1',
    level: '入门',
    range: [0, 3],
    operation: 'add',
    questionCount: 20,
    description: '0-3 以内加法',
    color: 'var(--candy-mint-light)',
    textColor: 'var(--candy-mint-dark)',
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
    color: 'var(--candy-mint)',
    textColor: 'var(--candy-mint-dark)',
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
    color: 'var(--candy-mint-dark)',
    textColor: 'var(--candy-mint-dark)',
    stars: 2
  },
  {
    id: 4,
    name: '初级1',
    level: '初级',
    range: [0, 5],
    operation: 'add',
    questionCount: 20,
    description: '0-5 以内加法',
    color: 'var(--candy-pink-light)',
    textColor: 'var(--candy-pink-dark)',
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
    color: 'var(--candy-pink)',
    textColor: 'var(--candy-pink-dark)',
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
    color: 'var(--candy-pink-dark)',
    textColor: 'var(--candy-pink-dark)',
    stars: 3
  },
  {
    id: 7,
    name: '中级1',
    level: '中级',
    range: [0, 10],
    operation: 'add',
    questionCount: 24,
    description: '0-10 以内加法',
    color: 'var(--candy-yellow-light)',
    textColor: 'var(--candy-yellow-dark)',
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
    color: 'var(--candy-yellow)',
    textColor: 'var(--candy-yellow-dark)',
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
    color: 'var(--candy-yellow-dark)',
    textColor: 'var(--candy-yellow-dark)',
    stars: 4
  },
  {
    id: 10,
    name: '进级1',
    level: '进级',
    range: [0, 20],
    operation: 'add',
    questionCount: 28,
    description: '0-20 以内加法',
    color: 'var(--candy-peach-light)',
    textColor: 'var(--candy-peach-dark)',
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
    color: 'var(--candy-peach)',
    textColor: 'var(--candy-peach-dark)',
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
    color: 'var(--candy-peach-dark)',
    textColor: 'var(--candy-peach-dark)',
    stars: 5
  },
  {
    id: 13,
    name: '高级1',
    level: '高级',
    range: [0, 100],
    operation: 'add',
    questionCount: 32,
    description: '0-100 以内加法',
    color: 'var(--candy-lavender-light)',
    textColor: 'var(--candy-lavender-dark)',
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
    color: 'var(--candy-lavender)',
    textColor: 'var(--candy-lavender-dark)',
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
    color: 'var(--candy-lavender-dark)',
    textColor: 'var(--candy-lavender-dark)',
    stars: 5
  }
]

export const DIFFICULTY_GROUPS = [
  { name: '入门', levels: [1, 2, 3], color: 'mint' },
  { name: '初级', levels: [4, 5, 6], color: 'pink' },
  { name: '中级', levels: [7, 8, 9], color: 'yellow' },
  { name: '进级', levels: [10, 11, 12], color: 'peach' },
  { name: '高级', levels: [13, 14, 15], color: 'lavender' }
]

export const TOTAL_LEVELS = DIFFICULTY_LEVELS.length

export function getDifficultyById(id) {
  return DIFFICULTY_LEVELS.find(d => d.id === parseInt(id))
}
