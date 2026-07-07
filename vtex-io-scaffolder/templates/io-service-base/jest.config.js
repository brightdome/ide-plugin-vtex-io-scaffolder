module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/node'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '<rootDir>/node/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/node/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/node/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  collectCoverageFrom: [
    '<rootDir>/node/**/*.{ts,tsx}',
    '!<rootDir>/node/**/*.d.ts',
    '!<rootDir>/node/**/__tests__/**',
    '!<rootDir>/node/**/*.spec.{ts,tsx}',
    '!<rootDir>/node/**/*.test.{ts,tsx}',
    '!<rootDir>/node/index.ts',
    // VTEX IO HTTP clients are thin SDK wrappers; services mock them in unit
    // tests instead of covering client boilerplate here.
    '!<rootDir>/node/clients/**',
    '!<rootDir>/node/middlewares/index.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  verbose: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/middlewares/__tests__/mocks/',
    '/middlewares/__tests__/types/',
  ],
}
