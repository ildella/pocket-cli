const secrets = module.webtask ? module.webtask.secrets : process.env
const tracer = require('tracer').colorConsole({
  level: secrets.LOG_LEVEL || 'debug',
  dateformat: 'HH:MM:ss',
  transport: [
    data => { console.log(data.output) }
  ]
})
process.on('unhandledRejection', (reason, p) => {
  const response = reason.response
  if (response) {
    const config = response.config
    const message = `${response.status} ${config.method} ${config.url} ${config.data}`
    tracer.error(message)
  } else { tracer.error(reason) }
})
const express = require('express')
// const app = require('express-async-await')(express())
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendStatus(200)
})

const consumerKey = secrets.POCKET || new Error('Pocket consumer_key undefined')
const pocketApi = require('../pocket/pocket-http')

app.post('/oauth/request', async (req, res) => {
  const payload = Object.assign({consumer_key: consumerKey}, req.body)
  const response = await pocketApi.post('/oauth/request', payload)
  res.json(response.data)
})

app.post('/oauth/authorize', async (req, res) => {
  const payload = Object.assign({consumer_key: consumerKey}, req.body)
  const response = await pocketApi.post('/oauth/authorize', payload)
  res.json(response.data)
})

module.exports = require('webtask-tools').fromExpress(app)
