import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const source = path.join(__dirname, ".githooks");
const destination = path.join(__dirname, ".git", "hooks");

fs.mkdirSync(destination, { recursive: true });

for (const name of fs.readdirSync(source)) {
  fs.cpSync(path.join(source, name), path.join(destination, name), {
    recursive: true,
  });
}