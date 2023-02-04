import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
        entry: 'src/pureFn/index.ts',
        // name: 'pureFn',
        fileName: 'index',
        formats: ['es'],
    },
    // outDir: 'pureFn'
  }
})
