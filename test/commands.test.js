const {commands} = require('../src/cli/menu')
const interpreter = require('../src/cli/interpreter')
require('../src/cli/quit')
require('../src/cli/version')
require('../src/cli/update')
require('../src/cli/help')

const isFunction = x => {
  return typeof x === 'function'
}

const isAsyncFunction = f => {
  return f[Symbol.toStringTag] === 'AsyncFunction'
}

test('call commands query', async () => {
  const query = commands.quit.parse()
  expect(query.name).toEqual('quit')
  expect(isFunction(query.execute)).toBeTruthy()
  expect(isAsyncFunction(query.execute)).toBeFalsy()
})

test('help', async () => {
  expect(interpreter('quit').command).toBe(commands.quit)
  expect(interpreter('help').command).toBe(commands.help)
  expect(interpreter('version').command).toBe(commands.version)
  expect(interpreter('update').command).toBe(commands.update)
})

