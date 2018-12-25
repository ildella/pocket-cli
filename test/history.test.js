const h = require('../src/history')('test')

test('init', () => {
  // expect(h.hasIndex(0)).toThrow()
  expect(h.hasIndex(1)).toBeFalsy()
  expect(h.size()).toBe(0)
})

test('add and get', () => {
  h.add({a: 1})
  expect(h.size()).toBe(1)
  // expect(h.hasIndex(0)).toBeTruthy()
  expect(h.hasIndex(1)).toBeTruthy()
  expect(h.hasIndex(2)).toBeFalsy()
  expect(h.get(1)).toEqual({a: 1})
  expect(h.get(1)).toEqual(h.last())
})

test('addAll', () => {
  h.addAll([{a: 1}, {a: 2}])
  expect(h.size()).toBe(2)
})
