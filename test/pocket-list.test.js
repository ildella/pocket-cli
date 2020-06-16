const pocket = require('../src/pocket/pocket-parse')

const {list} = require('../src/pocket/pocket-parse')

pocket.client = {
  read: () => [],
  modify: () => [],
  add: () => []
}

test('retrieve defaults', async () => {
  const output = list()
  expect(output.name).toBe('pocket-list')
  expect(output.search.count).toEqual(8)
  expect(output.search.detailType).toEqual('complete')
  expect(output.search.search).toEqual('')
  // expect(output.search.since).toEqual('')
  expect(output.search.sort).toEqual('newest')
  expect(output.search.state).toEqual('all')
})

test('search params', async () => {
  const output = list(['bitcoin', 'block'])
  expect(output.search.search).toEqual('bitcoin block')
})

test('reserverd - unread', async () => {
  const output = list(['unread', 'nodejs'])
  expect(output.search.state).toEqual('unread')
  expect(output.search.search).toEqual('nodejs')
})

test('json query to human readable text', async () => {
  list(['unread', 'nodejs', 'oldest'])
  // expect(pocket.toHumanText()).toContain('nodejs')
  // expect(pocket.toHumanText()).toContain('unread')
  // expect(pocket.toHumanText()).toContain('oldest')
  // // expect(pocket.toHumanText()).toBe('Search for nodejs in unread documents, order by oldest starting January 1, 1970')
  // await list(['bitcoin', 'site'])
  // expect(pocket.toHumanText()).toContain('bitcoin')
  // expect(pocket.toHumanText()).toContain('site')
  // expect(pocket.toHumanText()).toContain('all')
  // console.log(pocket.toHumanText())
})
