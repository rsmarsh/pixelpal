module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx|jsx)?$',
  transform: {
    '\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    Components: '<rootDir>/src/components/',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/src/fileMock.js',
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.js'
  }
};
