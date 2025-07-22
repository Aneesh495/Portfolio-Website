import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("framer-motion")) {
              return "ui-vendor";
            }
            if (id.includes("lucide-react")) {
              return "icons";
            }
            if (id.includes("@tanstack/react-query")) {
              return "query";
            }
            if (id.includes("wouter")) {
              return "router";
            }
            if (id.includes("@radix-ui")) {
              return "radix-ui";
            }
            return "vendor";
          }
          
          // Game chunks
          if (id.includes("components/games/")) {
            if (id.includes("tic-tac-toe") || id.includes("game-2048") || 
                id.includes("snake") || id.includes("rock-paper-scissors")) {
              return "games-core";
            }
            if (id.includes("chess") || id.includes("connect-four") || 
                id.includes("minesweeper")) {
              return "games-strategy";
            }
            if (id.includes("tetris") || id.includes("memory-match") || 
                id.includes("word-guess") || id.includes("word-hunt")) {
              return "games-puzzle";
            }
            if (id.includes("battleship") || id.includes("flappy-bird") || 
                id.includes("breakout") || id.includes("puzzle-platformer")) {
              return "games-action";
            }
          }
        },
      },
    },
    // Performance optimizations
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Reduce chunk size warning threshold
    chunkSizeWarningLimit: 300,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "@tanstack/react-query",
      "wouter"
    ],
  },
});
