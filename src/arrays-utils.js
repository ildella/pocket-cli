module.exports = {
  intersection: arrays => {
    return arrays.reduce((a, b) => a.filter(c => b.includes(c)))
  },

  reverseIntersection: arrays => {
    return arrays.reduce((a, b) => a.filter(c => !b.includes(c)))
  }
}
