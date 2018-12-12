const {commands} = require('../cli/interpreter')
const pocketAuth = require('./pocket-auth')
const pocket = require('./pocket-read')
const {green, yellow} = require('colorette')

const options = {
  '1': 'open',
  '2': 'expand',
  '3': 'fav',
  '4': 'archive',
  '5': 'delete',
}

const parseCommand = actionIndex => {
  return options[actionIndex]
}

const interactiveOptions = Object.keys(options)
  .reduce(
    (previousValue, currentValue, currentIndex) => {
      const command = options[currentValue]
      const defaultText = currentIndex === 0 ? ' (default)' : ''
      return `${previousValue}  ${currentValue}. ${command.charAt(0).toUpperCase()}${command.slice(1)}${defaultText}`
    }
    , ''
  ).trim()

const listCommands = {
  archive: {
    name: 'archive',
    aliases: ['a', 'read', 'r'],
    description: 'Archive article / Mark as read',
    parse: pocket.archive
  },
  delete: {
    name: 'delete',
    aliases: ['d'],
    description: 'Delete article (permanently)',
    parse: pocket.delete
  },
  favorite: {
    name: 'favorite',
    aliases: ['fav', 'f'],
    description: 'Favorite article',
    parse: pocket.favorite
  },
  print: {
    name: 'print',
    aliases: ['p'],
    description: 'print last search results',
    parse: pocket.print
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
    type: 'interactive', //TODO: better check type or keep using naming convention?
    aliases: ['1', '2', '3', '4', '5', '6', '7', '8'],
    description: 'interactive action on a listed item (eg: archive, fav, tag...)',
    parseCommand: parseCommand,
    parse: spaceSeparatedInput => {
      const output = [interactiveOptions]
      return {
        name: 'interactive-query',
        index: spaceSeparatedInput[0],
        execute: () => {
          return {
            lines: output,
            prompt: yellow('select: ')
          }
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
      return {lines: [green('User autheticated succesfully')]}
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
