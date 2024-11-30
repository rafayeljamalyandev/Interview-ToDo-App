import { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './', 
  testEnvironment: 'node', 
  testMatch: ['<rootDir>/test/**/*.spec.ts'], 
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest', 
  },
  collectCoverage: true, 
  coverageDirectory: './coverage', 
  coverageProvider: 'v8', 
  moduleDirectories: ['node_modules', 'src'], 
};

export default config;
