const defaultJestConfig = require('./jest.config')
module.exports = {
  ...defaultJestConfig,
  testMatch: ['**/test/**/?(*.)+(spec|test).js?(x)'],
  collectCoverage: true,
  //TODO: shame...
  coverageThreshold: {
    global: {branches: 30, functions: 30, lines: 30, statements: 30}
  },

}
