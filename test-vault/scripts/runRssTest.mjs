import { diff } from "json-diff";
import * as path from 'path';
import { TrackedRSSfeed } from '../../test/scripts/FeedAssembler.mjs'
import * as fs from 'fs';
import {execFileSync} from "child_process";
import { globSync } from "glob";

const usage = `USAGE:
node ${path.basename(process.argv[1])} <test directory>

Test the reference of a parsed feed against the current version.`;

if (process.argv.length < 3) {
    console.error(usage);
    process.exit(1);
}


const feedSource = process.argv[2]; // url or relative directory path

// test assets and files
const feedname = path.basename(feedSource),
    rssFile =  path.join("../reference", feedname, "assets","feed.xml"),
    expectedFile = path.join("../reference", feedname, "assets","expected.json"),
    reportFile = path.join("../reports", `${feedname}.md`);

    if (fs.existsSync(reportFile)) {
        fs.rmSync(reportFile);
    }

console.log(`Testing ${feedname}`);
const feedXML = fs.readFileSync(rssFile, { encoding: "utf8" }),
      feed = new TrackedRSSfeed(feedXML, `reference/${feedname}/assets/feed.xml`);

const expectedJson = JSON.parse(fs.readFileSync(expectedFile));

let jsondiff = diff(expectedJson,feed);

let reportData = `
# Parsed JSON differences for ${feedname}

~~~json
${JSON.stringify(jsondiff, { encoding: "utf8" }, 4)}
~~~

`;

if (reportData.match(/"+"|"-"|"__old"|"_new"|"__added"|"__deleted"/)) {
    fs.writeFileSync(reportFile , reportData);
}


// clear old test output
// cleanupp the markdown files
const dashboard = path.join("..","output",`${feedname}.md`);
if (fs.existsSync(dashboard)) {
    fs.unlinkSync(dashboard);
}
globSync(`../output/${feedname}/*.md`).forEach(md => fs.unlinkSync(md));

// create the feed items
const xmlAsset = encodeURIComponent(`reference/${feedname}/assets/feed.xml`);

execFileSync("cmd",["/C","start",`obsidian://newRssFeed?xml=${xmlAsset}^&dir=output`]);
//console.log (JSON.stringify(result,{ encoding: "utf8" },4));

//console.log(diffString({ foo: 'bar' }, { foo: 'baz' }, { color: false }));
