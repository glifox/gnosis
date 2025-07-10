import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outputDir: 'dist/types',
      insertTypesEntry: true,
    })
  ],
  build: {
    lib: {
      entry: 'src/exports.ts',
      name: 'gnosis',
      fileName: 'gnosis',
      formats: ['umd', 'es'],
    },
    rollupOptions: {
      external: [
        "@codemirror/lang-markdown",
        "@codemirror/language",
        "@codemirror/language-data",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/markdown",
        "codemirror"
      ],
      output: {
        globals: {
            gnosis: 'gnosis'
        }
      }
    }
  },
});