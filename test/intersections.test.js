const {intersection, reverseIntersection} = require('../src/arrays-utils')

test('use intersection', () => {
  const inputs = ['bitcoin', 'unread']
  const reserved = ['unread', 'oldest']
  const found = intersection([reserved, inputs])
  expect(found).toEqual(['unread'])
})

test('use native some', () => {
  const inputs = ['bitcoin', 'unread']
  const reserved = ['unread', 'oldest']
  const found = reserved.some(r => inputs.includes(r))
  expect(found).toBe(true)
})

test('reverse intersection', () => {
  const inputs = ['bitcoin', 'unread', 'development', 'oldest']
  const reserved = ['unread', 'oldest', 'newest', 'favorite']
  const found = reverseIntersection([inputs, reserved])
  expect(found).toEqual(['bitcoin', 'development'])
})

test('reverse intersection for tags', () => {
  const inputs = ['1', '2', 'tag1', '4', 'tag2']
  const reserved = ['1', '2', '3', '4']
  const found = reverseIntersection([inputs, reserved])
  expect(found).toEqual(['tag1', 'tag2'])
})
