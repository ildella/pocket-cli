const fs = require('fs').promises
const auth = require('../src/auth')({tokenFilePath: 'test_token'})

afterAll(async () => {
  try {
    await fs.unlink(auth.accessTokenPath)
  } catch(e) {
    console.log('there is nothing bad about this...')
  }
})

test('auth exists', async () => {
  expect(auth.get()).toBeNull()
  const token = 'abcd1234'
  await fs.writeFile(auth.accessTokenPath, token)
  const json = auth.get()
  expect(json).toEqual({access_token: token})
})
