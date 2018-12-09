const commands = require('./interpreter').commands

const output = []

//TODO: support sort alphabetical or native
const parse = params => {
  return {
    name: 'help',
    execute: () => { return output }
  }
}

commands['help'] = {
  name: 'help',
  aliases: ['h', '?'],
  description: 'Print this help',
  parse: parse
}
output.push('')
Object.keys(commands).forEach(name => {
  output.push(`${name} (${commands[name].aliases}) - ${commands[name].description}`)
})
output.push('')
