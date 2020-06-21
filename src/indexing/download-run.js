require('dotenv').config()

const start = async () => {
  const pocketDownload = require('../src/pocket/download')
  await pocketDownload()
}

start()
