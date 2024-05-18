import {copyFileSync,accessSync,constants,renameSync} from 'fs'
import {join } from 'path';
import {execSync} from "child_process";
import { stderr } from 'process';

// copy assets
console.log("Copying assets...");
[
    "manifest.json",
    "styles.css"
].forEach(f => {
    const target = join("./dist",f);
    console.log(`${f} => ${target}`);
    copyFileSync(f,target);
});

// configure test code
console.log("Configuring regression tests...");
try {
    accessSync("./test/FeedAssembler.js", constants.F_OK);
} catch (err) {
    process.exit(0);
}

try {
    renameSync("./test/FeedAssembler.js", "./test/FeedAssembler.mjs");
    console.log("src/FeedAssembler.ts => test/FeedAssembler.mjs");
} catch (err) {
    console.error(err);
    process.exit(1);
}

process.exit(0);