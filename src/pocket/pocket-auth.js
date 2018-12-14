const fs = require('fs')
const http = require('http')
const {execSync} = require('child_process')
const homedir = require('os').homedir()

const port = process.env.CALLBACK_PORT || 3300
const task = process.env.TASK || 'pocket-proxy-server-dev'
const redirectURI = `http://localhost:${port}/oauth/pocket/callback`

const open = require('../cli/open')
const auth = require('../auth')()
const client = require('./pocket-cli-http')({taskName: task})

const pocketAuth = {}

pocketAuth.login = async () => {
  // TODO should return the authorizeUrl
  const requestToken = await client.requestToken(redirectURI)
  const authorizeUrl = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectURI}`
  await simpleServer(requestToken)
  const exec = execSync(`${open.get()} "${authorizeUrl}"`)
}

pocketAuth.logout = () => {
  auth.clear()
}

const authorize = async requestToken => {
  // TODO authorize should return the code, not the whole response
  const response = await client.authorize(requestToken)
  // TODO: use auth.write instead of direct fs write
  fs.writeFileSync(`${homedir}/.config/pocket_access_token`, `${response.data.access_token}\n`)
  return response.data.username
}

const simpleServer = async requestToken => {
  const server = http.createServer(async (req, res) => {
    if (req.url === '/' && req.method === 'GET') {
      res.end('up and running\n')
    }
    if (req.url === '/oauth/pocket/callback' && req.method === 'GET') {
      const username = await authorize(requestToken)
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end(`Authentication completed, welcome '${username}'. You can close this tab.`)
      server.close(err => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
        console.log('Server closed with no errors. Shutting down connections')
      })
    }
    res.writeHead(400, {'Content-Type': 'text/plain'})
    res.end('Do not handle that address\n')
  })
  const listener = await server.listen(process.env.CALLBACK_PORT || 3300)
  // console.log(`Auth Callback Server started -> http://localhost:${listener.address().port}`)
}

module.exports = pocketAuth
