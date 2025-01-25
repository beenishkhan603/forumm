const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^pages/?(.*)$': '<rootDir>/pages/$1',
    '^@libs/(.*)$': '<rootDir>/libs/$1',
    '^@layouts/(.*)$': '<rootDir>/layouts/$1',
    '^@graphql/(.*)$': '<rootDir>/graphql/$1',
    '^.+\\.(svg)$': '<rootDir>/__mocks__/svgMock.tsx',
    '^__mocks__/(.*)$': '<rootDir>/__mocks__/$1',
    '^uuid$': 'uuid',
    'react-chartjs-2': '<rootDir>/__mocks__/react-chartjs-2.tsx',
    'chart.js': '<rootDir>/__mocks__/chart-js.tsx',
    'react-markdown':
      '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
