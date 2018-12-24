// const tracer = require('../logger')()
const {yellow, red} = require('colorette')

const commands = {}

commands['null'] = {
  name: 'null',
  aliases: [],
  description: 'Do nothing',
  parse: () => { return {
    execute: () => { return {lines: []}}
  }}
}

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
    return [red(`big error: ${name}`)]
  }
}

const createAction = inputText => {
  if (interpreter.question) {
    return createAnswer(inputText)
  }

  const validString = isValidString(inputText)
  if (!validString) {
    const command = commands['null']
    return {
      command: command,
      input: '',
      parse: () => { return command.parse() }
    }
  }

  return createBasicAction(validString.split(' '))
}

const createAnswer = inputText => {
  const commandIndex = Number(inputText ? inputText : '1')
  const command = commands[interpreter.question.command.parseCommand(commandIndex)]
  const selectionIndex = interpreter.question.input
  return {
    command: command,
    input: selectionIndex,
    parse: () => { return command.parse(selectionIndex) }
  }
}

const createBasicAction = spaceSeparatedInput => {
  const firstWord = spaceSeparatedInput[0]
  const candidates = Object.values(commands).filter(command => {
    const matches = new Set(command.aliases)
    matches.add(command.name)
    return matches.has(firstWord)
  })
  const useDefault = candidates.length === 0
  const command = useDefault ? commands[defaultCommand] : candidates[0]
  // TOFIX: removing the first word should be a more explicit thing
  const isInteractive = command.name.startsWith('interactive')
  const isFirstWordACommand = (!useDefault && !isInteractive)
  const input = isFirstWordACommand ? spaceSeparatedInput.slice(1) : spaceSeparatedInput.slice(0)
  return {
    command: command,
    input: input,
    parse: () => { return command.parse(input) }
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
    const action = createAction(inputText)
    const command = action.command
    const isInteractive = command.name.startsWith('interactive')
    if (isInteractive) {
      interpreter.question = action
    } else {
      interpreter.question = undefined
    }
    Object.assign(commands, command.submenu)
    return action
  }
}

module.exports = interpreter
module.exports.commands = commands
