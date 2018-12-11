require('dotenv').config()

const start = async () => {
  const pocket = require('../src/pocket/pocket-auth')
  await pocket.start()
}

start()
