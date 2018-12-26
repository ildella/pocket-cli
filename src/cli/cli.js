const readline = require('readline')
const {blue} = require('colorette')
const {commands} = require('./menu')
const cliProcessor = require('./process-input')

const cli = {}

const completer = line => {
  const completions = Object.keys(commands)
  const hits = completions.filter(c => c.startsWith(line))
  return [hits.length ? hits : completions, line]
}

const defaultPrompt = `${blue('Pocket')}> `
const ui = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completer,
  prompt: defaultPrompt
})

const platform = require('os').platform()
const loader = require('./loader')

cli.init = () => {
  console.log(`${'Pocket CLI'} - ${platform}`)
  ui.prompt()
  ui.on('line', async string => {
    // ui.completer(string)
    cliProcessor.processInput(string)
      .then(response => {
        loader.stop()
        for (const line of response.lines || []) {
          console.log(line)
        }
        ui.setPrompt(response.prompt ? response.prompt : defaultPrompt)
      })
      .catch(err => console.error(err))
      .finally(() => { ui.prompt() })
    loader.start()
  })
  ui.on('close', () => {
    console.log('\nuser request to close the app...')
    process.exit(0)
  })
}

module.exports = cli
