// 难度配置：定义15个循序渐进的难度等级

export const DIFFICULTY_LEVELS = [
  // 1-3 数值范围
  {
    id: 1,
    name: '入门1',
    level: '入门',
    range: [1, 3],
    operation: 'add',
    questionCount: 10,
    description: '1-3 以内加法',
    color: 'bg-green-400',
    textColor: 'text-green-600',
    stars: 1
  },
  {
    id: 2,
    name: '入门2',
    level: '入门',
    range: [1, 3],
    operation: 'subtract',
    questionCount: 10,
    description: '1-3 以内减法',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    stars: 1
  },
  {
    id: 3,
    name: '入门3',
    level: '入门',
    range: [1, 3],
    operation: 'mixed',
    questionCount: 10,
    description: '1-3 加减混合',
    color: 'bg-green-600',
    textColor: 'text-green-800',
    stars: 2
  },
  // 1-5 数值范围
  {
    id: 4,
    name: '初级1',
    level: '初级',
    range: [1, 5],
    operation: 'add',
    questionCount: 12,
    description: '1-5 以内加法',
    color: 'bg-blue-400',
    textColor: 'text-blue-600',
    stars: 2
  },
  {
    id: 5,
    name: '初级2',
    level: '初级',
    range: [1, 5],
    operation: 'subtract',
    questionCount: 12,
    description: '1-5 以内减法',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    stars: 2
  },
  {
    id: 6,
    name: '初级3',
    level: '初级',
    range: [1, 5],
    operation: 'mixed',
    questionCount: 12,
    description: '1-5 加减混合',
    color: 'bg-blue-600',
    textColor: 'text-blue-800',
    stars: 3
  },
  // 1-10 数值范围
  {
    id: 7,
    name: '中级1',
    level: '中级',
    range: [1, 10],
    operation: 'add',
    questionCount: 15,
    description: '1-10 以内加法',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-600',
    stars: 3
  },
  {
    id: 8,
    name: '中级2',
    level: '中级',
    range: [1, 10],
    operation: 'subtract',
    questionCount: 15,
    description: '1-10 以内减法',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    stars: 3
  },
  {
    id: 9,
    name: '中级3',
    level: '中级',
    range: [1, 10],
    operation: 'mixed',
    questionCount: 15,
    description: '1-10 加减混合',
    color: 'bg-yellow-600',
    textColor: 'text-yellow-800',
    stars: 4
  },
  // 1-20 数值范围
  {
    id: 10,
    name: '进级1',
    level: '进级',
    range: [1, 20],
    operation: 'add',
    questionCount: 20,
    description: '1-20 以内加法',
    color: 'bg-orange-400',
    textColor: 'text-orange-600',
    stars: 4
  },
  {
    id: 11,
    name: '进级2',
    level: '进级',
    range: [1, 20],
    operation: 'subtract',
    questionCount: 20,
    description: '1-20 以内减法',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    stars: 4
  },
  {
    id: 12,
    name: '进级3',
    level: '进级',
    range: [1, 20],
    operation: 'mixed',
    questionCount: 20,
    description: '1-20 加减混合',
    color: 'bg-orange-600',
    textColor: 'text-orange-800',
    stars: 5
  },
  // 1-100 数值范围
  {
    id: 13,
    name: '高级1',
    level: '高级',
    range: [1, 100],
    operation: 'add',
    questionCount: 25,
    description: '1-100 以内加法',
    color: 'bg-red-400',
    textColor: 'text-red-600',
    stars: 5
  },
  {
    id: 14,
    name: '高级2',
    level: '高级',
    range: [1, 100],
    operation: 'subtract',
    questionCount: 25,
    description: '1-100 以内减法',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    stars: 5
  },
  {
    id: 15,
    name: '高级3',
    level: '高级',
    range: [1, 100],
    operation: 'mixed',
    questionCount: 25,
    description: '1-100 加减混合',
    color: 'bg-red-600',
    textColor: 'text-red-800',
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

// 根据 ID 获取难度配置
export function getDifficultyById(id) {
  return DIFFICULTY_LEVELS.find(d => d.id === parseInt(id))
}

// 获取难度列表
export function getDifficultyLevelsByGroup(groupName) {
  const group = DIFFICULTY_GROUPS.find(g => g.name === groupName)
  if (!group) return []
  return group.levels.map(id => getDifficultyById(id))
}
