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
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "router": ["wouter"],
          "query": ["@tanstack/react-query"],
          "ui-vendor": ["framer-motion"],
          "icons": ["lucide-react"],
          // Game chunks - split by category
          "games-core": [
            "./src/components/games/tic-tac-toe.tsx",
            "./src/components/games/game-2048.tsx",
            "./src/components/games/snake.tsx",
            "./src/components/games/rock-paper-scissors.tsx"
          ],
          "games-strategy": [
            "./src/components/games/chess.tsx",
            "./src/components/games/connect-four.tsx",
            "./src/components/games/minesweeper.tsx"
          ],
          "games-puzzle": [
            "./src/components/games/tetris.tsx",
            "./src/components/games/memory-match.tsx",
            "./src/components/games/word-guess.tsx",
            "./src/components/games/word-hunt.tsx"
          ],
          "games-action": [
            "./src/components/games/battleship.tsx",
            "./src/components/games/flappy-bird.tsx",
            "./src/components/games/breakout.tsx",
            "./src/components/games/puzzle-platformer.tsx"
          ]
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
