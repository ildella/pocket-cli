require('dotenv').config()
const interpreter = require('../src/cli/interpreter')
require('../src/pocket/pocket-commands')
require('../src/cli/help')
require('../src/cli/quit')
const commands = interpreter.commands

test('undefined', () => {
  expect(interpreter.getAction()).toBeNull()
  expect(interpreter.getAction('')).toBeNull()
})

test('list with search parameters', async () => {
  const action = interpreter.getAction('list bitcoin yesterday')
  expect(action.command).toBe(commands.list)
  // expect(action.input).toEqual(['list', 'bitcoin', 'yesterday'])
  expect(action.input).toEqual(['bitcoin', 'yesterday'])
})

test('assume list as default command name', async () => {
  const action = interpreter.getAction('nodejs')
  expect(action.command).toBe(commands.list)
  expect(action.input).toEqual(['nodejs'])
})

test('aliases and reserved words', async () => {
  const action = interpreter.getAction('search nodejs unread')
  expect(action.command).toBe(commands.list)
  expect(action.input).toEqual(['nodejs', 'unread'])
  // expect(action.input).toEqual(['search', 'nodejs', 'unread'])
  const query = await action.parse()
  expect(query.name).toEqual('pocket-read')
  expect(query.execute).toBeDefined()
  // const result = await query.execute()
  // expect(result.length).toEqual(10)
  // this is the array of formatted lines of text, ready to be printed
  // TODO: integration test for this
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

test('archive', async () => {
  expect(interpreter.getAction('archive 1').command).toBe(commands.archive)
  expect(interpreter.getAction('a 1').command).toBe(commands.archive)
  expect(interpreter.getAction('aa 1').command).toBe(commands.list)
  // expect(interpreter.getAction('a 1')).toBe('')
})

test('open', async () => {
  const action = interpreter.getAction('open 1')
  expect(action.command).toBe(commands.open)
  const query = action.parse()
  expect(query.name).toBe('pocket-open')
  expect(query.indexes).toEqual(['1'])
  // expect(interpreter.getAction('a 1')).toBe('')
})

test('expand', async () => {
  interpreter.getAction('list').parse()
  const action = interpreter.getAction('e 3')
  expect(action.command).toBe(commands.expand)
  const query = action.parse()
  expect(query.name).toBe('pocket-expand')
  expect(query.indexes).toEqual(['3'])
  // expect(interpreter.getAction('a 1')).toBe('')
})

test('print', async () => {
  interpreter.getAction('list').parse()
  const action = interpreter.getAction('print')
  expect(action.command).toBe(commands.print)
  const query = action.parse()
  expect(query.name).toBe('pocket-print')
})

test('archive does not act if the articles list is empty', async () => {
  const action = interpreter.getAction('archive 1')
  expect(action.command).toBe(commands.archive)
  const query = action.parse()
  // expect(query).toEqual('')
  const output = query.execute()
  expect(output).toEqual(['There is no article with index 1'])
})

test('interactive', async () => {
  interpreter.getAction('list').parse()
  
  const action = interpreter.getAction('1')
  expect(interpreter.question).toBe(action)
  expect(action.command).toBe(commands.interactive)
  expect(action.input).toEqual(['1'])
  // expect(action.userInput).toEqual('1')
  const query = action.parse()
  expect(query.name).toBe('interactive-query')
  expect(query.index).toBe('1')
  const output = query.execute()
  expect(output.lines).toEqual(['1. open', '2. expand', '3. fav', '4. archive', '5. delete'])

  const answerAction = interpreter.getAction('2')
  expect(answerAction.command).toBe(commands.expand)
  // expect(answerAction.input).toBe()
  expect(interpreter.question).toBeUndefined()
  const answerQuery = answerAction.parse()
  expect(answerQuery.name).toBe('pocket-expand')
  expect(answerQuery.index).toEqual(['1'])
})

// const cli = require('../src/cli/cli')

// test('list + index + choose action', async () => {
//   cli.processInput('list bitcoin')
//   cli.processInput('1')
//   cli.processAnswer('2')
// })
