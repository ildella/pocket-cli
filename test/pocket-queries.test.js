require('dotenv').config()
const pocket = require('../src/pocket/pocket-read')

pocket.client = {
  read: () => { return [] },
  modify: () => { return [] },
  add: () => { return [] }
}

test('toQuery defaults', async () => {
  const output = pocket.toQuery()
  expect(output.name).toBe('pocket-read')
  expect(output.query.count).toEqual(8)
  expect(output.query.detailType).toEqual('complete')
  expect(output.query.search).toEqual('')
  // expect(output.query.since).toEqual('')
  expect(output.query.sort).toEqual('newest')
  expect(output.query.state).toEqual('all')
})

test('search params', async () => {
  const output = pocket.toQuery(['bitcoin', 'block'])
  expect(output.query.search).toEqual('bitcoin block')
})

test('reserverd - unread', async () => {
  const output = pocket.toQuery(['unread', 'nodejs'])
  expect(output.query.state).toEqual('unread')
  expect(output.query.search).toEqual('nodejs')
})

test('json query to human readable text', async () => {
  pocket.toQuery(['unread', 'nodejs', 'oldest'])
  expect(pocket.toHumanText()).toBe('Search for "nodejs" in "unread" documents, order by "oldest" starting January 1, 1970')
  await pocket.toQuery(['bitcoin', 'site'])
  expect(pocket.toHumanText()).toBe('Search for "bitcoin" in "all" documents, order by "site" starting January 1, 1970')
  console.log(pocket.toHumanText())
})
