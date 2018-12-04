require('dotenv').config()
const cli = require('./cli')

const app = {}

app.init = () => {
  setTimeout(() => {
    cli.init()
  }, 50)
}

app.init()

process.on('SIGINT', () => {
  console.log('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM')
  process.exit(0)
})

module.exports = app
