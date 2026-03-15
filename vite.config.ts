import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mockUsersPlugin } from "./vite-plugin-mock-users";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), mockUsersPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@presentation": path.resolve(__dirname, "./src/presentation"),
    },
  },
});
