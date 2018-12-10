'use strict'
const consumerKey = process.env.POCKET || new Error('Pocket consumer_key undefined')
const {execSync} = require('child_process')

const server = require('./pocket-auth-server')
const client = require('./pocket-http')

const redirectURI = 'http://localhost:3344/oauth/pocket/callback'
const session = {}

const start = async () => {
  await server(session)
  const body = {
    consumer_key: consumerKey,
    redirect_uri: `${redirectURI}`,
    state: 'ok'
  }
  // console.log(body)
  const response = await client.post('/oauth/request', body)
  const requestToken = response.data.code
  console.log('got request token:', requestToken)
  const authorizeUrl = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectURI}`
  session.requestToken = requestToken
  console.log('open auth URL to the user ->', authorizeUrl)
  const exec = execSync(`xdg-open "${authorizeUrl}"`)
}

module.exports.start = start
