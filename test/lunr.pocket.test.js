const lunr = require('lunr')
const mockDocs = require('./mock.parsed.articles.js')

// const builder = new lunr.Builder
// builder.ref('id')
// builder.field('authors')
// builder.field('title')
// builder.field('excerpt')
// builder.field('url')
// mockDocs.forEach(doc => builder.add(doc))

test('index 1', () => {
  const idx = lunr(function () {
    this.ref('id')
    this.field('authors')
    this.field('title')
    this.field('url')
    this.field('excerpt')
    mockDocs.forEach(doc => {
      this.add(doc)
    })
  })
  const results = idx.search('John')
  expect(results.length).toBe(2)
})
