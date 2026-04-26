import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AraviUIVue',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.js' : 'index.cjs',
    },
    rollupOptions: {
      external: ['vue', '@aravi1008/ui', '@aravi1008/ui/components'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
    sourcemap: true,
    minify: false,
  },
});
