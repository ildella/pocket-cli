const commands = require('./menu').commands

const pjson = require('../../package.json')

const output = []
output.push(`${pjson.name} ${pjson.version} - ${pjson.description}`)

const parse = () => ({
  name: 'version',
  execute: () => ({lines: output})
})

commands['version'] = {
  name: 'version',
  aliases: ['v'],
  description: 'Print application version',
  parse: parse
}
