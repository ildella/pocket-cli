const interpreter = require('../src/cli/interpreter')
const commands = interpreter.commands
require('../src/pocket/pocket-commands')
require('../src/pocket/pocket-parse')
const localArticles = require('../src/pocket/pocket-articles')
const mockArticles = require('./mock.articles')

beforeAll(() => {
  localArticles.store(mockArticles)
})

test('list with search parameters', async () => {
  const action = interpreter('list bitcoin yesterday')
  expect(action.command).toBe(commands.list)
  expect(action.input).toEqual(['bitcoin', 'yesterday'])
})

test('assume list as default command name', async () => {
  const action = interpreter('nodejs')
  expect(action.command).toBe(commands.list)
  expect(action.input).toEqual(['nodejs'])
})

test('aliases and reserved words', async () => {
  const action = interpreter('search nodejs unread')
  expect(action.command).toBe(commands.list)
  expect(action.input).toEqual(['nodejs', 'unread'])
  const query = await action.parse()
  expect(query.name).toEqual('pocket-list')
  // expect(query.execute).toBeDefined()
})

test('archive', async () => {
  expect(interpreter('archive 1').command).toBe(commands.archive)
  expect(interpreter('a 1').command).toBe(commands.archive)
  expect(interpreter('aa 1').command).toBe(commands.list)
  interpreter('a 1').parse()
})

test('archive multiple items', async () => {
  const archiveMultiple = interpreter('a 1 2 3')
  expect(archiveMultiple.command).toBe(commands.archive)
  expect(archiveMultiple.input).toEqual(['1', '2', '3'])
})

test('favorite multiple items', async () => {
  const archiveMultiple = interpreter('fav 1 2 3')
  expect(archiveMultiple.command).toBe(commands.favorite)
  expect(archiveMultiple.input).toEqual(['1', '2', '3'])
})

test('favorite without parameter', async () => {
  const archiveMultiple = interpreter('fav')
  expect(archiveMultiple.command).toBe(commands.favorite)
  expect(archiveMultiple.input).toEqual([])
  // const parse = archiveMultiple.parse()
  // expect(parse).toEqual()
})

test('open', async () => {
  const action = interpreter('open 1')
  expect(action.command).toBe(commands.open)
  const query = action.parse()
  expect(query.name).toBe('pocket-open')
  expect(query.indexes).toEqual(['1'])
})

test('expand', async () => {
  interpreter('list').parse()
  const action = interpreter('e 3')
  expect(action.command).toBe(commands.expand)
  const query = action.parse()
  expect(query.name).toBe('pocket-expand')
  expect(query.indexes).toEqual(['3'])
})

// test('print', async () => {
//   interpreter('list').parse()
//   const action = interpreter('print')
//   expect(action.command).toBe(commands.print)
//   const query = action.parse()
//   expect(query.name).toBe('pocket-print')
// })

test('interactive', async () => {
  // interpreter('list').parse()
  
  // TODO pocketParse.store(mock list of articles...)
  // or pocketLocal.store...

  const action = interpreter('1')
  expect(interpreter.question).toBe(action)

  expect(action.parse).toBeDefined()
  expect(action.input).toEqual(['1'])
  expect(action.command).toBe(commands.select)
  const query = action.parse()
  expect(query.name).toBe('select')
  // const output = query.execute()
  // expect(output.lines).toEqual(['1. Open (default)  2. Expand  3. Favorite  4. Archive  5. Delete'])

  // const answerAction = interpreter('2')
  // expect(answerAction.command).toBe(commands.expand)
  // expect(interpreter.question).toBeUndefined()
  // const answerQuery = answerAction.parse()
  // expect(answerQuery.name).toBe('pocket-expand')
  // expect(answerQuery.index).toEqual('1')

  // const nextAction = interpreter('something')
  // expect(interpreter.question).toBeUndefined()
  // expect(nextAction.command).toBe(commands.list)
  // expect(nextAction.input).toEqual(['something'])

})
