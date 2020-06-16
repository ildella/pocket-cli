const open = require('../src/cli/open')
test('open per platform', () => {
  expect(open.get('linux')).toBe('xdg-open')
  expect(open.get('darwin')).toBe('open')
  // expect(open.get()).toBe('xdg-open')
})
