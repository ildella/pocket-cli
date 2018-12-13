const registry = require('axios').create({baseURL: 'https://registry.npmjs.org'})
const packageJson = require('../package.json')

test('', async () => {
  const response = await registry.get('/pocket-cli')
  expect(response.data['dist-tags'].latest).toBe('0.6.0')
  expect(packageJson.version).toBe('0.6.0')
})