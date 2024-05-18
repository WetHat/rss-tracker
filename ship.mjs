/**
 * Install the Obsidian extension to a testing vault
 */
import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";

let manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

// Determine the deployment location in the obsidian vault
// configured in .env
const env = dotenv.config();
const VAULT = env.parsed.VAULT;
if (!VAULT || VAULT.trim().length === 0) {
	console.error("VAULT undefined! Set VAULT in `.env`.");
	process.exit(1);
}

const targetDir = path.join(VAULT, ".obsidian", "plugins", manifest["id"]);
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