const fs = require('fs').promises
const axios = require('axios')
const {red, bold} = require('colorette')

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
    console.error(red(bold(message))) //TODO use emit for this kind of low level errors
    console.error(config)
  } else {
    console.error(red(bold('Network Error')))
  }
  return {error: error, source: 'axios interceptor'}
})

client.retrieve = async search => {
  const userAccessToken = (await fs.readFile('pocket_access_token')).toString()
  const query = Object.assign(
    {
      consumer_key: process.env.POCKET,
      access_token: userAccessToken
    }, search)
  return client.post('get', query)
}

client.modify = async actions => {
  const userAccessToken = (await fs.readFile('pocket_access_token')).toString()
  const query = Object.assign(
    {
      consumer_key: process.env.POCKET,
      access_token: userAccessToken
    },
    {actions: actions}
  )
  return client.post('/send', query)
}

module.exports = client
