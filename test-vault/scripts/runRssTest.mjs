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

const feedname = path.basename(feedSource),
    fsAssets = path.join("../reference", feedname, "assets"),
    vaultAssets = `reference/${feedname}/assets`;

console.log(`Testing ${feedname}`);
const feedXML = fs.readFileSync(path.join(fsAssets, "feed.xml"), { encoding: "utf8" }).toString(),
      feed = new TrackedRSSfeed(feedXML, `${vaultAssets}/feed.xml`),
      actualJSON = JSON.parse(JSON.stringify(feed));

const expected = fs.readFileSync(path.join(fsAssets, "expected.json")),
      expectedJson = JSON.parse(expected);

let result = diff(feed,expectedJson);

console.log (`>>>>>>>> ${JSON.stringify(result)}`);
//console.log(diffString({ foo: 'bar' }, { foo: 'baz' }, { color: false }));
