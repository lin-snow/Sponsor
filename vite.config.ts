import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Static sponsor site → dist/. The `@` alias points at src/ so modules can be
// imported as `@/...` regardless of nesting.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
});
