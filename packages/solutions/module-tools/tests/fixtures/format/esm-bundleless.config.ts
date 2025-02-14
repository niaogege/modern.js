import { defineConfig } from '@modern-js/self/defineConfig';

export default defineConfig({
  buildConfig: {
    buildType: 'bundleless',
    sourceType: 'commonjs',
    format: 'esm',
    target: 'es5',
    outDir: './dist/bundleless',
  },
});
