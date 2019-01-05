const commands = require('./menu').commands

const parse = () => {
  return {
    name: 'quit',
    execute: () => {
      console.log('Goodbye.')
      process.exit(0)
    }
  }
}

commands['quit'] = {
  name: 'quit',
  aliases: ['exit', 'q'],
  description: 'Quit Pocket CLI',
  parse: parse
}
