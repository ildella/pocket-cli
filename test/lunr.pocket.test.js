const lunr = require('lunr')
const mockDocs = require('./mock.articles.js')

const builder = new lunr.Builder
builder.ref('item_id')
builder.field('given_title')
builder.field('excerpt')
// builder.field('author')
mockDocs.forEach(doc => builder.add(doc))

test('index 1', () => {
  // builder.build().search()
})