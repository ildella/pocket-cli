const platform = require('os').platform()

const openCommands = {
  linux: 'xdg-open',
  osx: 'open',
  windows: 'start'
}

const open = {
  get: input => openCommands[input || platform]
}

module.exports = open
