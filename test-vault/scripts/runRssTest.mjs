import { diffString, diff } from "json-diff";
import * as path from 'path';
import { TrackedRSSfeed } from './FeedAssembler.mjs'
import * as fs from 'fs';


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

let jsondiff = diff(feed,expectedJson);

let reportData = `
# Test Results for ${feedname}

~~~json
${JSON.stringify(jsondiff, { encoding: "utf8" }, 4)}
~~~

`;

if (reportData.match(/"+"|"-"|"__old"|"_new"/)) {
    fs.writeFileSync(reportFile , reportData);
}

//console.log (JSON.stringify(result,{ encoding: "utf8" },4));

//console.log(diffString({ foo: 'bar' }, { foo: 'baz' }, { color: false }));
