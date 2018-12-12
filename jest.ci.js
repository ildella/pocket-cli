module.exports = {
  verbose: false,
  notify: false,
  testEnvironment: 'node',
  testMatch: ['**/test/**/?(*.)+(spec|test).js?(x)'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html', 'json-summary']
}

