
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { TrackedRSSfeed } from '../../test/scripts/FeedAssembler.mjs'
import {execFileSync} from "child_process";
import { globSync } from "glob";
const usage = `USAGE:
node ${path.basename(process.argv[1])}  <feed url> | <test directory>

If a feed url is provided, a new test will be generated.
If a directory location is provided, an existing test will be updated.`;

if (process.argv.length < 3) {
    console.error(usage);
    process.exit(1);
}

const feedSource = process.argv[2]; // url or relative directory path

let feed, fsAssets, vaultAssets, feedName = null;

if (feedSource.includes("//")) {
    // download feed from the web.
    const feedXML = await fetch(feedSource)
        .then(response => response.text());

    feed = new TrackedRSSfeed(feedXML, feedSource);
    feedName = feed.title;
    console.log("Downloaded feed " + feedSource);
    fsAssets = path.join("../reference", feedName, "assets");
    vaultAssets = `reference/${feedName}/assets`;
    feed.source = `${vaultAssets}/feed.xml`;

    console.log("Creating reference data at: " + fsAssets);
    fs.mkdirSync(fsAssets, { recursive: true });
    fs.writeFileSync(path.join(fsAssets, "feed.xml"), feedXML, { encoding: "utf8" });
} else {
    feedName = path.basename(feedSource);
    fsAssets = path.join("../reference", feedName, "assets");
    vaultAssets = `reference/${feedName}/assets`;

    console.log(`Updating ${feedName}`);
    const feedXML = fs.readFileSync(path.join(fsAssets, "feed.xml"), { encoding: "utf8" });
    feed = new TrackedRSSfeed(feedXML, `${vaultAssets}/feed.xml`);
}

// update the feed. json
fs.writeFileSync(path.join(fsAssets, "expected.json"), JSON.stringify(feed, { encoding: "utf8" }, 4));

// cleanupp the markdown files
const dashboard = path.join("..","reference",`${feedName}.md`);
if (fs.existsSync(dashboard)) {
    fs.unlinkSync(dashboard);
}
globSync(`../reference/${feedName}/*.md`).forEach(md => fs.unlinkSync(md));

// regenerate the feed markdown files
const xmlAsset = encodeURIComponent(`${vaultAssets}/feed.xml`);

execFileSync("cmd",["/C","start",`obsidian://newRssFeed?xml=${xmlAsset}^&dir=reference`]);

console.log(`${vaultAssets} feed updated!`);

process.exit(0);