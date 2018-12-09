require('dotenv').config()
const pocket = require('../src/pocket/pocket-read')
const fs = require('fs').promises

// const app = require('../src')

beforeAll(async () => {
  global.userAccessToken = (await fs.readFile('pocket_access_token')).toString()
})

test('read from pocket API', async () => {
  // const output = await pocket.read()
  // expect(output).toHaveLength(5)
})

test('modify with pocket API - archive/readd', async () => {
  // const query = pocket.toQuery(['bitcoin',  'unread'])
  // const output = await query.execute()
  // expect(output).toHaveLength(12)
  // // expect(output[2]).toBe('')
  // const modified = pocket.modifyQuery('archive', 2).execute()
  // expect(await modified).toBe()
})

test('start app', async () => {
  // app.init()
})
