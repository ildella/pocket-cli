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
const usage = `
Search: 

  Type any text and I will search your Pocket collection

  Available parameters:

    unread             search only for non-archived articles
    oldest / newest    list starting from oldest / newest
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
