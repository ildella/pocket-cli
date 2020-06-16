const interpreter = require('../src/cli/interpreter')
require('../src/cli/help')
require('../src/cli/quit')
require('../src/cli/version')
require('../src/cli/update')

const commands = require('../src/cli/menu').commands

test('undefined', () => {
  const nullAction = interpreter()
  expect(nullAction.command.name).toBe('null')
})

test('quit', () => {
  const action = interpreter('quit')
  expect(action.command).toBe(commands.quit)
  const query = action.parse()
  expect(query.name).toBe('quit')
})

test('help', () => {
  const action = interpreter('help')
  expect(action.command).toBe(commands.help)
  const query = action.parse()
  expect(query.name).toBe('help')
})

test('version', () => {
  const action = interpreter('version')
  expect(action.command).toBe(commands.version)
  const query = action.parse()
  expect(query.name).toBe('version')
})

test('update', () => {
  const action = interpreter('update')
  expect(action.command).toBe(commands.update)
  const query = action.parse()
  expect(query.name).toBe('update')
})
