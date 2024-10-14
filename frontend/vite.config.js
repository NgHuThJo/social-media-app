import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@frontend": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@publicAssets": path.resolve(__dirname, "public"),
    },
  },
});
