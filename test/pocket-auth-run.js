#!/usr/bin/env node
require('dotenv').config()

const start = async () => {
  const pocket = require('../src/pocket-auth')
  await pocket.start()
}

start()
