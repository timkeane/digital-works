import * as fs from 'fs';

const npmPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = npmPackage.version.split('.');

version[0] = parseInt(version[0]);
version[1] = parseInt(version[1]);
version[2] = parseInt(version[2]);

version[2] = version[2] + 1;
if ((version[2]) === 10) {
  version[1] = version[1] + 1;
  version[2] = 0;
}

if ((version[1]) === 10) {
  version[0] = version[0] + 1;
  version[1] = 0;
}

const newVersion = `${version[0]}.${version[1]}.${version[2]}`;
npmPackage.version = newVersion;
fs.writeFileSync('./package.json', JSON.stringify(npmPackage, null, 2));

console.log(newVersion);