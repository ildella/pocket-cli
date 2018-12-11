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
    console.error(message) //TODO use emit for this kind of low level errors
    console.error(config)
  } else {
    console.error('Network Error')
  }
  return {error: error, source: 'axios interceptor'}
})

module.exports = client
