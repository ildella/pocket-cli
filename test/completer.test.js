const completer = require('../src/cli/completer')

test('completer basic', () => {
  const completion = completer()
  console.log(completion)
})
