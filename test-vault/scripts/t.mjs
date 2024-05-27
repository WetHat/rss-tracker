import {exec,execFileSync} from "child_process";
import {globSync} from "glob";

const files = globSync("../reference/Azimuth/*.md");
console.log(files);