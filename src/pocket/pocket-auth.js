'use strict'
const {execSync} = require('child_process')
const open = require('../cli/open')

const callbackServer = require('./simple-server')
const client = require('./pocket-cli-http')
const port = process.env.CALLBACK_PORT || 3300

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
  const exec = execSync(`${open.get()} "${authorizeUrl}"`)
}

module.exports.start = start
