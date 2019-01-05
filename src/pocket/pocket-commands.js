const {green} = require('colorette')

const {commands} = require('../cli/menu')
const pocketAuth = require('./pocket-auth')
const pocketParse = require('./pocket-parse')

const listCommands = {
  archive: {
    name: 'archive',
    aliases: ['a', 'read', 'r'],
    description: 'Archive article / Mark as read',
    parse: pocketParse.archive
  },
  delete: {
    name: 'delete',
    aliases: ['d'],
    description: 'Delete article (permanently)',
    parse: pocketParse.delete
  },
  favorite: {
    name: 'favorite',
    aliases: ['fav', 'f'],
    description: 'Favorite article',
    parse: pocketParse.favorite
  },
  tag: {
    name: 'tag',
    aliases: ['t'],
    description: 'Tag article',
    parse: pocketParse.tag
  },
  readd: {
    name: 'readd',
    aliases: ['unarchive'],
    description: 'Un-archive article / Mark as unread',
    parse: pocketParse.readd
  },
  // print: {
  //   name: 'print',
  //   aliases: ['p'],
  //   description: 'print last search results',
  //   parse: pocketParse.print
  // },
  next: {
    name: 'next',
    aliases: ['n'],
    description: 'next set of results',
    parse: pocketParse.next
  },
  previous: {
    name: 'previous',
    aliases: ['p'],
    description: 'previous set of results',
    parse: pocketParse.previous
  },
  expand: {
    name: 'expand',
    aliases: ['e'],
    description: 'print the whole excerpt',
    parse: pocketParse.expand
  },
  open: {
    name: 'open',
    aliases: ['o'],
    description: 'open the URL in the browser',
    parse: pocketParse.open
  },
  select: {
    type: 'interactive',
    name: 'select',
    aliases: ['1', '2', '3', '4', '5', '6', '7', '8'],
    description: 'interactive action on a listed item (eg: archive, fav, tag...)',
    parse: pocketParse.select
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
  parse: pocketParse.list
}
