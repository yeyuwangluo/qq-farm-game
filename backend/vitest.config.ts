import { defineConfig } from 'vitest/config';
import tsx from 'tsx';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  esbuild: {
    loader: 'tsx',
  },
});