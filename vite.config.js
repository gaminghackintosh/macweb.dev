import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/hackintosh.web/" : "/",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  build: {
    // Code splitting для лучшей производительности
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Включение sourcemaps для отладки
    sourcemap: false,
    // Минимизация бандла
    minify: 'esbuild',
    // Ограничение размера чанка
    chunkSizeWarningLimit: 500,
  },
  // Оптимизация зависимостей
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));

