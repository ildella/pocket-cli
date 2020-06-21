/*
  Download JSON with line separator so we can use readline + streams to load
*/

const __ = require('highland')
const pocket = require('./pocket-parse')
const fs = require('fs')
const write = fs.createWriteStream('/home/ildella/.config/pocketcli/localdb')
const max = 100

module.exports = () => {
  let called = 0
  const generator = async (push, next) => {
    if (called >= max) {
      push(null, __.nil)
      return
    }
    const query = pocket.next()
    const response = await query.execute()
    called++
    push(null, response)
    if (response.length === 0) {
      push(null, __.nil)
      return
    }
    next()
  }

  __(generator)
    .flatten()
    .map(article => JSON.stringify(article))
    .map(string => `${string}\n`)
    .pipe(write)
}
