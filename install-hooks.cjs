const fs = require('node:fs');
const path = require('node:path');

const source = path.join(__dirname, '.githooks');
const destination = path.join(__dirname, '.git', 'hooks');

fs.mkdirSync(destination, { recursive: true });

for (const name of fs.readdirSync(source)) {
  fs.cpSync(path.join(source, name), path.join(destination, name), {
    recursive: true,
  });
}