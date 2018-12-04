process.on('unhandledRejection', (reason, p) => { console.error(reason) })

describe('Actual pocket auth module', () => {

  const pocketAuth = require('../src/pocket-auth')

  it('pochet oauth complete', async () => {
    // pocketAuth.start()
  })

})
