const interpreter = require('../src/cli/interpreter')
require('../src/cli/help')
require('../src/cli/quit')
require('../src/pocket/pocket-commands')

test('commands and subcommands', async () => {
  expect(Object.entries(interpreter.commands)).toHaveLength(6)
  expect(Object.entries(interpreter.availableCommands)).toHaveLength(6)

  const tagAction = interpreter('list')
  expect(tagAction.command).toBe(interpreter.availableCommands.list)
  expect(Object.entries(interpreter.commands)).toHaveLength(6)
  expect(Object.entries(interpreter.availableCommands)).toHaveLength(10)
})
