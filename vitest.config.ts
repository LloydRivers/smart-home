import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Tells Vitest to look for test files in the src directory
    // that end with .test.ts or .spec.ts
    include: ['src/**/*.{test,spec}.ts'],

    // Sets up the test environment
    environment: 'node',

    // Ensures tests are isolated from each other
    globals: true,

    // Adds coverage reporting
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/'],
    },
  },
});
