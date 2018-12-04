const quit = {}

quit.parse = async (reserved, params) => {
  return {
    name: 'quit',
    execute: () => {
      console.log('user asked to quit...')
      process.exit(0)
    }
  }
}

module.exports = quit
