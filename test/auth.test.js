const fs = require('fs').promises
const auth = require('../src/auth')({tokenFileName: 'test_pocket_token'})

beforeEach(async () => {
  await fs.unlink(auth.accessTokenPath)
})

test('auth exists', async () => {
  const token = 'abcd1234'
  await fs.writeFile(auth.accessTokenPath, token)
  const json = await auth.get()
  expect(json).toEqual({access_token: token})
})

test('auth does not exists', async () => {
  const json = await auth.get()
  expect(json).toEqual({access_token: ''})
})
