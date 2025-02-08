import {defineConfig} from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/jest/index.ts',
    'src/playwright/index.ts',
    'src/vitest/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
})
