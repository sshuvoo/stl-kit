import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts', '!src/__test__'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'lib',
  target: 'esnext',
  platform: 'neutral',
  bundle: true,
  skipNodeModulesBundle: true,
  silent: true,
  treeshake: true,
  minify: true,
  splitting: true,
  keepNames: true,
})
