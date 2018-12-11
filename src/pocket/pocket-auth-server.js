const fs = require('fs')
const express = require('express')
const app = express()
app.use(require('cookie-parser')())

const client = require('./pocket-http')

const port = 3344

app.get('/', (req, res) => {
  res.send('hi')
})

const pocketServer = session => {
  app.get('/oauth/pocket/callback', async (req, res) => {
    // console.log(`Pocket has called back. Now we authorize the requestToken ${session.requestToken}`)
    const response = await client.post('/oauth/authorize', {
      consumer_key: process.env.POCKET,
      code: session.requestToken
    })
    fs.writeFileSync('pocket_access_token', `${response.data.access_token}\n`)
    res.send(`Stored access token for ${response.data.username}. You can close this tab.`)
  })

  const http = require('http')
  const server = http.createServer(app)
  process.on('SIGINT', () => {
    console.info('SIGINT signal received...')
    server.close(err => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log('Server closed with no errors. Shutting down connections')
    })
  })
  server.listen(port)
  console.log(`Auth Server started -> http://localhost:${port}`)
}

// console.log(pocketServer[Symbol.toStringTag])
module.exports = pocketServer
