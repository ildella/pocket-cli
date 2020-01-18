const lunr = require('lunr')

const mockDocs = require('./fixtures/mock.parsed.articles.js')

test('index inline', () => {
  const idx = lunr(function () {
    this.ref('id')
    this.field('authors')
    this.field('title')
    this.field('url')
    this.field('excerpt')
    mockDocs.forEach(doc => { this.add(doc) })
  })
  // console.log(idx)
  expect(idx.search('John').length).toBe(2)
  expect(idx.search('something').length).toBe(1)
})

test('with builder', () => {
  const builder = new lunr.Builder

  builder.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
    // lunr.stemmer
  )

  // builder.searchPipeline.add(
  //   lunr.stemmer
  // )

  builder.ref('id')
  builder.field('authors')
  builder.field('title')
  builder.field('url')
  builder.field('excerpt')
  // builder.field('body')

  mockDocs.forEach(doc => { builder.add(doc) })
  const idx = builder.build()
  expect(idx.search('something').length).toBe(1)
  expect(idx.search('John').length).toBe(2)
})

test('async loop', () => {
  const config = function () {
    this.ref('id')
    this.field('authors')
    this.field('title')
    this.field('url')
    this.field('excerpt')
    for (const doc of mockDocs) {
      this.add(doc)
    }
  }
  const idx = lunr(config)
  const results = idx.search('John')
  expect(results.length).toBe(2)
})
