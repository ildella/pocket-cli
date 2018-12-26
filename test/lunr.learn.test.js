const lunr = require('lunr')

test('learn 1', () => {
  const idx = lunr(function () {
    this.field('title')
    this.field('body')

    this.add({
      'title': 'Twelfth-Night',
      'body': 'If music be the food of love, play on: Give me excess of it…',
      'author': 'William Shakespeare',
      'id': '1'
    })
  })
  const result = idx.search('love')
  expect(result).toEqual([
    {
      'matchData': {'metadata': {'love': {'body': {}}}},
      'ref': '1',
      'score': 0.288
    }
  ])
  expect(idx.search('something else completely')).toEqual([])
  expect(idx.search('William Shakespeare')).toEqual([])
  expect(idx.search('William')).toEqual([])
})

test('tame 1', () => {
  const idx = lunr(function () {
    this.field('author')
    this.field('title')
    this.field('body')

    this.add({
      'title': 'Twelfth-Night',
      'body': 'If music be the food of love, play on: Give me excess of it…',
      'author': 'William Shakespeare',
      'id': '1'
    })
  })
  const results = idx.search('William')
  expect(results[0].score).toBe(0.288)
})
