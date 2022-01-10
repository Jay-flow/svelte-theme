import {defineConfig} from 'vite';
import execute from "rollup-plugin-execute";
import pkg from './package.json';
import preprocess from 'svelte-preprocess';
import {svelte} from '@sveltejs/vite-plugin-svelte';

const production = process.env.NODE_ENV === 'production';
const name = pkg.name
.replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
.replace(/^\w/, (m) => m.toUpperCase())
.replace(/-\w/g, (m) => m[1].toUpperCase());


export default defineConfig({
  clearScreen: false,
  build: {
    outDir: './lib',
    rollupOptions: {
      input: "src/index.ts",
      inlineDynamicImports: true,
      output: [
        {
          // file: pkg.module,
          format: "es",
          sourcemap: true,
        },
        {
          // file: pkg.main,
          format: "umd",
          name,
          sourcemap: true,
          plugins: [
            // we only want to run this once, so we'll just make it part of this output's plugins
            execute([
              "tsc --outDir ./lib --declaration",
              "node src/preprocess.js",
            ]),
          ],
        },
      ],
      external: Object.keys(pkg.dependencies),
    }
  },
  plugins: [
    svelte({
      emitCss: false,
      compilerOptions: {
        generate: 'ssr'
      },
      extensions: ['.svelte'],
      preprocess: preprocess({
        postcss: true,
        sourceMap: true,
      }),
    }),
  ],
});