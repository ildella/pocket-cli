const lunr = require('lunr')
const fs = require('fs')
const fsp = fs.promises

const start = async () => {
  const start = Date.now()
  const data = await fsp.readFile('index-lunr')
  const parsed = JSON.parse(data)
  console.log(parsed)
  const idx = lunr.Index.load(parsed)
  console.log(idx.search('Ayana'))
  console.log(Date.now() - start)
}

start()
