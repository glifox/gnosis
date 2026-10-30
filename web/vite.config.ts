import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: [
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/language',
      '@codemirror/lang-markdown',
      '@lezer/common',
      '@lezer/highlight',
      '@lezer/markdown'
    ]
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        try: resolve(import.meta.dirname, 'pages/try/index.html'),
        try_redirect: resolve(import.meta.dirname, 'try/index.html')
      }
    }
  }
});
