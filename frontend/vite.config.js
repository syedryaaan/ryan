import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configure Vite build tool with React plugin and backend proxy
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
