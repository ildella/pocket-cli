const values = ['\\', '|', '/', '|']

const getValue = index => {
  return new Promise(resolve=>{
    setTimeout(()=>resolve(values[index]), 250)
  })
}

const asyncGenerator = async function* () {
  let index = 0
  while(true) {
    index++
    const value = await getValue(index % values.length)
    yield value
  }
}

const loader = {

  loading: false,

  stop: () => {
    loader.loading = false
    process.stdout.clearLine()
  },

  start: async () => {
    loader.loading = true
    for await (const v of asyncGenerator()) {
      if (loader.loading) {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(v)
      } else {
        break
      }
    }
  }
}

module.exports = loader
