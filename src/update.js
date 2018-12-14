const registry = require('axios').create({baseURL: 'https://registry.npmjs.org'})
const packageJson = require('../package.json')
const semver = require('semver')

const update = {

  lastVersion: async () => {
    const response = await registry.get('/pocket-cli')
    return response.data['dist-tags'].latest
  },

  check: async version => {
    const lastVersion = await update.lastVersion()
    const actual = version || packageJson.version
    const need = semver.lt(actual, lastVersion)
    return {
      need: need,
      actual: actual,
      last: lastVersion
    }
  }

}
module.exports = update
