const commands = require('../src/cli/interpreter').commands

const isFunction = x => {
  return typeof x === 'function'
}

const isAsyncFunction = f => {
  return f[Symbol.toStringTag] === 'AsyncFunction'
}

test('call commands query', async () => {
  const query = await commands.quit.parse()
  expect(query.name).toEqual('quit')
  expect(isFunction(query.execute)).toBeTruthy()
  expect(isAsyncFunction(query.execute)).toBeFalsy()
})
