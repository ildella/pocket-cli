const platform = require('os').platform()

const openCommands = {
  linux: 'xdg-open',
  osx: 'open',
  windows: 'start'
}

const open = {
  get: input => {
    const actual = input ? input : platform
    return openCommands[actual]
  }
}

module.exports = open
