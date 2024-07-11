/**
 * Install the Obsidian extension to a testing vault
 */
import * as path from "path";
import fs from "fs-extra";

let manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
const targetDir = path.join("test-vault", ".obsidian", "plugins", manifest["id"]);
console.log(`./dist ==> ${targetDir}`);

// remove templates
const templates = `${targetDir}/Templates`;
if (fs.existsSync(templates)) {
    fs.rmSync(templates, {recursive: true});
}

// install in vault
fs.copySync("./dist",targetDir);

process.exit(0);