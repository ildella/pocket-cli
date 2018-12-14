const webtask = require('webtask-tools')
const tracer = require('../logger')()
require('dotenv').config()
const secrets = module.webtask ? module.webtask.secrets : process.env
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
  res.json({name: 'pocket-cli proxy server'})
})

const consumerKey = secrets.POCKET || new Error('Pocket consumer_key undefined')
const pocketApi = require('./pocket-http')

app.all('/*', async (req, res) => {
  const payload = Object.assign({consumer_key: consumerKey}, req.body)
  const response = await pocketApi.post(req.url, payload)
  // tracer.info(response.status, typeof response.status)
  // tracer.info(response.data)
  res.status(response.status).json(response.data)
})

module.exports = webtask.fromExpress(app)
