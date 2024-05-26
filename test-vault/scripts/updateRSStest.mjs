
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { TrackedRSSfeed } from '../../test/FeedAssembler.mjs'
import open from "open";

const usage = `USAGE:
node ${path.basename(process.argv[1])}  <feed url> | <test directory>

If a feed url is provided, a new test will be generated.
If a directory location is provided, an existing test will be updated.`;

if (process.argv.length < 3) {
    console.error(usage);
    process.exit(1);
}

const feedSource = process.argv[2]; // url or relative directory path

let feed, fsAssets, vaultAssets = null;

if (feedSource.includes("//")) {
    // download feed from the web.
    const feedXML = await fetch(feedSource)
        .then(response => response.text());

    feed = new TrackedRSSfeed(feedXML, feedSource);
    const feedname = feed.title;
    console.log("Downloaded feed " + feedSource);
    fsAssets = path.join("../reference", feedname, "assets");
    vaultAssets = `reference/${feedname}/assets`;
    feed.source = `${vaultAssets}/feed.xml`;

    console.log("Creating reference data at: " + fsAssets);
    fs.mkdirSync(fsAssets, { recursive: true });
    fs.writeFileSync(path.join(fsAssets, "feed.xml"), feedXML, { encoding: "utf8" });
} else {
    const feedname = path.basename(feedSource);
    fsAssets = path.join("../reference", feedname, "assets");
    vaultAssets = `reference/${feedname}/assets`;

    console.log(`Updating ${feedname}`);
    const feedXML = fs.readFileSync(path.join(fsAssets, "feed.xml"), { encoding: "utf8" }).toString();
    feed = new TrackedRSSfeed(feedXML, `${vaultAssets}/feed.xml`);
}

// update the feed. json
fs.writeFileSync(path.join(fsAssets, "expected.json"), JSON.stringify(feed, { encoding: "utf8" }, 4));
await open("https://x.com");

console.log(`${vaultAssets} feed updated!`);

process.exit(0);