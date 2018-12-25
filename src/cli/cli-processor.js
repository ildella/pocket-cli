const {yellow, red} = require('colorette')

const interpreter = require('./interpreter')
const {commands} = require('./interpreter')

const handleError = name => {
  switch (name) {
  case 'auth':
    return [yellow(`User not authenticated. Please type '${commands.login.name}' to connect your Pocket account`)]
  case 'update':
    return [yellow('Please update the app')]
  default:
    return [red(`big error: ${name}`)]
  }
}

const processor = {

  processInput: async string => {
    try {
      const action = interpreter.getAction(string)
      const query = action.parse()
      const results = await query.execute()
      return query.render ? query.render(results) : results
    } catch(e) {
      console.log(e)
      return {lines: handleError(e.name)}
    }
  },
}

module.exports = processor
