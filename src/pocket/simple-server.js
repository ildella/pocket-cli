const fs = require('fs')
const http = require('http')
const homedir = require('os').homedir()

const client = require('./pocket-cli-http')

const authorize = async requestToken => {
  const response = await client.post('/oauth/authorize', {code: requestToken})
  fs.writeFileSync(`${homedir}/.config/pocket_access_token`, `${response.data.access_token}\n`)
  // console.log('authorization succeded')
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

module.exports = simpleServer
