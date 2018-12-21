const axios = require('axios')
const url = 'https://raw.githubusercontent.com/ildella/pocket-cli/master/RELEASES.md'

const commands = require('./interpreter').commands
const update = require('../npm-update')

const output = []

commands['update'] = {
  name: 'update',
  aliases: ['u'],
  description: 'Pocket CLI update',
  parse: options => {
    const subcommand = options && options.length > 0 ? options[0] : null
    switch (subcommand) {
    case 'whatsnew':
      return {
        name: 'update-release',
        execute: async () => {
          const response = await axios(url)
          console.log(response.data)
          return {lines: output}
        }
      }
    default:
      return {
        name: 'update',
        execute: async () => {
          const check = await update.check()
          const output = [`Running: ${check.actual}. Last: ${check.last}. Need to update: ${check.need}`]
          if (check.need) {
            output.push('To update, "quit" the app then run:')
            output.push('npm i -g pocket-cli')
          }
          return {lines: output}
        }
      }
    }
  }
}
