const commands = require('./menu').commands

const parse = () => ({
  name: 'quit',
  execute: () => {
    console.log('Goodbye.')
    process.exit(0)
  }
})

commands['quit'] = {
  name: 'quit',
  aliases: ['exit', 'q'],
  description: 'Quit and terminate application',
  parse: parse
}
