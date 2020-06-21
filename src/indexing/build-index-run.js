const wc = require('../src/pocket/wc')
const build = require('../src/pocket/build-index')

const path = '/home/ildella/.config/pocketcli/localdb'

const run = async () => {
  const total = await wc.lines(path)
  console.log(`Found ${total} documents in localdb`)
  const result = await build.load(path, {total: total})
  console.log(result)
}

run()

