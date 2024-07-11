import {execFileSync} from "child_process";
import fs from 'fs-extra';

const
    targetDir = "C:/Users/Peter/OneDrive/Documents/ObsidianVaults/Sandbox/.obsidian/plugins/rss-tracker",
    templates = targetDir + "/Templates";

if (fs.existsSync(templates)) {
    fs.rmSync(templates,{recursive: true});
}

fs.copySync("./dist", targetDir);

execFileSync("cmd",["/C","start","obsidian://open?vault=Sandbox^&file=%C2%A7%20About%20this%20Vault"]);