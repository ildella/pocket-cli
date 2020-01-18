const sampleDocs = require('./fixtures/mock.parsed.articles.js')
const builder = require('./indexer')()
sampleDocs.forEach(doc => { builder.add(doc) })

test('with builder', () => {
  const idx = builder.build()
  expect(idx.search('something').length).toBe(1)
  expect(idx.search('John').length).toBe(2)
  expect(idx.search('Have a look').length).toBe(1)
})
