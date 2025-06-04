/** @type {import('jest').Config} */
module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    transform: {
      '^.+\\.(ts|mjs|js|html)$': ['ts-jest', {
        tsconfig: 'tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      }],
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverage: true,
    coverageReporters: ['html', 'text-summary'],
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  };
  