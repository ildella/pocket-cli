const commands = {}

const isValidString = string => {
  return typeof(string) == 'string' && string.trim().length > 0 ? string.trim() : false
}

const defaultCommand = 'list'
const interpreter = {

  getAction: inputText => {

    if (interpreter.question) {
      const index = Number(inputText ? inputText : '1')
      const commandName = interpreter.question.command.parseCommand(index) // recuperi il command input text eg: archive, open...
      const command = commands[commandName]
      const spaceSeparatedInput = [index]
      return {
        command: command,
        input: spaceSeparatedInput,
        parse: () => { return command.parse(spaceSeparatedInput) }
      }
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
    if (!useDefault) {
      spaceSeparatedInput.shift()
    }
    Object.assign(commands, command.submenu)
    return {
      command: command,
      input: spaceSeparatedInput,
      parse: () => { return command.parse(spaceSeparatedInput) }
    }
  }
}

module.exports = interpreter
module.exports.commands = commands
