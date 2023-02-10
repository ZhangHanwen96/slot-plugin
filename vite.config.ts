import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {createHtmlPlugin} from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    server: {
      cors: true,
      port: 3000
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    
  }
})
