require('dotenv').config()
const interpreter = require('../src/cli/interpreter')
require('../src/pocket/pocket-commands')
const commands = interpreter.commands

test('undefined', () => {
  expect(interpreter.getAction()).toBeNull()
  expect(interpreter.getAction('')).toBeNull()
})

test('list with search parameters', async () => {
  const action = interpreter.getAction('list bitcoin yesterday')
  expect(action.command).toBe(commands.list)
  expect(action.input).toEqual(['list', 'bitcoin', 'yesterday'])
})

test('assume list as default command name', async () => {
  const action = interpreter.getAction('nodejs')
  expect(action.command).toBe(commands.list)
  expect(action.input).toEqual(['nodejs'])
  expect(action.original).toBeUndefined()
})

test('aliases and reserved words', async () => {
  const action = interpreter.getAction('search nodejs unread')
  expect(action.command).toBe(commands.list)
  expect(action.input).toEqual(['search', 'nodejs', 'unread'])
  const query = await action.parse()
  expect(query.name).toEqual('pocket-read')
  expect(query.execute).toBeDefined()
  // const result = await query.execute()
  // expect(result.length).toEqual(10)
  // this is the array of formatted lines of text, ready to be printed
  // TODO: integration test for this
})

// test('help', async () => {
//   const action = interpreter.getAction('help')
//   expect(action.input).toEqual([])
//   expect(action.command).toBe(commands.help)
//   const query = await action.parse()
//   expect(query.name).toBeDefined()
//   expect(query.name).toBe('help')
// })

test('quit', async () => {
  const action = interpreter.getAction('quit')
  expect(action.command).toBe(commands.quit)
  const query = await action.parse()
  expect(query.name).toBeDefined()
  expect(query.name).toBe('quit')
})

test('archive', async () => {
  expect(interpreter.getAction('archive 1').command).toBe(commands.archive)
  expect(interpreter.getAction('a 1').command).toBe(commands.archive)
  expect(interpreter.getAction('aa 1').command).toBe(commands.list)
  // expect(interpreter.getAction('a 1')).toBe('')
})

test('archive does not act if the articles list is empty', async () => {
  const action = interpreter.getAction('archive 1')
  const query = action.parse()
  // expect(query).toEqual('')
  const output = query.execute()
  expect(output).toEqual(['There is no article with index 1'])
})

test('1', async () => {
  const action = interpreter.getAction('1')
  expect(action.command).toBe(commands.interactive)
  expect(action.input).toEqual(['1'])
  // expect(action.original).toBe('1')
  const query = action.parse()
  expect(query.name).toBe('interactive-action')
  // expect(query).toEqual('interactive-action')
})
