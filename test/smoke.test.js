require('dotenv').config()
const interpreter = require('../src/cli/interpreter')
require('../src/pocket/pocket-commands')
require('../src/cli/version')
require('../src/cli/quit')
require('../src/cli/help')
// const pocket = require('../src/pocket/pocket-read')
const fs = require('fs').promises

// const app = require('../src')

beforeAll(async () => {
  global.userAccessToken = (await fs.readFile('pocket_access_token')).toString()
})

test('read from pocket API', async () => {
  const output = await interpreter.processInput('bitcoin')
  expect(output.lines).toHaveLength(12)
})

test('modify with pocket API - archive/readd', async () => {
  const list = await interpreter.processInput('bitcoin')
  console.log(list.lines)
  const output = await interpreter.processInput('a 2')
  expect(output.lines).toEqual(['modify executed', 'archive'])
})

test('start app', async () => {
  // app.init()
})
