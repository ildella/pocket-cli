require('dotenv').config()
const __ = require('highland')
const pocket = require('./pocket-read')
const elasticsearchWriter = require('../elasticsearch-writer')

const index = () => {
  let called = 0
  const highlandGenerator = (push, next) => {
    setTimeout(async () => {
      if (called >= 2) {
        push(null, __.nil)
        return
      }
      if (called >= 1) {
        const query = await pocket.next(['bitcoin'])
        const lines = await query.execute()
        push(null, lines)
      }
      if (called == 0) {
        const query = await pocket.toQuery(['bitcoin'])
        const lines = await query.execute()
        push(null, lines)
      }
      called++
      next()
    }, 100)
  }
  __(highlandGenerator)
    .flatten()
    .map(item => {
      console.log(`${item}`)
      return item
    })
    // .done(() => console.log('DONE!'))
    .map(item => {
      return {index: {_index: 'myindex', _type: 'mytype', _id: 1}}
    })
    .batch(10)
    .toArray(array => console.log(`\n${array.length} results -> ${array}`))
    // .pipe(elasticsearchWriter)
}

module.exports = index

index()
