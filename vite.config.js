import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/exports.js',
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