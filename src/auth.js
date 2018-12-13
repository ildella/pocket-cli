// const tracer = require('./logger')()
const fs = require('fs')
const homedir = require('os').homedir()

const auth = config => {

  const actualConfig = config || {}
  const accessTokenFileName = actualConfig.tokenFileName || 'pocket_access_token'
  const accessTokenPath = `${homedir}/.config/${accessTokenFileName}`

  const readToken = () => {
    const file = fs.readFileSync(accessTokenPath)
    return file.toString()
    // try {
    // } catch (e) {
    //   tracer.error(e)
    //   throw(new Error())
    // }
  }

  return {

    accessTokenPath: accessTokenPath,

    get: () => {
      return {access_token: readToken()}
    }
  }

}

module.exports = auth
