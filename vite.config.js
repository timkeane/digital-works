import {defineConfig, splitVendorChunkPlugin} from 'vite';
import {visualizer} from 'rollup-plugin-visualizer';
import cp from 'vite-plugin-cp';
import dotenv from 'dotenv';

const env = process.env;

// dotenv.config();
// dotenv.config({override: true, path: `.env.${env.APP_ENV}`});

const outDir = './dist';
const appPath = env.VITE_APP_PATH;
const sourcemap = env.APP_ENV === 'dev';
const minify = env.APP_ENV === 'dev' ? undefined : 'terser';

const config = {
  base: '',
  server: {
    host: true,
  },
  build: {
    outDir,
    sourcemap,
    minify
  },
  plugins: [
    splitVendorChunkPlugin(),
    visualizer(),
    cp({
      targets: [
        {src: 'img/*.*', dest: `./dist/img/`},
        {src: `./data/*`, dest: './dist/data'},
        {src: `./img/${appPath}`, dest: `./dist/img/${appPath}`}
      ]
    })
  ],
  test: {
    setupFiles: ['/__tests__/setup.js'],
    environment: 'jsdom'
  }
};

console.info('Vite config:', {outDir, appPath, sourcemap, minify});
console.info('Vite config:', JSON.stringify(config, null, 2));

export default defineConfig(config);
