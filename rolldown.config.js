import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts'

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  input: "src/lib.ts",
  external: [
    '@feraxjs/themes-codemirror',
    '@chenglou/pretext',
    '@codemirror/lang-markdown',
    '@codemirror/language',
    '@codemirror/language-data',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/markdown',
    'codemirror',
  ],
  plugins: [dts()],
  platform: "browser",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
    minify: isProduction,
    entryFileNames: ({ name, isEntry }) => {
      return name.replace("lib", "gnosis") + (isEntry ? ".js": ".ts")
    }
  },
});
