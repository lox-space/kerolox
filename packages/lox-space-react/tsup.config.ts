import { defineConfig } from "tsup";

export default defineConfig({
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
