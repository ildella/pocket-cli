const commands = require('./interpreter').commands
const update = require('../npm-update')

commands['update'] = {
  name: 'update',
  aliases: ['u'],
  description: 'Pocket CLI update',
  parse: () => {
    return {
      name: 'version',
      execute: async () => {
        const check = await update.check()
        return {lines: [`Installed: ${check.actual}. Last: ${check.last}. Need to update: ${check.need}`]}
      }
    }
  }
}
