const interpreter = require('../src/cli/interpreter')
require('../src/pocket/pocket-commands')
require('../src/cli/version')
require('../src/cli/quit')
require('../src/cli/help')

test('read from pocket API', async () => {
  const output = await interpreter.processInput('bitcoin')
  expect(output.lines).toHaveLength(12)
  await interpreter.processInput('n')
})

test('modify with pocket API - archive/readd', async () => {
  await interpreter.processInput('bitcoin')
  const output = await interpreter.processInput('a 2')
  expect(output.lines).toEqual(['success'])
})

test('multiple archive', async () => {
  await interpreter.processInput('bitcoin')
  const output = await interpreter.processInput('a 2 3')
  expect(output.lines).toEqual(['success,success'])
})

test('archive and readd', async () => {
  const list = await interpreter.processInput('bitcoin')
  // expect(list.lines[2]).toContain('2.  (A)')
  const output = await interpreter.processInput('2')
  expect(output.lines).toContain('4. Re-add')
})
