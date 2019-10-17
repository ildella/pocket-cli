module.exports = {
  verbose: false,
  notify: false,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)(spec|test).js?(x)'],
  collectCoverage: false,
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/node_modules/**',
  ],
  //TODO: shame...
  coverageThreshold: {
    global: {branches: 50, functions: 50, lines: 50, statements: 50}
  },
  coverageReporters: ['text', 'text-summary', 'json', 'json-summary', 'lcov', 'clover', 'html'],
}
