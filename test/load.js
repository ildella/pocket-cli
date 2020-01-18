const lunr = require('lunr')
const fs = require('fs')
const fsp = fs.promises

const start = async () => {
  const start = Date.now()
  const data = await fsp.readFile('index-lunr')
  const idx = lunr.Index.load(JSON.parse(data))
  console.log(idx.search(''))
  console.log(Date.now() - start)
}

start()
