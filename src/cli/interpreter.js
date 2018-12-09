const commands = {}

const isValidString = string => {
  return typeof(string) == 'string' && string.trim().length > 0 ? string.trim() : false
}

const interpreter = {

  getAction: inputText => {

    const validString = isValidString(inputText)
    if (!validString) return null

    if (interpreter.question) {
      console.log('ANSWER', inputText)
      console.log(interpreter.question)
      const index = Number(inputText)
      const commandName = interpreter.question.command.parseCommand(index) // recuperi il command input text eg: archive, open...
      const command = commands[commandName]
      const spaceSeparatedInput = [index]
      console.log('chosen answer -> ', commandName, spaceSeparatedInput)
      return {
        command: command,
        input: spaceSeparatedInput,
        parse: () => { return command.parse(spaceSeparatedInput) }
      }
    }

    const spaceSeparatedInput = validString.split(' ')
    const potentialCommand = spaceSeparatedInput[0]
    const candidates = Object.values(commands).filter(command => {
      const matches = new Set(command.aliases)
      matches.add(command.name)
      return matches.has(potentialCommand)
    })
    const useDefault = candidates.length == 0
    const defaultCommand = 'list'
    const command = useDefault ? commands[defaultCommand] : candidates[0]
    if (!useDefault) {
      spaceSeparatedInput.shift()
    }
    return {
      command: command,
      input: spaceSeparatedInput,
      parse: () => { return command.parse(spaceSeparatedInput) }
    }
  }
}

module.exports = interpreter
module.exports.commands = commands
