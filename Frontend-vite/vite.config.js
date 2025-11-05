import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      "/owners": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      "/users": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      "/products": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      "/addtocart": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      "/updatecart": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      "/removefromcart": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      "/cart": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
