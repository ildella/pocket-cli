const commands = {}
let availableCommands = {}

module.exports = {
  get: name => availableCommands[name],
  change: commands => availableCommands = Object.assign({}, commands),
  size: () => Object.entries(availableCommands).length,
  commands: commands
}
