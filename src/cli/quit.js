const commands = require('./interpreter').commands

const parse = () => {
  return {
    name: 'quit',
    execute: () => {
      console.log('user asked to quit...')
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
