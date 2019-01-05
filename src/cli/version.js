const commands = require('./menu').commands

const pjson = require('../../package.json')

const output = []
output.push(`${pjson.name} ${pjson.version} - ${pjson.description}`)

const parse = () => {
  return {
    name: 'version',
    execute: () => { return {lines: output} }
  }
}

commands['version'] = {
  name: 'version',
  aliases: ['v'],
  description: 'Print application version',
  parse: parse
}
