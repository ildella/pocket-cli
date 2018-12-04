require('dotenv').config()
const fs = require('fs')
const express = require('express')
const app = express()
app.use(require('cookie-parser')())
const axios = require('axios')
const client = axios.create({
  baseURL: 'https://getpocket.com/v3',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
})
const port = 3344

app.get('/', (req, res) => {
  res.send('hi')
})

const pocketServer = async session => {
  app.get('/oauth/pocket/callback', async (req, res) => {
    // console.log(`Pocket has called back. Now we authorize the requestToken ${session.requestToken}`)
    const response = await client.post('/oauth/authorize', {
      consumer_key: process.env.POCKET,
      code: session.requestToken
    })
    // console.log(response.data)
    res.send(`Got the access token for ${response.data.username} -> ${response.data.access_token}`)
    fs.writeFileSync('pocket_access_token', `${response.data.access_token}\n`)
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
  await server.listen(port)
  // console.log(`Auth Server started -> http://localhost:${port}`)
}

// console.log(pocketServer[Symbol.toStringTag])
module.exports = pocketServer
