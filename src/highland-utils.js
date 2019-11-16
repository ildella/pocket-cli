const highland = require('highland')
const {promisify} = require('util')

const wrapPromise = p => highland.wrapCallback(async (input, callback) => {
  try {
    const result = await p(input)
    callback(null, result)
  } catch(e) { callback(e) }
})

const empty = () => ({})
const accumulate = transform => input => ({...input, ...transform(input)})

highland.wrapPromise = wrapPromise

const waitCallback = (millisecs, cb) => {
  setTimeout(() => { cb() }, millisecs)
}

module.exports = {
  wrapPromise,
  highland,
  empty,
  accumulate,
  wait: promisify(waitCallback)
}
