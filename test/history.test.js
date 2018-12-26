const history = require('../src/history')

test('not same', () => {
  const h1 = history('test')
  const h2 = history('h2')
  expect(h1).not.toBe(h2)
})

test('separated', () => {
  const h1 = history('h1')
  const h2 = history('h2')
  h1.add(1)
  expect(h1.size()).toBe(1)
  expect(h2.size()).toBe(0)
})

test('init', () => {
  const h = history('h')
  expect(h.size()).toBe(0)
  expect(() => { h.last() }).toThrow()
  expect(() => { h.hasIndex(0) }).toThrow()
  expect(h.hasIndex(1)).toBeFalsy()
})

test('add and get', () => {
  const h = history('h')
  h.add({a: 1})
  expect(h.size()).toBe(1)
  // expect(h.hasIndex(0)).toBeTruthy()
  expect(h.hasIndex(1)).toBeTruthy()
  expect(h.hasIndex(2)).toBeFalsy()
  expect(h.get(1)).toEqual({a: 1})
  expect(h.get(1)).toEqual(h.last())
})

test('addAll', () => {
  const h = history('h')
  h.addAll([{a: 1}, {a: 2}])
  expect(h.size()).toBe(2)
  expect(h.last()).toEqual({a: 2})
})

