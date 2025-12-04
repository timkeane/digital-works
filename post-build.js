import replace from 'replace-in-file';
import dotenv from 'dotenv';
import * as fs from 'fs';

const env = process.env;
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

dotenv.config();
dotenv.config({override: true, path: `.env.${env.APP_ENV}`});

const npmPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const webmanifest = JSON.parse(fs.readFileSync(`./dist/${env.VITE_APP_PATH}.webmanifest`));
webmanifest.start_url = env.VITE_APP_URL;

fs.writeFileSync(`./dist/${env.VITE_APP_PATH}.webmanifest`, JSON.stringify(webmanifest, null, 2))

replace({
  files: './dist/*.webmanifest',
  from: new RegExp(env.LOCAL_URL, 'g'),
  to: env.VITE_APP_URL
});

await sleep(500);

const now = (new Date()).toLocaleString();

replace({
  files: './dist/index.html',
  from: new RegExp(/__PACKAGE_VERSION__/),
  to: `${npmPackage.version} (${now})`
});

console.log(`
${npmPackage.name} ${npmPackage.version} ${env.APP_ENV} build completed ${now}
`);
