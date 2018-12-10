const commands = {}

const isValidString = string => {
  return typeof(string) == 'string' && string.trim().length > 0 ? string.trim() : false
}

const defaultCommand = 'list'
const interpreter = {

  processInput: async string => {
    const action = interpreter.getAction(string)
    if (action === null) return []
    const query = action.parse()
    return await query.execute()
  },

  getAction: inputText => {
    if (interpreter.question) {
      const answerIndex = Number(inputText ? inputText : '1')
      const commandName = interpreter.question.command.parseCommand(answerIndex) // recuperi il command input text eg: archive, open...
      const command = commands[commandName]
      const spaceSeparatedInput = [interpreter.question.input]
      const action = {
        command: command,
        input: spaceSeparatedInput,
        parse: () => { return command.parse(spaceSeparatedInput) }
      }
      if (action.command.name.startsWith('interactive')) {
        interpreter.question = action
      } else {
        interpreter.question = undefined
      }
      return action
    }

    const validString = isValidString(inputText)
    if (!validString) return null

    const spaceSeparatedInput = validString.split(' ')
    const potentialCommand = spaceSeparatedInput[0]
    const candidates = Object.values(commands).filter(command => {
      const matches = new Set(command.aliases)
      matches.add(command.name)
      return matches.has(potentialCommand)
    })
    const useDefault = candidates.length == 0
    const command = useDefault ? commands[defaultCommand] : candidates[0]
    const isInteractive = command.name.startsWith('interactive')
    if (!useDefault && !isInteractive) {
      spaceSeparatedInput.shift()
    }
    Object.assign(commands, command.submenu)
    const action = {
      command: command,
      input: spaceSeparatedInput,
      parse: () => { return command.parse(spaceSeparatedInput) }
    }
    if (command.name.startsWith('interactive')) {
      interpreter.question = action
    } else {
      interpreter.question = undefined
    }
    return action
  }
}

module.exports = interpreter
module.exports.commands = commands
