import {execFileSync} from "child_process";
import fs from 'fs-extra';

const targetDir = "D:/Obsidian Vaults/Sandbox/.obsidian/plugins/rss-tracker";
fs.copySync("./dist", targetDir);

execFileSync("cmd",["/C","start","obsidian://open?vault=Sandbox^&file=%C2%A7%20About%20this%20Vault"]);