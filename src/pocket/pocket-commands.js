const commands = require('../cli/interpreter').commands
const pocket = require('./pocket-read')
const pocketAuth = require('./pocket-auth')

const output = []
output.push('')

const parseAuth = () => {
  return {
    name: 'pocket-auth',
    execute: async () => {
      await pocketAuth.start()
      return output
    }
  }
}

commands['read'] = {
  name: 'read',
  aliases: ['r'],
  description: 'Mark article as read',
  parse: pocket.modifyQuery
}
commands['auth'] = {
  name: 'authenticate',
  aliases: ['auth', 'login'],
  description: 'Authenticate to Pocket',
  parse: parseAuth
}
