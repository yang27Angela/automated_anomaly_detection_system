export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!**/__tests__/**',
      '!**/node_modules/**'
    ],
  };
  