import {defineConfig, splitVendorChunkPlugin} from 'vite';
import {visualizer} from 'rollup-plugin-visualizer';
import cp from 'vite-plugin-cp';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({override: true, path: `.env.${process.env.APP_ENV}`});

const state = process.env.VITE_APP_PATH;

export default defineConfig({
  base: '',
  server: {
    host: true,
  },
  build: {
    outDir: './dist',
    minify: 'terser'
  },
  plugins: [
    splitVendorChunkPlugin(),
    visualizer(),
    cp({
      targets: [
        {src: 'img/*.*', dest: `./dist/img/`},
        {src: `./data/*.*`, dest: './dist/data'},
        {src: `./img/${state}`, dest: `./dist/img/${state}`}
      ]
    })
  ],
  test: {
    setupFiles: ['/__tests__/setup.js'],
    environment: 'jsdom'
  }
});
