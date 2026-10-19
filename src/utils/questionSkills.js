/**
 * 根据算式的数量范围和关系识别训练能力，不依赖持久化标签或答案表现。
 * @param {Object} question - 加减或缺项题
 * @returns {string} 内部能力键，不在儿童题面展示
 */
export function getQuestionSkill(question) {
  const { operand1, operand2, operator } = question || {}
  if (![operand1, operand2].every((value) => Number.isInteger(value) && value >= 0) ||
      !['+', '-'].includes(operator)) return 'unknown'

  const result = operator === '+' ? operand1 + operand2 : operand1 - operand2
  if (result < 0) return 'unknown'
  const largest = Math.max(operand1, operand2, result)
  const range = largest <= 5 ? 'within5' : largest <= 10 ? 'within10' : 'within20'
  const missingPart = question.missingPart || 'answer'

  if (missingPart !== 'answer') {
    if (operator !== '+' || !['operand1', 'operand2'].includes(missingPart)) return 'unknown'
    return `${range}:${result === 10 ? 'ten-complement' : 'missing-addend'}:${missingPart}`
  }

  let skill
  if (operator === '+') {
    if (result === 10) skill = 'make-ten'
    else if (operand1 < 10 && operand2 < 10 && result > 10) skill = 'bridge-add'
    else if (Math.max(operand1, operand2) >= 10) skill = 'teen-add'
    else if (operand1 === operand2 && operand1 > 0) skill = 'doubles'
    else if (Math.min(operand1, operand2) <= 2) skill = 'add-small-step'
    else skill = 'add'
  } else {
    if (operand1 > 10 && operand2 < 10 && result < 10) skill = 'bridge-subtract'
    else if (operand1 === 10) skill = 'subtract-from-ten'
    else if (operand1 > 10 && result >= 10) skill = 'teen-subtract'
    else skill = operand2 <= 2 ? 'subtract-small-step' : 'subtract'
  }
  return `${range}:${skill}`
}
