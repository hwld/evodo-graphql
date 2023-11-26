import type { Config } from 'jest';

const config: Config = {
  transform: { '^.+\\.ts': 'babel-jest' },
  setupFilesAfterEnv: ['<rootDir>/src/test/jest-setup.ts'],
};

module.exports = config;
