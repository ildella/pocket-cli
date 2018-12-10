const axios = require('axios')

const client = axios.create({
  baseURL: 'https://getpocket.com/v3',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
})

client.retrieve = async search => {
  const query = Object.assign(
    {
      consumer_key: process.env.POCKET,
      access_token: global.userAccessToken
    }, search)
  return client.post('get', query)
}

client.modify = async actions => {
  const query = Object.assign(
    {
      consumer_key: process.env.POCKET,
      access_token: global.userAccessToken
    },
    {actions: actions}
  )
  return client.post('/send', query)
}

module.exports = client
