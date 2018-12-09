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

commands['archive'] = {
  name: 'archive',
  aliases: ['a', 'read', 'r'],
  description: 'Archive article / Mark as read',
  parse: spaceSeparatedInput => {
    const index = spaceSeparatedInput[1]
    return pocket.modifyQuery('archive', index)
  }
}
commands['auth'] = {
  name: 'authenticate',
  aliases: ['auth', 'login'],
  description: 'Authenticate to Pocket',
  parse: parseAuth
}
