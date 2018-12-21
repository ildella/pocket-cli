const commands = require('./interpreter').commands

const output = []

//TODO: support sort alphabetical or native
const parse = params => {
  return {
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
  }
}

commands['help'] = {
  name: 'help',
  aliases: ['h', '?'],
  description: 'Print this help',
  parse: parse
}
output.push('')
output.push('Usage:')
output.push('')
output.push('  Type anything and I will search your Pocket collection')
output.push('  or use one of the commands below')
output.push('  Use "? [command]" to get more information about a specific command')
output.push('')
output.push('Commands:')
output.push('')
Object.keys(commands).forEach(name => {
  output.push(`  ${name} (${commands[name].aliases}) - ${commands[name].description}`)
})
output.push('')
