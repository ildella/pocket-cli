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
