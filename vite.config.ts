import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin.default({
      languageWorkers: ['editorWorkerService', 'typescript', 'json', 'css', 'html'],
    }),
  ],
  optimizeDeps: {
    include: ['monaco-editor', 'zustand', 'immer', 'nanoid'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('monaco-editor')) return 'monaco';
        },
      },
    },
  },
});
