const DIFFICULTY_LEVELS = [
  {
    id: 1,
    name: '1',
    level: '1组',
    range: [0, 3],
    operation: 'add',
    questionCount: 20,
    description: '0-3  +',
    color: 'var(--candy-mint-light)',
    textColor: 'var(--candy-mint-dark)',
    stars: 1
  },
  {
    id: 2,
    name: '2',
    level: '1组',
    range: [0, 3],
    operation: 'subtract',
    questionCount: 20,
    description: '0-3  -',
    color: 'var(--candy-mint)',
    textColor: 'var(--candy-mint-dark)',
    stars: 1
  },
  {
    id: 3,
    name: '3',
    level: '1组',
    range: [0, 3],
    operation: 'mixed',
    questionCount: 20,
    description: '0-3  +-',
    color: 'var(--candy-mint-dark)',
    textColor: 'var(--candy-mint-dark)',
    stars: 2
  },
  {
    id: 4,
    name: '4',
    level: '2组',
    range: [0, 5],
    operation: 'add',
    questionCount: 20,
    description: '0-5  +',
    color: 'var(--candy-pink-light)',
    textColor: 'var(--candy-pink-dark)',
    stars: 2
  },
  {
    id: 5,
    name: '5',
    level: '2组',
    range: [0, 5],
    operation: 'subtract',
    questionCount: 20,
    description: '0-5  -',
    color: 'var(--candy-pink)',
    textColor: 'var(--candy-pink-dark)',
    stars: 2
  },
  {
    id: 6,
    name: '6',
    level: '2组',
    range: [0, 5],
    operation: 'mixed',
    questionCount: 20,
    description: '0-5  +-',
    color: 'var(--candy-pink-dark)',
    textColor: 'var(--candy-pink-dark)',
    stars: 3
  },
  {
    id: 7,
    name: '7',
    level: '3组',
    range: [0, 10],
    operation: 'add',
    questionCount: 20,
    description: '0-10  +',
    color: 'var(--candy-yellow-light)',
    textColor: 'var(--candy-yellow-dark)',
    stars: 3
  },
  {
    id: 8,
    name: '8',
    level: '3组',
    range: [0, 10],
    operation: 'subtract',
    questionCount: 20,
    description: '0-10  -',
    color: 'var(--candy-yellow)',
    textColor: 'var(--candy-yellow-dark)',
    stars: 3
  },
  {
    id: 9,
    name: '9',
    level: '3组',
    range: [0, 10],
    operation: 'mixed',
    questionCount: 20,
    description: '0-10  +-',
    color: 'var(--candy-yellow-dark)',
    textColor: 'var(--candy-yellow-dark)',
    stars: 4
  },
  {
    id: 10,
    name: '10',
    level: '4组',
    range: [0, 20],
    operation: 'add',
    questionCount: 20,
    description: '0-20  +',
    color: 'var(--candy-peach-light)',
    textColor: 'var(--candy-peach-dark)',
    stars: 4
  },
  {
    id: 11,
    name: '11',
    level: '4组',
    range: [0, 20],
    operation: 'subtract',
    questionCount: 20,
    description: '0-20  -',
    color: 'var(--candy-peach)',
    textColor: 'var(--candy-peach-dark)',
    stars: 4
  },
  {
    id: 12,
    name: '12',
    level: '4组',
    range: [0, 20],
    operation: 'mixed',
    questionCount: 20,
    description: '0-20  +-',
    color: 'var(--candy-peach-dark)',
    textColor: 'var(--candy-peach-dark)',
    stars: 5
  },
  {
    id: 13,
    name: '13',
    level: '5组',
    range: [0, 100],
    operation: 'add',
    questionCount: 20,
    description: '0-100  +',
    color: 'var(--candy-lavender-light)',
    textColor: 'var(--candy-lavender-dark)',
    stars: 5
  },
  {
    id: 14,
    name: '14',
    level: '5组',
    range: [0, 100],
    operation: 'subtract',
    questionCount: 20,
    description: '0-100  -',
    color: 'var(--candy-lavender)',
    textColor: 'var(--candy-lavender-dark)',
    stars: 5
  },
  {
    id: 15,
    name: '15',
    level: '5组',
    range: [0, 100],
    operation: 'mixed',
    questionCount: 20,
    description: '0-100  +-',
    color: 'var(--candy-lavender-dark)',
    textColor: 'var(--candy-lavender-dark)',
    stars: 5
  },
  {
    id: 16,
    name: '16',
    level: '6组',
    range: [0, 5],
    operation: 'missingAddStart',
    questionCount: 20,
    description: '0-5  ?',
    color: 'var(--candy-mint-light)',
    textColor: 'var(--candy-mint-dark)',
    stars: 3
  },
  {
    id: 17,
    name: '17',
    level: '6组',
    range: [0, 10],
    operation: 'missingAddStart',
    questionCount: 20,
    description: '0-10  ?',
    color: 'var(--candy-yellow-light)',
    textColor: 'var(--candy-yellow-dark)',
    stars: 4
  },
  {
    id: 18,
    name: '18',
    level: '6组',
    range: [0, 20],
    operation: 'missingAddMixed',
    questionCount: 20,
    description: '0-20  ?',
    color: 'var(--candy-peach-light)',
    textColor: 'var(--candy-peach-dark)',
    stars: 5
  }
]

export const DIFFICULTY_GROUPS = [
  { name: '1组', levels: [1, 2, 3], color: 'mint' },
  { name: '2组', levels: [4, 5, 6], color: 'pink' },
  { name: '3组', levels: [7, 8, 9], color: 'yellow' },
  { name: '4组', levels: [10, 11, 12], color: 'peach' },
  { name: '5组', levels: [13, 14, 15], color: 'lavender' },
  { name: '6组', levels: [16, 17, 18], color: 'mint' }
]

export const TOTAL_LEVELS = DIFFICULTY_LEVELS.length

export function getDifficultyById(id) {
  return DIFFICULTY_LEVELS.find(d => d.id === parseInt(id))
}
