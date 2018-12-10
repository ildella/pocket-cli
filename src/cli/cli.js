const readline = require('readline')
const {blue} = require('colorette')
const interpreter = require('./interpreter')
require('../pocket/pocket-commands')
require('./version')
require('./quit')
require('./help')

const cli = {}

const getValue = index => {
  const values = ['\\', '|', '/', '|']
  return new Promise(resolve=>{
    setTimeout(()=>resolve(values[index]), 250)
  })
}

const asyncGenerator = async function* () {
  let index = 0
  while(true) {
    index++
    const value = await getValue(index % 4)
    yield value
  }
}

const completer = line => {
  const completions = Object.keys(interpreter.commands)
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

cli.init = () => {
  console.log(`${'Pocket CLI'} - This screen has ${process.stdout.columns} columns.`)
  ui.prompt()
  ui.on('line', async string => {
    // ui.completer(string)
    let loading = true
    interpreter.processInput(string)
      .then(response => {
        loading = false
        process.stdout.cursorTo(0)
        for (const line of response.lines) {
          console.log(line)
        }
        ui.setPrompt(response.prompt ? response.prompt : defaultPrompt)
      })
      .catch(err => console.error(err))
      .finally(() => { ui.prompt() })
    //TODO: refactor this loader should have a function, and be started in the processInput.then()
    for await (const v of asyncGenerator()) {
      if (loading) {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(v)
      } else {
        break
      }
    }
  })
  ui.on('close', () => {
    console.log('\nuser request to close the app...')
    process.exit(0)
  })
}

module.exports = cli
