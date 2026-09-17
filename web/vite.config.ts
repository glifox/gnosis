import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: [
      "@codemirror/state",
      "@codemirror/view",
      "codemirror"
    ]
  }
});
