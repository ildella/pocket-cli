// const tracer = require('./logger')()
const fs = require('fs')
const homedir = require('os').homedir()

const auth = config => {

  const actualConfig = config || {}
  // const accessTokenFileName = actualConfig.tokenFileName || 'pocket_access_token'
  const accessTokenPath = actualConfig.tokenFilePath
    ? actualConfig.tokenFilePath
    : `${homedir}/.config/pocket_access_token`

  const readToken = () => {
    try {
      const file = fs.readFileSync(accessTokenPath)
      return file.toString()
    } catch (e) {
      return null
    }
  }

  return {

    accessTokenPath: accessTokenPath,

    get: () => {
      const token = readToken()
      return token ? {access_token: readToken()} : null
    }
  }

}

module.exports = auth
