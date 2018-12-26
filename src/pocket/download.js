const __ = require('highland')
const pocket = require('./pocket-parse')

module.exports = () => {
  let called = 0
  const generator = async (push, next) => {
    if (called >= 2) {
      push(null, __.nil)
      return
    }
    const query = pocket.list()
    const response = await query.execute()
    called++
    console.log(response.length)
    push(null, response)
    console.log('... pushed!')
    next()
  }

  __(generator)
    // .tap(console.log)
    .flatten()
    .toArray(results => console.log('GENERATOR DONE', results.length))
}
