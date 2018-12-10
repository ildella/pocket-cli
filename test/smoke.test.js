require('dotenv').config()
const interpreter = require('../src/cli/interpreter')
require('../src/pocket/pocket-commands')
require('../src/cli/version')
require('../src/cli/quit')
require('../src/cli/help')
// const pocket = require('../src/pocket/pocket-read')

// const app = require('../src')

test('read from pocket API', async () => {
  const output = await interpreter.processInput('bitcoin')
  expect(output.lines).toHaveLength(12)
  await interpreter.processInput('n')
})

test('modify with pocket API - archive/readd', async () => {
  const list = await interpreter.processInput('bitcoin')
  const output = await interpreter.processInput('a 2')
  expect(output.lines).toEqual(['modifications applied: archive'])
})

test('start app', async () => {
  // app.init()
})
