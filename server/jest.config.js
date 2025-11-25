module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'middleware/**/*.js',
    'db/**/*.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
