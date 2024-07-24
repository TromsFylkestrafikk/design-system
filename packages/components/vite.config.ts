import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { dependencies } from './package.json';

export default defineConfig({
  plugins: [dts({
    include: ['./src/**/*'],
  })],
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'components',
      formats: ['es'],
    },
    rollupOptions: {
      external: Object.keys(dependencies),
      output: {
        globals: {
          '@shoelace-style/localize': '@shoelace-style/localize',
          '@shoelace-style/shoelace': '@shoelace-style/shoelace',
          '@tfk-samf/tokens': '@tfk-samf/tokens',
        },
      },
    },
  },
});
