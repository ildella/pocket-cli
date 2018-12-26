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

test('index 1', () => {
  const idx = lunr(function () {
    this.ref('id')
    this.field('authors')
    this.field('title')
    this.field('url')
    this.field('excerpt')
    // __(generator)
    //   .tap(console.log)
    //   .toArray(loaded => console.log(loaded))
    mockDocs.forEach(doc => {
      const added = this.add(doc)
      console.log(added)
    })
  })
  const results = idx.search('John')
  expect(results.length).toBe(2)
  console.log(results)
})
