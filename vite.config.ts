import { defineConfig } from 'vite';
import { handlebarsPrecompile } from 'vite-plugin-handlebars-precompile';
import * as path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/'),
        }
    },
    plugins: [
        handlebarsPrecompile(),
    ],
});
