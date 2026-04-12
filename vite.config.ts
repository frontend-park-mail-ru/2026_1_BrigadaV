import { defineConfig } from 'vite';
import { handlebarsPrecompile } from 'vite-plugin-handlebars-precompile';
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
    ],
});
