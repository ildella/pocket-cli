// require('dotenv').config()
const pocket = require('../src/pocket/pocket-read')

pocket.client = {
  read: () => { return [] },
  modify: () => { return [] },
  add: () => { return [] }
}

test('toQuery defaults', async () => {
  const output = pocket.toQuery()
  expect(output.name).toBe('pocket-read')
  expect(output.search.count).toEqual(8)
  expect(output.search.detailType).toEqual('complete')
  expect(output.search.search).toEqual('')
  // expect(output.search.since).toEqual('')
  expect(output.search.sort).toEqual('newest')
  expect(output.search.state).toEqual('all')
})

test('search params', async () => {
  const output = pocket.toQuery(['bitcoin', 'block'])
  expect(output.search.search).toEqual('bitcoin block')
})

test('reserverd - unread', async () => {
  const output = pocket.toQuery(['unread', 'nodejs'])
  expect(output.search.state).toEqual('unread')
  expect(output.search.search).toEqual('nodejs')
})

test('json query to human readable text', async () => {
  pocket.toQuery(['unread', 'nodejs', 'oldest'])
  expect(pocket.toHumanText()).toBe('Search for "nodejs" in "unread" documents, order by "oldest" starting January 1, 1970')
  await pocket.toQuery(['bitcoin', 'site'])
  expect(pocket.toHumanText()).toBe('Search for "bitcoin" in "all" documents, order by "site" starting January 1, 1970')
  console.log(pocket.toHumanText())
})

const article1 = {item_id: 'a1'}
const article2 = {item_id: 'a2'}
const article3 = {item_id: 'a3'}
pocket.articles = [article1, article2, article3]

test('Modify query', async () => {
  const query = pocket.modifyQuery('archive', '2')
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(1)
  expect(query.actions[0].action).toBe('archive')
  expect(query.actions[0].item_id).toBe('a2')
})

test('Modify query - no matching index', async () => {
  const query = pocket.modifyQuery('archive', 'ddd')
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(0)
})

test('Modify query - no index', async () => {
  const query = pocket.modifyQuery('archive')
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(0)
})

test('Modify query with multiple indexes', async () => {
  const query = pocket.modifyQuery('archive', ['1', '3', '4'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(2)
  expect(query.actions[0].action).toBe('archive')
  expect(query.actions[0].item_id).toBe('a1')
  expect(query.actions[1].action).toBe('archive')
  expect(query.actions[1].item_id).toBe('a3')
})

test('Favorite multiple items', async () => {
  const query = pocket.modifyQuery('fav', ['1', '2', '4'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(2)
  expect(query.actions[0].action).toBe('fav')
  expect(query.actions[0].item_id).toBe('a1')
  expect(query.actions[1].action).toBe('fav')
  expect(query.actions[1].item_id).toBe('a2')
})

test('Readd multiple items', async () => {
  const query = pocket.modifyQuery('readd', ['1', '2', '4'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(2)
  expect(query.actions[0].action).toBe('readd')
  expect(query.actions[0].item_id).toBe('a1')
  expect(query.actions[1].action).toBe('readd')
  expect(query.actions[1].item_id).toBe('a2')
})
