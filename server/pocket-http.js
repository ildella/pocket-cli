const tracer = require('../src/logger')()
const axios = require('axios')

const client = axios.create({
  baseURL: 'https://getpocket.com/v3',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
})

client.interceptors.response.use(response => {
  return response
}, error => {
  const response = error.response
  if (response) {
    const config = response.config
    const message = `${response.status} ${config.method} ${config.url}`
    tracer.warn('ignoring this "error" from Pocket API') //TODO use emit
    tracer.warn(message) //TODO use emit
    // console.error(config)
  } else {
    tracer.error('Network Error')
  }
  return response
})

module.exports = client
