/**
 * Calculates how many visual rows the decimal ball grid needs.
 * @param {number} count - Ball count in the exploration result.
 * @returns {number} Row count clamped to the visible 1–10 grid range.
 */
export function getResultBallRows(count) {
  return Math.max(1, Math.min(10, Math.ceil(count / 10)))
}

/**
 * Maps a ball count to the result stage shape class.
 * @param {number} count - Ball count in the exploration result.
 * @returns {string} CSS modifier class for the result ball stage.
 */
export function getResultBallStageClass(count) {
  const rows = getResultBallRows(count)

  if (rows <= 2) return 'result-ball-shell--wide'
  if (rows <= 5) return 'result-ball-shell--landscape'
  return 'result-ball-shell--square'
}
