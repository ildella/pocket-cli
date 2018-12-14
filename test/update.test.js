const update = require('../src/update')

test('last version', async () => {
  const response = await update.lastVersion()
  expect(response).toBe('0.6.0')
})

test('check', async () => {
  const response = await update.check()
  expect(response.need).toBe(false)
})

test('mock check', async () => {
  const response = await update.check('0.4.2')
  expect(response.need).toBeTruthy()
  expect(response.actual).toBe('0.4.2')
})
