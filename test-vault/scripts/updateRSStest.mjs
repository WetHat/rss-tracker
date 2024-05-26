
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { TrackedRSSfeed } from '../../test/FeedAssembler.mjs'

const usage = `USAGE:
node ${path.basename(process.argv[1])}  <feed url> | <test directory>

If a feed url is provided, a new test will be generated.
If a directory location is provided, an existing test will be updated.`;

if (process.argv.length < 3) {
    console.error(usage);
    process.exit(1);
}

const feedSource = process.argv[2]; // url or relative directory path

let feed, assetsFs, assetsVault = null;

if (feedSource.includes("//")) {
    // download feed from the web.
    const feedXML = await fetch(feedSource)
        .then(response => response.text());

    feed = new TrackedRSSfeed(feedXML, feedSource);
    const feedname = feed.title;
    assetsFs = path.join("../reference", feedname, "assets");
    assetsVault = `reference/${feedname}/assets`;

    console.log("Creating reference data: " + assetsVault);
    fs.mkdir(assetsFs, { recursive: true }, err => console.error(err));
    feed.source = `${assetsVault}/feed.xml`;
    fs.writeFileSync(path.join(assetsFs, "feed.xml"), feedXML, { encoding: "utf8" });
} else {
    const feedname = path.basename(feedSource);
    assetsFs = path.join("../reference", feedname, "assets");
    assetsVault = `reference/${feedname}/assets`;

    console.log(`Updating ${feedname}`);
    const feedXML = fs.readFileSync(path.join(assetsFs, "feed.xml"), { encoding: "utf8" }).toString();
    feed = new TrackedRSSfeed(feedXML, `${assetsVault}/feed.xml`);
}

// update the feed. json
fs.writeFileSync(path.join(assetsFs, "expected.json"), JSON.stringify(feed, { encoding: "utf8" }, 4));

console.log(`${assetsVault} feed updated!`);

process.exit(0);