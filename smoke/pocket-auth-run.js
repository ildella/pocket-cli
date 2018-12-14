require('dotenv').config()

const start = async () => {
  const pocketAuth = require('../src/pocket/pocket-auth')
  await pocketAuth()
}

start()
