const readline = require('readline')
const {blue} = require('colorette')

const cliProcessor = require('./process-input')
const completer = require('./completer')

const cli = {}

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
    console.log('\nuGoodbye.')
    process.exit(0)
  })
}

module.exports = cli
