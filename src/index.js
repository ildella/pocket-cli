require('dotenv').config()
const fs = require('fs').promises
const cli = require('./cli/cli')

const app = {}

app.init = () => {
  setTimeout(async () => {
    global.userAccessToken = (await fs.readFile('pocket_access_token')).toString()
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
