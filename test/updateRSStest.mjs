
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import * as Parser from './TrackedFeed.mjs';
//import * as Parser from 'rss-parser';

console.log(Parser.default);
const usage = `USAGE:
node ${path.basename(process.argv[1])}  <feed url> | <test directory>

If a feed url is provided, a new test will be generated.
If a directory location is provided, an existing test will be updated.`;

if (process.argv.length < 3) {
    console.error(usage);
    process.exit(1);
}

const feedSource = process.argv[2];

const rssParser = new Parser.default({
    customFields: {
        item: [
            "media:group",
            "media:thumbnail",
            "media:description"
        ],
        feed: [
        ]}
});

//console.log(rssParser);
//process.exit(1);

let feed,testDir = null;

if (feedSource.includes("//")) {
    // download feed from the web.
    const feedXML = await fetch(feedSource)
        .then(response => response.text());

    feed = await rssParser.parseString(feedXML);
    testDir = path.join("./",feed.title);
    fs.mkdir(testDir,{recursive: true}, err => console.error(err));
    fs.writeFileSync(path.join(testDir,"feed.xml"),feedXML,{encoding:"utf8"});
} else {
    testDir = feedSource;

    const feedXML =fs.readFileSync(path.join(testDir,"feed.xml"));
    feed = await rssParser.parseString(feedXML);
}

// update the feed. json
fs.writeFileSync(path.join(testDir,"expected.json"),JSON.stringify(feed,{encoding:"utf8"},4));

console.log(`${testDir} feed updated!`);

process.exit(0);