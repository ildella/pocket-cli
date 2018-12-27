const fs = require('fs')
const readline = require('readline')
const {promisify} = require('util')

const lines = (path, done) => {
  let counter = 0
  const rl = readline.createInterface({input: fs.createReadStream(path)})
  rl.on('line', () => { counter++ })
  rl.on('close', () => {
    done(null, counter)
  })
}

module.exports = {
  lines: promisify(lines)
}
