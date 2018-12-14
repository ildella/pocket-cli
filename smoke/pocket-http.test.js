const cexpect = require('chai').expect
test('same instance', () => {
  const p1 = require('../src/pocket/pocket-cli-http')()
  const p2 = require('../src/pocket/pocket-cli-http')()
  expect(p1).not.toBe(p2)
})

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

  try {
    await pocket.retrieve(search)
  } catch (err) {
    cexpect(err).to.be.an.instanceof(Error)
    cexpect(err.message).to.contain('auth')
    cexpect(err.message).to.contain('401')
  }

  // expect.assertions(1)
  // await expect(pocket.retrieve(search)).rejects.toEqual(['auth: 401 post https://wt-c7bbe7e68d36c0caa6436b2be9c7052a-0.sandbox.auth0-extend.com/pocket-proxy-server-dev/get'])
})

test('requestToken', async () => {
  const pocket = require('../src/pocket/pocket-cli-http')()
  const token = await pocket.requestToken('http://localhost:4444/callback')
  expect(token).toBeDefined()
  expect(token).toHaveLength(30)
})
