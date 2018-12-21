// const tracer = require('../logger')()
const {yellow, red} = require('colorette')

const commands = {}

const isValidString = string => {
  return typeof(string) == 'string' && string.trim().length > 0 ? string.trim() : false
}

const handleError = name => {
  switch (name) {
  case 'auth':
    return [yellow(`User not authenticated. Please type '${commands.login.name}' to connect your Pocket account`)]
  case 'update':
    return [yellow('Please update the app')]
  default:
    return [red('big error!')]
  }
}

const defaultCommand = 'list'
const interpreter = {

  processInput: async string => {
    try {
      const action = interpreter.getAction(string)
      if (action === null) return []
      const query = action.parse()
      return await query.execute()
    } catch(e) {
      // tracer.warn(e)
      return {lines: handleError(e.name)}
    }
  },

  getAction: inputText => {
    if (interpreter.question) {
      const answerIndex = Number(inputText ? inputText : '1')
      const command = commands[interpreter.question.command.parseCommand(answerIndex)]
      const input = [interpreter.question.input]
      interpreter.question = undefined
      return {
        command: command,
        input: input,
        parse: () => { return command.parse(input) }
      }
    }

    const validString = isValidString(inputText)
    if (!validString) return null

    const spaceSeparatedInput = validString.split(' ')
    const firstWord = spaceSeparatedInput[0]
    const candidates = Object.values(commands).filter(command => {
      const matches = new Set(command.aliases)
      matches.add(command.name)
      return matches.has(firstWord)
    })
    const useDefault = candidates.length === 0
    const command = useDefault ? commands[defaultCommand] : candidates[0]
    const isInteractive = command.name.startsWith('interactive')
    const isFirstWordACommand = (!useDefault && !isInteractive)
    const input = isFirstWordACommand ? spaceSeparatedInput.slice(1) : spaceSeparatedInput.slice(0)
    Object.assign(commands, command.submenu)
    const action = {
      command: command,
      input: input,
      parse: () => { return command.parse(input) }
    }
    if (isInteractive) {
      interpreter.question = action
    }
    return action
  }
}

module.exports = interpreter
module.exports.commands = commands
