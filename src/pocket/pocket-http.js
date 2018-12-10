const axios = require('axios')

const client = axios.create({
  baseURL: 'https://getpocket.com/v3',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
})

client.retrieve = async query => {
  return client.post('get', query)
}

client.modify = async actions => {
  const query = Object.assign(
    {actions: actions},
    {
      consumer_key: process.env.POCKET,
      access_token: global.userAccessToken
    })
  return client.post('/send', query)
}

module.exports = client
