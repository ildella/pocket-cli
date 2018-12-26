const cexpect = require('chai').expect

test('same instance', () => {
  const p1 = require('../src/pocket/pocket-sdk')()
  const p2 = require('../src/pocket/pocket-sdk')()
  expect(p1).not.toBe(p2)
})

test('read from pocket API', async () => {
  const auth = require('../src/auth')()
  const authJson = auth.get()
  const pocket = require('../src/pocket/pocket-sdk')({
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
  console.log(response.data)
  expect(Object.values(response.data.list)).toHaveLength(10)
})

test('unauthorized', async () => {
  const pocket = require('../src/pocket/pocket-sdk')()
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

})

test('requestToken', async () => {
  const pocket = require('../src/pocket/pocket-sdk')()
  const token = await pocket.requestToken('http://localhost:4444/callback')
  expect(token).toBeDefined()
  expect(token).toHaveLength(30)
})
