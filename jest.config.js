module.exports = {
  verbose: false,
  notify: false,
  notifyMode: 'failure-change, success-change',
  testEnvironment: 'node',
  testMatch: ['**/test*/*.test.js'],
  testPathIgnorePatterns: ['/node_modules'],
  // setupFilesAfterEnv: ['./tests/test-helpers.js'],
  collectCoverage: false,
  collectCoverageFrom: [
    '**/src/*.{js,jsx}',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'text-summary', 'json', 'json-summary', 'lcov', 'clover', 'html'],
}
