'use strict'
const consumerKey = process.env.POCKET || new Error('Pocket consumer_key undefined')
const axios = require('axios')
const {execSync} = require('child_process')
const server = require('./pocket-auth-server')
const session = {}

const redirectURI = 'http://localhost:3344/oauth/pocket/callback'

const client = axios.create({
  baseURL: 'https://getpocket.com/v3',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
})

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
  // const state = response.data.state
  const authorizeUrl = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectURI}`
  session.requestToken = requestToken
  // console.log(authorizeUrl)
  const exec = execSync(`xdg-open "${authorizeUrl}"`)
}

module.exports.start = start
