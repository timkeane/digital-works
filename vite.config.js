import {defineConfig, splitVendorChunkPlugin} from 'vite';
import {visualizer} from 'rollup-plugin-visualizer';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env;

dotenv.config();
dotenv.config({override: true, path: `.env.${env.APP_ENV}`});

const isDebug = env.APP_ENV === 'dev';
const outDir = './dist';
const sourcemap = isDebug === 'dev';
const minify = isDebug ? undefined : 'terser';
const appPath = env.VITE_APP_PATH;

// use non-minified popaparse when APP_ENV=dev
const papaparse = path.resolve('node_modules/papaparse/papaparse.js');
const alias = isDebug ? {papaparse} : {};

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
  resolve: {
    alias
  },

  plugins: [
    splitVendorChunkPlugin(),
    visualizer()
  ],
  test: {
    setupFiles: ['/__tests__/setup.js'],
    environment: 'jsdom'
  }
};

// console.info('Vite config:', {outDir, appPath, sourcemap, minify});
// console.info('Vite config:', JSON.stringify(config, null, 2));

export default defineConfig(config);
