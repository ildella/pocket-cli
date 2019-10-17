const defaultJestConfig = require('./jest.config')
module.exports = {
  ...defaultJestConfig,
  collectCoverage: true,
  //TODO: super-shame...
  coverageThreshold: {
    global: {branches: 30, functions: 30, lines: 30, statements: 30}
  },

}
