import replace from 'replace-in-file';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();
dotenv.config({override: true, path: `.env.${process.env.APP_ENV}`});

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

const json = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

replace({
  files: './dist/assets/*.webmanifest',
  from: new RegExp(process.env.LOCAL_URL, 'g'),
  to: process.env.VITE_APP_URL
});

await sleep(500);

const now = (new Date()).toLocaleString();

replace({
  files: './dist/index.html',
  from: new RegExp(/__PACKAGE_VERSION__/),
  to: `${json.version} (${now})`
});

console.log(`
${json.version} ${process.env.APP_ENV} build completed ${now}
`);
