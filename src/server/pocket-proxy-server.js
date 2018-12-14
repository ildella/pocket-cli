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
  res.json({name: 'pocket-cli auth proxy server'})
})

const consumerKey = secrets.POCKET || new Error('Pocket consumer_key undefined')
const pocketApi = require('./pocket-http')

// app.post('/oauth/request', async (req, res) => {
//   const payload = Object.assign({consumer_key: consumerKey}, req.body)
//   const response = await pocketApi.post('/oauth/request', payload)
//   res.json(response.data)
// })

// app.post('/oauth/authorize', async (req, res) => {
//   const payload = Object.assign({consumer_key: consumerKey}, req.body)
//   const response = await pocketApi.post('/oauth/authorize', payload)
//   res.json(response.data)
// })

// app.post('/send', async (req, res) => {
//   const payload = Object.assign({consumer_key: consumerKey}, req.body)
//   const response = await pocketApi.post('/send', payload)
//   res.json(response.data)
// })

// app.post('/get', async (req, res) => {
//   const payload = Object.assign({consumer_key: consumerKey}, req.body)
//   // console.log(payload)
//   const response = await pocketApi.post('/get', payload)
//   tracer.info(response.status, typeof response.status)
//   tracer.info(response.data)
//   // tracer.info(response.headers)
//   // tracer.info(response.config)
//   // tracer.info(response)
//   res.status(response.status).json(response.data)
//   // res.set(response.headers)
//   // res.json(response.data)
// })

app.all('/*', async (req, res) => {
  const payload = Object.assign({consumer_key: consumerKey}, req.body)
  const response = await pocketApi.post(req.url, payload)
  // tracer.info(response.status, typeof response.status)
  // tracer.info(response.data)
  res.status(response.status).json(response.data)
})

module.exports = webtask.fromExpress(app)
