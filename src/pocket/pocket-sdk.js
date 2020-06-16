const axios = require('axios')
const containerName = 'wt-c7bbe7e68d36c0caa6436b2be9c7052a-0'

const pocket = (client, authJson) => {

  const pocket = {}

  pocket.requestToken = async redirectURI => {
    const body = {
      redirect_uri: `${redirectURI}`,
      state: 'ok'
    }
    const response = await client.post('/oauth/request', body)
    return response.data.code
  }

  pocket.authorize = requestToken => client.post('/oauth/authorize', {code: requestToken})

  pocket.retrieve = async search => {
    const query = Object.assign(authJson, search)
    return client.post('/get', query)
  }

  pocket.modify = async actions => {
    const query = Object.assign(
      authJson,
      {actions: actions}
    )
    return client.post('/send', query)
  }

  return pocket

}

const build = config => {

  const actualConfig = config || {}
  const taskName = actualConfig.taskName || 'pocket-proxy-server-dev'
  const authJson = actualConfig.auth || {}

  const client = axios.create({
    baseURL: `https://${containerName}.sandbox.auth0-extend.com/${taskName}`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    }
  })

  client.interceptors.response.use(response => response, error => {
    const response = error.response
    if (response) {
      const config = response.config
      const message = `${response.status} ${config.method} ${config.url}`
      const err = new Error(message)
      err.name = response.status === 401 ? 'auth' : 'api-error'
      throw err
    }
    throw new Error('Network Error', 'network-error')
  })

  return pocket(client, authJson)
}

module.exports = build
