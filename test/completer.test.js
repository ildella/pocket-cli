const completer = require('../src/cli/completer')

require('../src/cli/help')

test('empty requests returns nothing', () => {
  expect(completer()).toEqual([[], undefined])
  expect(completer('')).toEqual([[], ''])
})

test('completer basic', () => {
  expect(completer('he')).toEqual([['help'], 'he'])
})
