const getValue = index => {
  const values = ['\\', '|', '/', '|']
  return new Promise(resolve=>{
    setTimeout(()=>resolve(values[index]), 250)
  })
}

const asyncGenerator = async function* () {
  let index = 0
  while(true) {
    index++
    const value = await getValue(index % 4)
    yield value
  }
}

const loader = {

  loading: false,

  stop: () => {
    loader.loading = false
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
