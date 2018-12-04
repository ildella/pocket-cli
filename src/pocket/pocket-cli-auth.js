const commands = require('../cli/interpreter').commands
const pocketAuth = require('./pocket-auth')

const output = []
output.push(``)

const parse = params => {
  return {
    name: 'version',
    execute: async () => {
      await pocketAuth.start()
      return output
    }
  }
}

commands['auth'] = {
  name: 'authenticate',
  aliases: ['auth', 'login'],
  description: 'Authenticate to Pocket',
  parse: parse
}
