const commands = require('./menu').commands

const output = []

// TODO: support sort alphabetical or native
const parse = params => ({
  name: 'help',
  execute: () => {
    if (params) {
      const command = commands[params[0]]
      if (command) {
        return {lines: [command.guide]}
      }
    }
    return {lines: output}
  }
})

commands['help'] = {
  name: 'help',
  aliases: ['h', '?'],
  description: 'Print this help',
  parse: parse
}
const usage = `
  Type any text and I will search for it.

  Type: "help {command}" to display the help for the specific command
`
output.push(usage)
output.push('Commands:')
output.push('')
Object.keys(commands).forEach(name => {
  output.push(`  ${name} (${commands[name].aliases}) - ${commands[name].description}`)
})
// output.push('')
// output.push('Type "? [command]" to get more information about a command')
output.push('')
