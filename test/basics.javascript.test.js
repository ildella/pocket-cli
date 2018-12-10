test('this', () => {
  // console.log(this)
  const o = {
    prop: 'value',
    run: () => {
      // console.log(this)
      expect(o.prop).toBe('value')
    }
  }
  o.run()
})

test('array shift', () => {
  const a = [1, 2, 3]
  const b = a.shift()
  expect(a).toEqual([2, 3])
  expect(b).toEqual(1)
})

test('object assign with null and undefined', () => {
  expect(Object.assign({a: 1}, null)).toEqual({a: 1})
  expect(Object.assign({a: 1}, undefined)).toEqual({a: 1})
})

const events = require('events')
class CustomEmitter extends events {}

test('Event Emitter', () => {

  const channel1 = new CustomEmitter()
  const channel2 = new CustomEmitter()

  channel1.once('newListener', params => {
    console.log('newListener event ->', params)
  })
  channel1.on('eventz', params => {
    console.log('channel1: an event occurred ->', params)
  })
  channel2.on('eventz', params => {
    console.log('channel2: an event occurred ->', params)
  })
  channel1.emit('eventz', ['something', 'dark', 'side'])
})

test('Event Errors', () => {
  const channel1 = new CustomEmitter()
  channel1.on('error', error => {
    console.error('e1: an error occurred ->', error)
  })
  channel1.emit('error', new Error('whoops!'))
})

test('different event types', () => {

  const channel1 = new CustomEmitter()

  channel1.on('message', params => {
    console.log('message received ->', params)
  })
  channel1.emit('message', 'hey there')
})
