module.exports = {
  verbose: false,
  notify: false,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/test-helpers.js'],
  testMatch: ['**/test/?(*.)(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules', 'parts/*'],
  collectCoverage: false,
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/parts/**',
  ],
  // TODO: shame...
  coverageThreshold: {
    global: {branches: 50, functions: 50, lines: 50, statements: 50}
  },
  coverageReporters: ['text', 'text-summary', 'json', 'json-summary', 'lcov', 'clover', 'html'],
}
