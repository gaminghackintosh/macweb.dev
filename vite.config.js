import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/hackintosh.web/" : "/",
  plugins: [react({
    // SWC быстрее Babel
    devTarget: 'esnext',
    tsDecorators: true,
    // Оптимизации для production
    loose: true,
  })],
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
          icons: ['react-icons'],
          // ✅ Выделяем каждое приложение в отдельный чанк
          finder: ['./src/features/finder/Finder/FinderContent'],
          safari: ['./src/features/safari/Safari/SafariContent'],
          notes: ['./src/features/notes/Notes/NotesContent'],
          terminal: ['./src/features/terminal/Terminal/Terminal'],
          music: ['./src/features/music/MusicApp/MusicContent'],
          settings: ['./src/features/settings/Settings/SettingsContent'],
        },
        // Оптимизация чанков
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      treeshake: true,
      moduleContext: {},
    },
    // Отключение sourcemaps для production
    sourcemap: false,
    // Минимизация бандла
    minify: 'esbuild',
    // Ограничение размера чанка
    chunkSizeWarningLimit: 1000, // Увеличили для lazy chunks
    // Оптимизация для production
    target: 'esnext',
    cssMinify: true,
    // Сжатие изображений
    assetsInlineLimit: 4096,
  },
  // Оптимизация зависимостей
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-icons'],
    force: false,
    exclude: [],
  },
  // Server оптимизации
  server: {
    open: false,
    hmr: {
      overlay: false,
    },
    watch: {
      usePolling: false,
    },
  },
  // Production оптимизации
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    minifyIdentifiers: mode === 'production',
    minifySyntax: true,
    minifyWhitespace: mode === 'production',
  },
  // Оптимизация resolver
  resolve: {
    alias: {
      '@': '/src',
      '@core': '/src/core',
      '@features': '/src/features',
      '@ui': '/src/ui',
      '@windows': '/src/windows',
      '@styles': '/src/styles',
      '@assets': '/src/assets',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@components': '/src/components',
    },
  },
  // ✅ Предзагрузка для критичных зависимостей
  preview: {
    port: 4173,
    headers: {
      // Security headers для production
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    },
  },
}));

