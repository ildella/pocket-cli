const readline = require('readline')
const interpreter = require('./interpreter')
require('../pocket/pocket-commands')
require('./version')
require('./quit')
require('./help')
process.title = 'pocket-cli'

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

const ui = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completer,
  prompt: 'Pocket> '
})

cli.init = () => {
  console.log(`${'Pocket CLI is running'} - screen has ${process.stdout.columns} columns.`)
  ui.prompt()
  ui.on('line', async string => {
    // ui.completer(string)
    let loading = true
    cli.processInput(string)
      .then(lines => {
        loading = false
        process.stdout.cursorTo(0)
        for (const line of lines) {
          console.log(line)
        }
      })
      .catch(err => console.error(err))
      .finally(() => { ui.prompt() })
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

const {yellow} = require('colorette')

cli.processInput = async string => {
  const action = interpreter.getAction(string)
  if (action.command.name.startsWith('interactive')) {
    interpreter.question = action
    ui.setPrompt(yellow('select: '))
  } else {
    interpreter.question = undefined
    ui.setPrompt('Pocket> ')
  }
  if (action === null) return []
  const query = action.parse()
  return await query.execute()
}

module.exports = cli
