import fs from 'fs-extra'
import { join } from 'path';

// remove templates
const templates = "./dist/Templates";
if (fs.existsSync(templates)) {
    fs.rmSync(templates,{recursive: true});
}

// copy assets
console.log("Copying assets...");
[
    "manifest.json",
    "styles.css",
].forEach(f => {
    const target = join("./dist", f);
    console.log(`${f} => ${target}`);
    fs.copySync(f, target);
});


// configure test code
console.log("Configuring regression tests...");
try {
    fs.exists("./test/scripts/FeedAssembler.js");
} catch (err) {
    process.exit(0);
}

try {
    fs.renameSync("./test/scripts/FeedAssembler.js", "./test/scripts/FeedAssembler.mjs");
    console.log("src/FeedAssembler.ts => test/scripts/FeedAssembler.mjs");
} catch (err) {
    console.error(err);
    process.exit(1);
}

process.exit(0);