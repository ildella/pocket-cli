const commands = require('../cli/interpreter').commands
const pocketAuth = require('./pocket-auth')
const pocket = require('./pocket-read')

const output = []
output.push('')

const listCommands = {
  archive: {
    name: 'archive',
    aliases: ['a', 'read', 'r'],
    description: 'Archive article / Mark as read',
    parse: pocket.archive
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
          return ['1. open', '2. expand', '3. fav', '4. archive']
        }
      }
    }
  }
}

const parseAuth = () => {
  return {
    name: 'pocket-auth',
    execute: async () => {
      await pocketAuth.start()
      return output
    }
  }
}

commands['auth'] = {
  name: 'authenticate',
  aliases: ['auth', 'login'],
  description: 'Authenticate to Pocket',
  parse: parseAuth
}
commands['list'] = {
  name: 'list',
  aliases: ['search', 'find', 's', 'l', 'ls'],
  description: 'Search for the given keywords. eg: list bitcoin',
  submenu: listCommands,
  parse: pocket.toQuery
}
