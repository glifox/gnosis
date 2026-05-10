import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/lib.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
  },
});
