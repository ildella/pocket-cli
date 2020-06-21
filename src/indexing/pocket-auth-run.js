require('dotenv').config()

const start = async () => {
  const pocketAuth = require('../src/pocket/simple-server')
  await pocketAuth()
}

start()
