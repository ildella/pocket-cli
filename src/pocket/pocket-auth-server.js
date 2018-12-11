const fs = require('fs')
const express = require('express')
const app = express()

const client = require('./pocket-cli-http')

app.get('/', (req, res) => { res.send('up and running :)') })

const pocketServer = async requestToken => {
  app.get('/oauth/pocket/callback', async (req, res) => {
    // console.log(`Pocket has called back. Now we authorize the requestToken ${session.requestToken}`)
    const response = await client.post('/oauth/authorize', {
      // consumer_key: process.env.POCKET,
      code: requestToken
    })
    fs.writeFileSync('pocket_access_token', `${response.data.access_token}\n`)
    res.send(`Authentication completed, welcome '${response.data.username}'. You can close this tab.`)
    server.close(err => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log('Server closed with no errors. Shutting down connections')
    })
  })

  const http = require('http')
  const server = http.createServer(app)
  const listener = await server.listen(process.env.CALLBACK_PORT || 3300)
  console.log(`Auth Callback Server started -> http://localhost:${listener.address().port}`)

}

module.exports = pocketServer
