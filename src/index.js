process.title = 'pocket-cli'
const cli = require('./cli/cli')

const app = {}

app.init = () => {
  setTimeout(async () => {
    cli.init()
  }, 50)
}

process.on('SIGINT', () => {
  console.log('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM')
  process.exit(0)
})

module.exports = app
