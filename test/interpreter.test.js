const interpreter = require('../src/cli/interpreter')
require('../src/cli/help')
require('../src/cli/quit')
require('../src/cli/version')
require('../src/cli/update')

const commands = interpreter.commands

test('undefined', () => {
  const nullAction = interpreter()
  expect(nullAction.command).toBe(commands.null)
})

test('quit', async () => {
  const action = interpreter('quit')
  expect(action.command).toBe(commands.quit)
  const query = action.parse()
  expect(query.name).toBe('quit')
})

test('help', async () => {
  const action = interpreter('help')
  expect(action.command).toBe(commands.help)
  const query = action.parse()
  expect(query.name).toBe('help')
})

test('version', async () => {
  const action = interpreter('version')
  expect(action.command).toBe(commands.version)
  const query = action.parse()
  expect(query.name).toBe('version')
})

test('update', async () => {
  const action = interpreter('update')
  expect(action.command).toBe(commands.update)
  const query = action.parse()
  expect(query.name).toBe('update')
})
