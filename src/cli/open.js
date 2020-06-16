const os = require('os')

const openCommands = {
  linux: 'xdg-open',
  darwin: 'open',
  win32: 'start'
}

const open = {
  get: (system = os.platform()) => {
    const command = openCommands[system]
    console.log(`open command for ${system}: ${command}`)
    return command
  }
}

module.exports = open
