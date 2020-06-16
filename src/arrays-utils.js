module.exports = {
  intersection: arrays => arrays.reduce((a, b) => a.filter(c => b.includes(c))),

  reverseIntersection: arrays => arrays.reduce((a, b) => a.filter(c => !b.includes(c)))
}
