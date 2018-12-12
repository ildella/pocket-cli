const interpreter = require('../src/cli/interpreter')
require('../src/cli/help')
require('../src/cli/quit')
require('../src/cli/version')
const commands = interpreter.commands

test('undefined', () => {
  expect(interpreter.getAction()).toBeNull()
  expect(interpreter.getAction('')).toBeNull()
})

test('quit', async () => {
  const action = interpreter.getAction('quit')
  expect(action.command).toBe(commands.quit)
  const query = await action.parse()
  expect(query.name).toBeDefined()
  expect(query.name).toBe('quit')
})

test('help', async () => {
  const action = interpreter.getAction('help')
  expect(action.command).toBe(commands.help)
  const query = await action.parse()
  expect(query.name).toBeDefined()
  expect(query.name).toBe('help')
})

test('version', async () => {
  const action = interpreter.getAction('version')
  expect(action.command).toBe(commands.version)
  const query = await action.parse()
  expect(query.name).toBeDefined()
  expect(query.name).toBe('version')
})
