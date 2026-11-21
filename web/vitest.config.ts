import { defineConfig } from 'vitest/config';

// Coverage (@vitest/coverage-v8) is not installed; add it to enable coverage reports.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
