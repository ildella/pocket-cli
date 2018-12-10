const {commands} = require('../cli/interpreter')
const pocketAuth = require('./pocket-auth')
const pocket = require('./pocket-read')
const {green, yellow} = require('colorette')

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
  interactive: { // TODO: should be generated from other listCommands
    name: 'interactive-command',
    type: 'interactive', //TODO: change startsWith check to type check
    aliases: ['1', '2', '3', '4', '5', '6', '7', '8'],
    description: 'interactive action on a listed item (eg: archive, fav, tag...)',
    parseCommand: index => {
      const options = {
        '1': 'open',
        '2': 'expand',
        '3': 'fav',
        '4': 'archive',
        '5': 'delete',
      }
      return options[index]
    },
    parse: spaceSeparatedInput => {
      const output = []
      const commands = ['1. open', '2. expand', '3. fav', '4. archive', '5. delete']
      return {
        name: 'interactive-query',
        index: spaceSeparatedInput[0],
        execute: () => {
          return {
            lines: output.concat(commands),
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
