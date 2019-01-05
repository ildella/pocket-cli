const interpreter = require('../src/cli/interpreter')
const {commands} = require('../src/cli/menu')
require('../src/pocket/pocket-commands')

test('basic commands are loaded', async () => {
  expect(Object.entries(commands)).toHaveLength(3)
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
})

test('parse', async () => {
  const action = interpreter('list')
  const query = action.parse()
  expect(query.name).toEqual('pocket-list')
})

