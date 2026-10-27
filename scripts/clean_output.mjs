import fs from "node:fs";
import path from "node:path";

const output = path.resolve("_site");
if (path.basename(output) !== "_site" || path.dirname(output) !== process.cwd()) {
  throw new Error(`Refusing to clean unexpected output path: ${output}`);
}
fs.rmSync(output, { recursive: true, force: true });
