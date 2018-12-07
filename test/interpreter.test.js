require('dotenv').config()
const interpreter = require('../src/cli/interpreter')
const commands = interpreter.commands

test('undefined', () => {
  expect(interpreter.getAction()).toBeNull()
  expect(interpreter.getAction('')).toBeNull()
})

test('list with search parameters', async () => {
  const action = interpreter.getAction('list bitcoin yesterday')
  expect(action.command).toBe(commands.list)
  expect(action.input).toEqual(['bitcoin', 'yesterday'])
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
  expect(action.input).toEqual(['nodejs', 'unread'])
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

test('1', async () => {
  const action = interpreter.getAction('1')
  expect(action.command).toBe(commands.interactive)
  expect(action.input).toEqual([])
  expect(action.original).toBe('1')
  const query = action.parse()
  expect(query.name).toBe('interactive-action')
  // expect(query).toEqual('interactive-action')
})
