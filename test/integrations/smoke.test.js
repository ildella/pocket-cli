const processor = require('../../src/cli/process-input')
require('../../src/pocket/pocket-commands')
require('../../src/cli/version')
require('../../src/cli/quit')
require('../../src/cli/help')

test('read from pocket API', async () => {
  const output = await processor.processInput('bitcoin')
  expect(output.lines).toHaveLength(12)
  await processor.processInput('n')
})

test('modify with pocket API - archive/readd', async () => {
  await processor.processInput('bitcoin')
  const output = await processor.processInput('a 2')
  expect(output.lines).toEqual(['success'])
})

test('multiple archive', async () => {
  await processor.processInput('bitcoin')
  const output = await processor.processInput('a 2 3')
  expect(output.lines).toEqual(['success,success'])
})

// test('archive and readd', async () => {
// const list = await processor.processInput('bitcoin')
// expect(list.lines[1]).toContain('2.  (A)')
// const output = await processor.processInput('2')
// expect(output.lines).toContain('4. Readd')
// })
