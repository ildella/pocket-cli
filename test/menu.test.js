test('same instance', () => {
  const menu1 = require('../src/cli/menu')
  const menu2 = require('../src/cli/menu')
  expect(menu1).toBe(menu2)
})

test('change', () => {
  const menu1 = require('../src/cli/menu')
  const menu2 = require('../src/cli/menu')
  menu1.change({a: {a: 1}})
  menu2.change({a: {a: 2}})
  expect(menu1.get('a')).toEqual({a: 2})
  expect(menu2.get('a')).toEqual({a: 2})
})
