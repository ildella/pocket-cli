const fs = require('fs').promises
const axios = require('axios')
const {red, bold} = require('colorette')
const containerName = 'wt-c7bbe7e68d36c0caa6436b2be9c7052a-0'
const taskName = 'pocket-cli-proxy-server'
const homedir = require('os').homedir()

const readToken = () => {
  return fs.readFile(`${homedir}/.config/pocket_access_token`)
}

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
    console.error(red(bold(message))) //TODO use emit
    // console.error(config)
  } else {
    console.error(red(bold('Network Error')))
  }
  return {error: error, source: 'axios interceptor'}
})

client.retrieve = async search => {
  const userAccessToken = (await readToken()).toString()
  const query = Object.assign({access_token: userAccessToken}, search)
  return client.post('/get', query)
}

client.modify = async actions => {
  const userAccessToken = (await readToken()).toString()
  const query = Object.assign(
    {access_token: userAccessToken},
    {actions: actions}
  )
  return client.post('/send', query)
}

module.exports = client
