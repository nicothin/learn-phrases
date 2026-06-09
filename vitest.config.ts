import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['@testing-library/jest-dom/vitest'],
      coverage: {
        provider: 'v8',
        reporter: ['text'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.*',
          'src/**/*.spec.*',
          'src/**/__tests__/**',
          'src/main.tsx',
          'src/App.tsx',
          'src/**/index.ts',
          'src/shared/components/Icon/icons/**',
          'src/shared/layouts/**',
          'src/pages/About/About.tsx',
          'src/pages/PageNotFound/PageNotFound.tsx',
        ],
      },
    },
  }),
);
