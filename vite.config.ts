import { defineConfig } from 'vite';
import { handlebarsPrecompile } from 'vite-plugin-handlebars-precompile';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import * as path from 'path';

export default defineConfig({
    build: {
        target: 'es2022',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/'),
        }
    },
    plugins: [
        handlebarsPrecompile({
            partialsDir: path.resolve(__dirname, './src/shared/ui/Handlebars'),
        }),
        ViteImageOptimizer(),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://guidely.ru:8080',
                changeOrigin: true,
                secure: true,
            },

            '/uploads': {
                target: 'https://guidely.ru:8080',
                changeOrigin: true,
                secure: true,
            }
        }
    }
});
