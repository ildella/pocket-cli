const axios = require('axios')
const url = 'https://raw.githubusercontent.com/ildella/pocket-cli/master/GUIDE.md'

const commands = require('./interpreter').commands

const parse = () => {
  return {
    name: 'guide',
    execute: async () => {
      const response = await axios(url)
      console.log(response.data)
      return {lines: []}
    }
  }
}

commands['guide'] = {
  name: 'guide',
  aliases: [],
  description: 'Print this guide',
  parse: parse
}
