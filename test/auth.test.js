const fs = require('fs')
const auth = require('../src/auth')({tokenFileName: 'test_pocket_token'})

beforeEach(() => {
  fs.unlinkSync(auth.accessTokenPath)
})

test('auth exists', () => {
  expect(() => {
    auth.get()
  }).toThrow('ENOENT')

  const token = 'abcd1234'
  fs.writeFileSync(auth.accessTokenPath, token)
  const json = auth.get()
  expect(json).toEqual({access_token: token})
})
