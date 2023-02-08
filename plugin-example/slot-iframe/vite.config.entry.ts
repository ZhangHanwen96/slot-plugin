import { defineConfig, splitVendorChunk, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import cssInject from 'vite-plugin-css-injected-by-js';
import { chunk } from "lodash";

const importCss =  (path: string): PluginOption => {
    return {
        name: 'import-css',
        apply: 'build',
        enforce: 'post',
        generateBundle(options, bundle) {
            const cssAssets = Object.keys(bundle).filter(
                (i) => bundle[i].type == 'chunk' && bundle[i].fileName.endsWith('.js')
            );
            console.log(bundle[cssAssets[0]])
        },
        
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        cssInject(),
        // importCss('')
    ],
    build: {
        lib: {
            entry: "src/entry/Component.tsx",
            fileName: "index",
            formats: ["es"],
        },
        minify: 'terser',
        terserOptions: {
            module: true
        },
        rollupOptions: {
            output: {
                manualChunks: splitVendorChunk(),
                assetFileNames: '[name]-[hash].[ext]',  
            },

            external: ['react', 'react-dom']
        },
        emptyOutDir: true,
    },
    define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
    },
});
