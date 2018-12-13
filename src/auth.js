const fs = require('fs').promises
const homedir = require('os').homedir()

const auth = config => {

  const actualConfig = config || {}
  const accessTokenFileName = actualConfig.tokenFileName || 'pocket_access_token'
  const accessTokenPath = `${homedir}/.config/${accessTokenFileName}`

  const readToken = async () => {
    const file = await fs.readFile(accessTokenPath)
    return file.toString()
  }

  return {

    accessTokenPath: accessTokenPath,

    get: async () => {
      return {access_token: await readToken()}
    }
  }

}

module.exports = auth
