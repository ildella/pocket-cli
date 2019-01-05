const {commands} = require('./menu')

const completer = line => {
  const completions = Object.keys(commands)
  const hits = completions.filter(c => c.startsWith(line))
  return [hits.length ? hits : completions, line]
}

module.exports = completer
