'use strict'
const {execSync} = require('child_process')

const callbackServer = require('./pocket-auth-server')
const client = require('./pocket-cli-auth-client')
const port = process.env.CALLBACK_PORT

const redirectURI = `http://localhost:${port}/oauth/pocket/callback`

const start = async () => {
  const body = {
    redirect_uri: `${redirectURI}`,
    state: 'ok'
  }
  const response = await client.post('/oauth/request', body)
  const requestToken = response.data.code
  const authorizeUrl = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectURI}`
  await callbackServer(requestToken)
  const exec = execSync(`xdg-open "${authorizeUrl}"`)
}

module.exports.start = start
