const axios = require('axios')
const containerName = 'wt-c7bbe7e68d36c0caa6436b2be9c7052a-0'
const taskName = 'pocket-cli-proxy-server'
const tracer = require('../logger')()
const auth = require('../auth')()

const client = axios.create({
  baseURL: `https://${containerName}.sandbox.auth0-extend.com/${taskName}`,
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
    tracer.error(message) //TODO use emit
  } else {
    tracer.error('Network Error')
  }
  return {error: error, source: 'axios interceptor'}
})

client.retrieve = async search => {
  const query = Object.assign(auth.get(), search)
  return client.post('/get', query)
}

client.modify = async actions => {
  const query = Object.assign(
    auth.get(),
    {actions: actions}
  )
  return client.post('/send', query)
}

module.exports = client
