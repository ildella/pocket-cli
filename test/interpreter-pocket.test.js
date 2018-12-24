const interpreter = require('../src/cli/interpreter')
require('../src/pocket/pocket-commands')
const commands = interpreter.commands

test('list with search parameters', async () => {
  const action = interpreter.getAction('list bitcoin yesterday')
  expect(action.command).toBe(commands.list)
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
  const query = await action.parse()
  expect(query.name).toEqual('pocket-list')
  expect(query.execute).toBeDefined()
})

test('archive', async () => {
  expect(interpreter.getAction('archive 1').command).toBe(commands.archive)
  expect(interpreter.getAction('a 1').command).toBe(commands.archive)
  expect(interpreter.getAction('aa 1').command).toBe(commands.list)
  interpreter.getAction('a 1').parse()
})

test('archive multiple items', async () => {
  const archiveMultiple = interpreter.getAction('a 1 2 3')
  expect(archiveMultiple.command).toBe(commands.archive)
  expect(archiveMultiple.input).toEqual(['1', '2', '3'])
  // const query = archiveMultiple.parse()
  // expect(query).toEqual()
})

test('favorite multiple items', async () => {
  const archiveMultiple = interpreter.getAction('fav 1 2 3')
  expect(archiveMultiple.command).toBe(commands.favorite)
  expect(archiveMultiple.input).toEqual(['1', '2', '3'])
})

test('favorite without parameter', async () => {
  const archiveMultiple = interpreter.getAction('fav')
  expect(archiveMultiple.command).toBe(commands.favorite)
  expect(archiveMultiple.input).toEqual([])
  expect(archiveMultiple.parse()).toEqual()
})

test('open', async () => {
  const action = interpreter.getAction('open 1')
  expect(action.command).toBe(commands.open)
  const query = action.parse()
  expect(query.name).toBe('pocket-open')
  expect(query.indexes).toEqual(['1'])
})

test('expand', async () => {
  interpreter.getAction('list').parse()
  const action = interpreter.getAction('e 3')
  expect(action.command).toBe(commands.expand)
  const query = action.parse()
  expect(query.name).toBe('pocket-expand')
  expect(query.indexes).toEqual(['3'])
})

// test('print', async () => {
//   interpreter.getAction('list').parse()
//   const action = interpreter.getAction('print')
//   expect(action.command).toBe(commands.print)
//   const query = action.parse()
//   expect(query.name).toBe('pocket-print')
// })

test('interactive', async () => {
  interpreter.getAction('list').parse()

  const action = interpreter.getAction('1')
  expect(interpreter.question).toBe(action)
  expect(action.command).toBe(commands.interactive)
  expect(action.input).toEqual(['1'])
  const query = action.parse()
  expect(query.name).toBe('interactive-query')
  // not really needed..
  // expect(query.index).toBe('1')
  const output = query.execute()
  expect(output.lines).toEqual(['1. Open (default)  2. Expand  3. Favorite  4. Archive  5. Delete'])

  const answerAction = interpreter.getAction('2')
  expect(answerAction.command).toBe(commands.expand)
  expect(interpreter.question).toBeUndefined()
  const answerQuery = answerAction.parse()
  expect(answerQuery.name).toBe('pocket-expand')
  expect(answerQuery.index).toEqual('1')

  const nextAction = interpreter.getAction('something')
  expect(interpreter.question).toBeUndefined()
  expect(nextAction.command).toBe(commands.list)
  expect(nextAction.input).toEqual(['something'])

})
