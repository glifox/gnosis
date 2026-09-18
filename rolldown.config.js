import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

const isProduction = process.env.NODE_ENV === 'production';

const external = [
  /^@codemirror\//,
  /^@lezer\//,
  '@feraxjs/themes-codemirror',
  '@chenglou/pretext',
  'codemirror',
];

export default defineConfig([
  // Build configuration for JavaScript files (ESM and CJS)
  {
    input: "src/lib.ts",
    external,
    platform: "browser",
    output: [
      {
        dir: "dist",
        format: "esm",
        sourcemap: true,
        minify: isProduction,
        entryFileNames: "gnosis.mjs",
        chunkFileNames: "[name]-[hash].mjs"
      },
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
        minify: isProduction,
        entryFileNames: "gnosis.cjs",
        chunkFileNames: "[name]-[hash].cjs"
      }
    ]
  },
  // Separate build configuration for TypeScript declarations (.d.ts)
  {
    input: "src/lib.ts",
    external,
    plugins: [dts()],
    output: {
      dir: "dist",
      format: "esm",
      entryFileNames: "gnosis.d.ts"
    }
  }
]);