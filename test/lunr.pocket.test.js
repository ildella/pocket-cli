const lunr = require('lunr')
// const __ = require('highland')

const mockDocs = require('./mock.parsed.articles.js')

// const builder = new lunr.Builder
// builder.ref('id')
// builder.field('authors')
// builder.field('title')
// builder.field('excerpt')
// builder.field('url')
// mockDocs.forEach(doc => builder.add(doc))
// const fs = require('fs')
// const readline = require('readline')

// const inputStream = fs.createReadStream('/home/ildella/.config/pocketcli/localdb')
// const rl = readline.createInterface({input: inputStream})
// const generator = push => {
//   rl.on('line', line => { push(null, line) })
//   rl.on('close', () => { push(null, __.nil) })
// }

test('index inline', () => {
  const idx = lunr(function () {
    this.ref('id')
    this.field('authors')
    this.field('title')
    this.field('url')
    this.field('excerpt')
    // __(generator)
    //   .tap(console.log)
    //   .toArray(loaded => console.log(loaded))
    mockDocs.forEach(doc => { this.add(doc) })
  })
  // console.log(idx)
  const results = idx.search('John')
  expect(results.length).toBe(2)
})

test('with builder', () => {
  const builder = new lunr.Builder

  builder.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
    lunr.stemmer
  )

  builder.searchPipeline.add(
    lunr.stemmer
  )

  // config.call(builder, builder)
  builder.ref('id')
  builder.field('title')
  builder.field('body')
  mockDocs.forEach(doc => { builder.add(doc) })

  const idx = builder.build()
  const results = idx.search('John')
  // console.log(results)
  expect(results.length).toBe(0)
  // :(
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
