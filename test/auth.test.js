const fs = require('fs').promises
const auth = require('../src/auth')({tokenFilePath: 'test_token'})

beforeAll(async () => {
  await fs.unlink(auth.accessTokenPath)
})

test('auth exists', async () => {
  expect(auth.get()).toBeNull()
  const token = 'abcd1234'
  await fs.writeFile(auth.accessTokenPath, token)
  const json = auth.get()
  expect(json).toEqual({access_token: token})
})
