const {commands} = require('../cli/interpreter')
const pocketAuth = require('./pocket-auth')
const pocket = require('./pocket-read')
const {green, yellow} = require('colorette')

const options = {
  '1': 'open',
  '2': 'expand',
  '3': 'favorite',
  '4': 'archive',
  '5': 'delete',
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
  // tag: {
  //   name: 'tag',
  //   aliases: ['t'],
  //   description: 'tag article',
  //   parse: pocket.tag
  // },
  readd: {
    name: 'readd',
    aliases: ['unarchive'],
    description: 'Un-archive article / Mark as unread',
    parse: pocket.readd
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
    parseCommand: actionIndex => {
      return options[actionIndex]
    },
    parse: spaceSeparatedInput => {
      // TODO: understand difference btw this and actionIndex up there
      // maybe we can avoid parseCommand or reuse it here, but not have both
      return {
        name: 'interactive-query',
        // index: spaceSeparatedInput[0],
        execute: () => {
          return {
            lines: [interactiveOptions],
            prompt: yellow('select: ')
          }
        }
      }
    }
  }
}

const login = () => {
  return {
    name: 'pocket-auth',
    execute: async () => {
      await pocketAuth.login()
      return {lines: [green('User logged in')]}
    }
  }
}

const logout = () => {
  return {
    name: 'pocket-auth',
    execute: async () => {
      pocketAuth.logout()
      return {lines: [green('User logged out')]}
    }
  }
}

commands['login'] = {
  name: 'login',
  aliases: ['signin', 'auth'],
  description: 'Login to Pocket',
  parse: login
}
commands['logout'] = {
  name: 'logout',
  aliases: ['signout'],
  description: 'Logout from Pocket',
  parse: logout
}
commands['list'] = {
  name: 'list',
  aliases: ['ls', 'l', 'search', 's', 'find'],
  description: 'Search for the given keywords. eg: list bitcoin',
  guide:
  `
  List is the default command.
  If no other command is detected, I search for the input text.

  Available parameters:

    unread             search only for non-archived articles
    oldest / newest    list starting from oldest / newest
  `,
  submenu: listCommands,
  parse: pocket.toQuery
}
