import fs from 'fs-extra'
import { join } from 'path';

// Build distribution folder and

// remove templates
const templates = "./dist/Templates";
if (fs.existsSync(templates)) {
    fs.rmSync(templates,{recursive: true});
}

// copy remaining plugin files.
console.log("Copying assets...");
[
    "manifest.json",
    "styles.css",
].forEach(f => {
    const target = join("./dist", f);
    console.log(`${f} => ${target}`);
    fs.copySync(f, target); // overwrites existing files
});


// configure test code
console.log("Configuring regression tests...");
const
    fromPath = "./test/scripts/FeedAssembler.js",
    toPath = "./test/scripts/FeedAssembler.mjs";

try {
    fs.renameSync(fromPath,toPath); // overwites file existing at toPath
    console.log("src/FeedAssembler.ts => test/scripts/FeedAssembler.mjs");
} catch (err) {
    console.error(err);
    process.exit(1);
}

process.exit(0);