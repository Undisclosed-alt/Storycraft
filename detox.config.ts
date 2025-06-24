import { DetoxConfig } from 'detox';

const config: DetoxConfig = {
  testRunner: 'jest',
  runnerConfig: 'e2e/jest.config.js',
  configurations: {
    'ios.sim': {
      type: 'ios.simulator',
      device: { type: 'iPhone 14' },
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/app.app',
    },
  },
};

export default config;
