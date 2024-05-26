/**
 * Install the Obsidian extension to a testing vault
 */
import * as path from "path";
import * as fs from "fs";

let manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

const targetDir = path.join("test-vault", ".obsidian", "plugins", manifest["id"]);
if (!fs.existsSync(targetDir)) {
    console.warn(`Creating targetDir directory:  ${targetDir}`);
	fs.mkdirSync(targetDir);
}

// install in vault
fs.readdirSync("./dist").forEach(f => {
	console.log(`${f} -> ${targetDir}`)
	fs.copyFileSync(path.join("./dist",f),path.join(targetDir,f));
})

process.exit(0);