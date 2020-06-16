const assert = require('assert')
const expect = require('chai').expect

require('dotenv').config()
const axios = require('axios')
const redirectURI = 'http://localhost:3344/oauth/pocket/callback'

test('pochet oauth', async () => {
  const client = axios.create({
    baseURL: 'https://getpocket.com/v3',
  })
  const response = await client.post('/oauth/request', {
    consumer_key: process.env.POCKET,
    redirect_uri: `${redirectURI}`,
    state: 'ok'
  })
  expect(response.data).toBeDefined()
  expect(response.data).toContain('code=')
  // expect(response.data).to.be.a('string')
  // expect(response.data).to.contain('code=')
  // expect(response.data).to.contain('state=')
  const code = response.data.split('&')[0].split('=')[1]
  const state = response.data.split('&')[1].split('=')[1]
  // console.log(code, 'the request token to be associated to user session')
  assert.strict.equal(state, 'ok')
  // expect(state).to.be('ok')
  // console.log(`https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=${redirectURI}`)
  // expect(response.data).to.have.property('b').but.not.own.property('b');
})

test('pochet oauth json', async () => {
  const client = axios.create({
    baseURL: 'https://getpocket.com/v3',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    }
  })

  const response = await client.post('/oauth/request', {
    consumer_key: process.env.POCKET,
    redirect_uri: `${redirectURI}`,
    state: 'ok'
  })

  // expect(response.data.code).to.be.a('string')
  // expect(response.data.state).to.be.a('string')
  const code = response.data.code
  const state = response.data.state
  console.log(code, 'the request token to be associated to user session')
  assert.strict.equal(state, 'ok')
  console.log(`https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=${redirectURI}`)
})
