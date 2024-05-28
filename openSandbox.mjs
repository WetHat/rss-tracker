import {execFileSync} from "child_process";
import { copyFileSync } from 'fs';

copyFileSync("dist/main.js","C:\\Users\\Peter\\OneDrive\\Documents\\ObsidianVaults\\Sandbox\\.obsidian\\plugins\\rss-tracker\\main.js");
execFileSync("cmd",["/C","start","obsidian://open?vault=Sandbox^&file=%C2%A7%20About%20this%20Vault"]);