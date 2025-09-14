
import { defineConfig } from 'vitest/config';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
          exclude: [
            'node_modules/**',
            'dist/**',
            '.next/**',
            '**/*.stories.{js,ts,tsx}',
            '**/*.config.{js,ts}',
            '.storybook/**'
          ],
          globals: true,
          setupFiles: ['./src/test-utils/setup.ts'],
          typecheck: {
            enabled: false,
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
          }
        }
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/test-utils/**',
        '**/*.d.ts',
        '**/*.stories.{js,ts,tsx}',
        '**/*.config.{js,ts}',
        '.storybook/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
});
