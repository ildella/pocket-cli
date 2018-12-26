const local1 = require('../src/local-articles')
const local2 = require('../src/local-articles')

test('ensure they are the same', () => {
  expect(local1).toBe(local2)
})

test('one more small test makes no harm..', () => {
  const item2 = {a: 2}
  local1.store([{a: 1}, item2])
  expect(local2.get(2)).toEqual(item2)
  expect(local2.get(2)).not.toBe(item2)
})
