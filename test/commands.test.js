const commands = require('../src/cli/interpreter').commands
require('../src/cli/quit')

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
