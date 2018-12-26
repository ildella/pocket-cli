// require('dotenv').config()
const pocket = require('../src/pocket/pocket-parse')
const modify = require('../src/pocket/pocket-parse').modify

pocket.client = {
  read: () => { return [] },
  modify: () => { return [] },
  add: () => { return [] }
}

test('retrieve defaults', async () => {
  const output = pocket.list()
  expect(output.name).toBe('pocket-list')
  expect(output.search.count).toEqual(8)
  expect(output.search.detailType).toEqual('complete')
  expect(output.search.search).toEqual('')
  // expect(output.search.since).toEqual('')
  expect(output.search.sort).toEqual('newest')
  expect(output.search.state).toEqual('all')
})

test('search params', async () => {
  const output = pocket.list(['bitcoin', 'block'])
  expect(output.search.search).toEqual('bitcoin block')
})

test('reserverd - unread', async () => {
  const output = pocket.list(['unread', 'nodejs'])
  expect(output.search.state).toEqual('unread')
  expect(output.search.search).toEqual('nodejs')
})

test('json query to human readable text', async () => {
  pocket.list(['unread', 'nodejs', 'oldest'])
  // expect(pocket.toHumanText()).toContain('nodejs')
  // expect(pocket.toHumanText()).toContain('unread')
  // expect(pocket.toHumanText()).toContain('oldest')
  // // expect(pocket.toHumanText()).toBe('Search for nodejs in unread documents, order by oldest starting January 1, 1970')
  // await pocket.list(['bitcoin', 'site'])
  // expect(pocket.toHumanText()).toContain('bitcoin')
  // expect(pocket.toHumanText()).toContain('site')
  // expect(pocket.toHumanText()).toContain('all')
  // console.log(pocket.toHumanText())
})

// TODO same thing as in interpreter-pocket: we need a local storage
// const article1 = {item_id: 'a1'}
// const article2 = {item_id: 'a2'}
// const article3 = {item_id: 'a3'}
// pocket.articles = [article1, article2, article3]
const localArticles = require('../src/local-articles')
const mockArticles = require('./mock.articles')
localArticles.store(mockArticles)

test('Modify query', async () => {
  const query = modify('archive', '2')
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(1)
  // expect(query.actions).toBe('archive')
  expect(query.actions[0].action).toBe('archive')
  expect(query.actions[0].item_id).toBe('m2')
})

// test('Modify query - no matching index', async () => {
//   const query = modify('archive', '')
//   expect(query.name).toEqual('pocket-modify')
//   expect(query.actions).toHaveLength(0)
// })

test('Modify query - no index', async () => {
  const query = modify('archive')
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(0)
})

test('Modify query with multiple indexes', async () => {
  const query = modify('archive', ['1', '3', '4'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(3)
  expect(query.actions[0].action).toBe('archive')
  expect(query.actions[0].item_id).toBe('m1')
  expect(query.actions[1].action).toBe('archive')
  expect(query.actions[1].item_id).toBe('m3')
})

test('Favorite multiple items', async () => {
  const query = modify('fav', ['1', '2', '4'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(3)
  expect(query.actions[0].action).toBe('fav')
  expect(query.actions[0].item_id).toBe('m1')
  expect(query.actions[1].action).toBe('fav')
  expect(query.actions[1].item_id).toBe('m2')
})

test('Readd multiple items', async () => {
  const query = modify('readd', ['1', '2', '4'])
  expect(query.name).toEqual('pocket-modify')
  expect(query.actions).toHaveLength(3)
  expect(query.actions[0].action).toBe('readd')
  expect(query.actions[0].item_id).toBe('m1')
  expect(query.actions[1].action).toBe('readd')
  expect(query.actions[1].item_id).toBe('m2')
})
