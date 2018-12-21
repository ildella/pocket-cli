const templates = require('../src/templates')

test('load help from file', () => {
  const template = 'Hello ${this.name}!'
  const vars = {
    name: 'world'
  }
  expect(templates(template, vars)).toBe('Hello world!')
})
