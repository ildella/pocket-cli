const pocket = require('../pocket/pocket-read')
const quit = require('./quit')

//TODO: get me out of here!
const commands = {
  quit: {
    name: 'quit',
    aliases: ['exit', 'q'],
    description: 'Quit Pocket CLI',
    parse: quit.parse
  },
  list: {
    name: 'list',
    aliases: ['search', 'find', 's', 'l', 'ls'],
    description: 'Search for the given keywords. eg: list bitcoin',
    parse: pocket.toQuery
  },
  next: {
    name: 'next',
    aliases: ['n'],
    description: 'next set of results',
    parse: pocket.next
  },
  previous: {
    name: 'previous',
    aliases: ['p'],
    description: 'previous set of results',
    parse: pocket.previous
  },
  expand: {
    name: 'expand',
    aliases: ['e'],
    description: 'print the whole excerpt',
    parse: pocket.expand
  },
  open: {
    name: 'open',
    aliases: ['o'],
    description: 'open the URL in the browser',
    parse: pocket.open
  },
  interactive: {
    name: 'interactive-command',
    aliases: ['1', '2', '3', '4', '5', '6', '7', '8'],
    description: 'interactive action on a listed item (eg: archive, fav, tag...)',
    parseCommand: index => {
      const options = {
        '1': 'open',
        '2': 'expand',
        '3': 'fav',
        '4': 'archive',
      }
      return options[index]
    },
    parse: spaceSeparatedInput => {
      console.log('interactive', spaceSeparatedInput)
      return {
        name: 'interactive-query',
        index: spaceSeparatedInput[0],
        execute: () => {
          const output = ['1. open', '2. expand', '3. fav', '4. archive']
          return output
        }
      }
    }

  }
}

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
      const spaceSeparatedInput = [commandName, index]
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
