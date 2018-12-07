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
    name: 'interactive',
    aliases: ['1', '2', '3', '4'],
    description: 'interactive action on a listed item (eg: archive, fav, tag...)',
    parse: () => {
      return {
        name: 'interactive-action',
        execute: () => {
          const output = []
          output.push('please code the action...')
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
    const spaceSeparatedInput = validString.split(' ')
    const defaultCommand = 'list'
    const potentialCommand = spaceSeparatedInput[0]
    const validCommand = Object.values(commands).filter(command => {
      const matches = new Set(command.aliases)
      matches.add(command.name)
      return matches.has(potentialCommand)
    })
    const isValidCommand = validCommand.length > 0
    if (isValidCommand) {
      spaceSeparatedInput.shift()
    }
    const command = isValidCommand ? validCommand[0] : commands[defaultCommand]
    return {
      command: command,
      input: spaceSeparatedInput,
      parse: () => { return command.parse(spaceSeparatedInput) }
    }
  }
}

module.exports = interpreter
module.exports.commands = commands
