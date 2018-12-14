const axios = require('axios')
const containerName = 'wt-c7bbe7e68d36c0caa6436b2be9c7052a-0'
// const tracer = require('../logger')()

const build = config => {

  const pocket = {}

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

  client.interceptors.response.use(response => {
    return response
  }, error => {
    const response = error.response
    if (response) {
      const config = response.config
      const message = `${response.status} ${config.method} ${config.url}`
      // tracer.warn(message)
    } else {
      // tracer.error('Network Error')
    }
    return response
  })

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

module.exports = build
