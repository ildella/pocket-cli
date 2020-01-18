const processor = require('../src/cli/process-input')
const interpreter = require('../src/cli/interpreter')
const {commands} = require('../src/cli/menu')
require('../src/pocket/pocket-commands')

beforeAll(() => {
  const localArticles = require('../src/local-articles')
  const mockArticles = require('./fixtures/mock.parsed.articles')
  localArticles.store(mockArticles)
  // expect(commands).toBe({})
  // expect(commands.archive).toBeDefined()
})

test('mode wrong input', async () => {
  const rendered = await processor.processInput('mode something')
  expect(rendered.lines[0]).toContain('no modes found')
})

test('mode unread', async () => {
  const rendered = await processor.processInput('mode unread')
  console.log(rendered)
  // TODO: check that this query has unread in it
  // const parsed = processor.interpreter('list').parse()
  // TODO: refactor so rendering happens somewhere else and we can test processor and intepreter together
  // TODO: remove the console.log for errors in processor, add tracer
})

test('archive', async () => {
  // expect(interpreter('archive 1').command).toBe(commands.archive)
  // expect(interpreter('a 1').command).toBe(commands.archive)
  // expect(interpreter('aa 1').command).toBe(commands.list)
  // interpreter('a 1').parse()
})

// test('archive multiple items', async () => {
//   const archiveMultiple = interpreter('a 1 2 3')
//   expect(archiveMultiple.command).toBe(commands.archive)
//   expect(archiveMultiple.input).toEqual(['1', '2', '3'])
// })

// test('favorite multiple items', async () => {
//   const archiveMultiple = interpreter('fav 1 2 3')
//   expect(archiveMultiple.command).toBe(commands.favorite)
//   expect(archiveMultiple.input).toEqual(['1', '2', '3'])
// })

// test('favorite without parameter', async () => {
//   const archiveMultiple = interpreter('fav')
//   expect(archiveMultiple.command).toBe(commands.favorite)
//   expect(archiveMultiple.input).toEqual([])
// })

// test('open', async () => {
//   const action = interpreter('open 1')
//   expect(action.command).toBe(commands.open)
//   const query = action.parse()
//   expect(query.name).toBe('pocket-open')
//   expect(query.indexes).toEqual(['1'])
// })

// test('expand', async () => {
//   interpreter('list').parse()
//   const action = interpreter('e 3')
//   expect(action.command).toBe(commands.expand)
//   const query = action.parse()
//   expect(query.name).toBe('pocket-expand')
//   expect(query.indexes).toEqual(['3'])
// })

// test('next and previous', async () => {
//   interpreter('list').parse()
//   const next = interpreter('next')
//   expect(next.command).toBe(commands.next)
// })

// test('interactive', async () => {
//   interpreter('list')

//   const action = interpreter('1')
//   expect(action.command).toBe(commands.select)
//   expect(action.input).toEqual(['1'])
//   expect(action.parse).toBeDefined()
//   expect(interpreter.question).toBe(action)

//   const query = action.parse()
//   expect(query.name).toBe('select-query')
//   const output = await query.execute()
//   expect(output.lines).toEqual(['1. Open (default)  2. Expand  3. Favorite  4. Archive  5. Delete'])

//   const answerAction = interpreter('2')
//   expect(answerAction.command).toBe(commands.expand)
//   expect(interpreter.question).toBeUndefined()
//   const answerQuery = answerAction.parse()
//   expect(answerQuery.name).toBe('pocket-expand')
//   expect(answerQuery.index).toEqual('1')

//   const nextAction = interpreter('something')
//   expect(nextAction.command).toBe(commands.list)
//   expect(nextAction.input).toEqual(['something'])
//   expect(interpreter.question).toBeUndefined()

// })
