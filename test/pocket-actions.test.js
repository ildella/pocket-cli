const {archive, favorite, tag, readd} = require('../src/pocket/pocket-parse')
const localArticles = require('../src/local-articles')
const mockArticles = require('./mock.articles')
localArticles.store(mockArticles)

test('Archive', async () => {
  const query = archive(['2'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(1)
  // expect(query.actions).toBe('archive')
  expect(query.actions[0].action).toBe('archive')
  expect(query.actions[0].item_id).toBe('m2')
})

test('Archive no index', async () => {
  const query = archive([])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(0)
})

test('Archive with multiple indexes', async () => {
  const query = archive(['1', '3', '4'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(3)
  expect(query.actions[0].action).toBe('archive')
  expect(query.actions[0].item_id).toBe('m1')
  expect(query.actions[1].action).toBe('archive')
  expect(query.actions[1].item_id).toBe('m3')
})

test('Favorite multiple items', async () => {
  const query = favorite(['1', '2', '4'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(3)
  expect(query.actions[0].action).toBe('favorite')
  expect(query.actions[0].item_id).toBe('m1')
  expect(query.actions[1].action).toBe('favorite')
  expect(query.actions[1].item_id).toBe('m2')
})

test('Readd multiple items', async () => {
  const query = readd(['1', '2', '4'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(3)
  expect(query.actions[0].action).toBe('readd')
  expect(query.actions[0].item_id).toBe('m1')
  expect(query.actions[1].action).toBe('readd')
  expect(query.actions[1].item_id).toBe('m2')
})

test('Tag - add', async () => {
  const query = tag(['1', '2', 'aTag', '4', 'anotherTag'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(3)
  expect(query.actions[0].action).toBe('tags_add')
  expect(query.actions[0].item_id).toBe('m1')
  expect(query.actions[0].tags).toEqual('aTag, anotherTag')
})
