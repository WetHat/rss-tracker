
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { TrackedRSSfeed } from './FeedAssembler.mjs'

const usage = `USAGE:
node ${path.basename(process.argv[1])}  <feed url> | <test directory>

If a feed url is provided, a new test will be generated.
If a directory location is provided, an existing test will be updated.`;

if (process.argv.length < 3) {
    console.error(usage);
    process.exit(1);
}

const feedSource = process.argv[2];

let feed, testDir = null;

if (feedSource.includes("//")) {
    // download feed from the web.
    const feedXML = await fetch(feedSource)
        .then(response => response.text());

    feed = await TrackedRSSfeed.assembleFromUrl(feedXML,options);
    testDir = path.join("./",feed.title);
    fs.mkdir(testDir,{recursive: true}, err => console.error(err));
    fs.writeFileSync(path.join(testDir,"feed.xml"),feedXML,{encoding:"utf8"});
} else {
    testDir = feedSource;

    const feedXML =fs.readFileSync(path.join(testDir,"feed.xml"),{encoding:"utf8"}).toString();
    feed = TrackedRSSfeed.assembleFromXml(feedXML);
}

// update the feed. json
fs.writeFileSync(path.join(testDir,"expected.json"),JSON.stringify(feed,{encoding:"utf8"},4));

console.log(`${testDir} feed updated!`);

process.exit(0);