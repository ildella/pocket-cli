test('read from pocket API', async () => {
  const auth = require('../src/auth')()
  const authJson = auth.get()
  const pocket = require('../src/pocket/pocket-cli-http')({
    taskName: 'pocket-proxy-server-dev',
    auth: authJson
  })
  const search = {
    count: 10,
    offset: 0,
    since: 0
  }
  const response = await pocket.retrieve(search)
  expect(response.status).toBe(200)
  expect(response.data.status).toBe(1)
  expect(response.data.complete).toBe(1)
  expect(response.data.error).toBeNull()
  expect(response.data.search_meta).toEqual({search_type: 'normal'})
  expect(Object.values(response.data.list)).toHaveLength(10)
})

test('unauthorized', async () => {
  const pocket = require('../src/pocket/pocket-cli-http')()
  const search = {
    count: 10,
    offset: 0,
    since: 0
  }
  const response = await pocket.retrieve(search)
  expect(response.status).toBe(401)
  expect(response.data).toBe('401 Unauthorized')
  // expect(response.headers).toBe()
  // expect(response.config).toBe()
})

test('requestToken', async () => {
  const pocket = require('../src/pocket/pocket-cli-http')()
  const token = await pocket.requestToken('http://localhost:4444/callback')
  expect(token).toBeDefined()
  expect(token).toHaveLength(30)
})
