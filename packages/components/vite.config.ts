import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

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
      external: [
        'vuetify',
        'vue',
        '@tfk-samf/tokens',
      ],
    },
  },
});
