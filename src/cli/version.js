const commands = require('./menu').commands

const pjson = require('../../package.json')

const output = []
output.push(`${pjson.name} ${pjson.version} - ${pjson.description}`)

const parse = params => {
  return {
    name: 'version',
    execute: () => { return {lines: output} }
  }
}

commands['version'] = {
  name: 'version',
  aliases: ['v'],
  description: 'Pocket CLI version',
  parse: parse
}
