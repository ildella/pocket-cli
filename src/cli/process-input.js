/*
  Control the whole flow: parse input, execute action, render result
*/

const {yellow, red} = require('colorette')

const interpreter = require('./interpreter')
const menu = require('./menu')

const handleError = name => {
  switch (name) {
  case 'auth':
    return [yellow(`User not authenticated. Please type '${menu.commands.login.name}' to connect your Pocket account`)]
  case 'update':
    return [yellow('Please update the app')]
  default:
    return [red(`big error: ${name}`)]
  }
}

const processor = {

  processInput: async string => {
    try {
      const action = interpreter(string)
      const query = action.parse()
      const results = await query.execute()
      // menu.change(Object.assign({}, commands, action.command.submenu))
      Object.assign(menu.commands, action.command.submenu)
      return query.render ? query.render(results) : results
    } catch(e) {
      console.log(e)
      return {lines: handleError(e.name)}
    }
  },
}

module.exports = processor
