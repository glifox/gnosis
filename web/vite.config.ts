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
  optimizeDeps: {
    // Crucial: Evita que Vite pre-compile tu paquete enlazado y rompa las referencias
    // exclude: ['@glifox/gnosis']
  },
  // server: {
    // fs: {
      // allow: ['..']
    // }
  // }
});