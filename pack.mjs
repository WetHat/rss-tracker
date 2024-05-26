import { copyFileSync, accessSync, constants, renameSync } from 'fs'
import { join } from 'path';

// copy assets
console.log("Copying assets...");
[
    "manifest.json",
    "styles.css"
].forEach(f => {
    const target = join("./dist", f);
    console.log(`${f} => ${target}`);
    copyFileSync(f, target);
});

// configure test code
console.log("Configuring regression tests...");
try {
    accessSync("./test-vault/scripts/FeedAssembler.js", constants.F_OK);
} catch (err) {
    process.exit(0);
}

try {
    renameSync("./test-vault/scripts/FeedAssembler.js", "./test-vault/scripts/FeedAssembler.mjs");
    console.log("src/FeedAssembler.ts => test-vault/scripts/FeedAssembler.mjs");
} catch (err) {
    console.error(err);
    process.exit(1);
}

process.exit(0);