import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'fs';

// Plugin to copy classic (non-module) scripts to dist
function copyStaticScripts() {
  return {
    name: 'copy-static-scripts',
    closeBundle() {
      const files = ['support.js', 'image-slot.js'];
      mkdirSync('dist', { recursive: true });
      files.forEach(f => copyFileSync(f, `dist/${f}`));
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'uploads',
  plugins: [copyStaticScripts()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        collection: 'collection/index.html',
        sold: 'sold/index.html',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://adg-merengue-vault.vercel.app',
        changeOrigin: true,
      },
    },
  },
});
