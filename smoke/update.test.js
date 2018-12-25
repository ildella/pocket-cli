const update = require('../src/npm-update')

test('last version', async () => {
  const response = await update.lastVersion()
  expect(response).toBeDefined()
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

test('mock check 2', async () => {
  const response = await update.check('0.25.0-pre')
  expect(response.need).toBeFalsy()
  expect(response.actual).toBe('0.25.0-pre')
})
