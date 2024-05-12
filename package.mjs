import {copyFileSync} from 'fs'
import {join } from 'path';
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

process.exit(0);