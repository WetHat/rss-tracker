
import fs from 'fs-extra';
import * as path from 'path';
import fetch from 'node-fetch';
import { TrackedRSSfeed } from './FeedAssembler.mjs'
import { execFileSync } from "child_process";
import { globSync } from "glob";

const usage = `USAGE:
node ${path.basename(process.argv[1])}  <feed url> | <feed reference folder | --all

<feed url> - the rss feed pointed to by this url will be downloaded
             an a new test reference data will be generated
<feed reference folder - path to feed data in the test-vault/reference folder.
             The expected.json wile will be re-creaded from feed.xml and the
             feed markdown files will be updated
--all - all feed reference data will be updated
If a feed url is provided, a new test will be generated.`;

if (process.argv.length < 3) {
    console.error(usage);
    process.exit(1);
}

const
    feedSource = process.argv[2], // url or relative directory path or --all
    referencePath = "./test-vault/RSS/reference";

async function generateFeedReference(feed) {

    // cleanup the markdown files
    const
        feedName = feed.fileName,
        fsFeedDir = "./test-vault/RSS/reference/" + feedName,
        feedDashboard = fsFeedDir + ".md";

    if (fs.existsSync(feedDashboard)) {
        fs.unlinkSync(feedDashboard);
    }

    // clear out the markdown files, if any
    console.log(`cleaning up ${fsFeedDir}/*.md`);
    globSync(`${fsFeedDir}/*.md`).forEach(md => fs.rmSync(md));

    // regenerate the feed markdown files
    const xmlAsset = encodeURIComponent(`RSS/reference/${feedName}/assets/feed.xml`);
    execFileSync("cmd", ["/C", "start", `obsidian://newRssFeed?xml=${xmlAsset}^&dir=RSS%2Freference`]);

    await new Promise(resolve => setTimeout(resolve,2000));
    console.log(`Reference data for "${feedName}" updated!`)
}

if (feedSource.includes("//")) {
    // download feed from the web.
    const
        feedXML = await fetch(feedSource)
            .then(response => response.text()),
        feed = new TrackedRSSfeed(feedXML, feedSource),
        feedName = feed.fileName,
        fsAssets = path.join(referencePath, feedName, "assets");
    console.log("Downloaded feed " + feedName);

    fs.mkdirSync(fsAssets, { recursive: true });
    fs.writeFileSync(path.join(fsAssets, "feed.xml"), feedXML, { encoding: "utf8" });
    // update the feed. json
    fs.writeFileSync(path.join(fsAssets, "expected.json"), JSON.stringify(feed, { encoding: "utf8" }, 4));
    generateFeedReference(feed);
    process.exit(0);
}

let feeds;
if (feedSource === "--all") {
    feeds = globSync(`${referencePath}/*/assets/feed.xml`);
    console.log(feeds);
} else {
    feeds = [path.join(feedSource, "assets/feed.xml")];
}

for (let feedXml of feeds) {
    const
        fsAssets = path.dirname(feedXml),
        expectedJsonPath = path.join(fsAssets, "expected.json"),
        source = JSON.parse(fs.readFileSync(expectedJsonPath)).source,
        feedXML = fs.readFileSync(feedXml, { encoding: "utf8" }).toString(),
        feed = new TrackedRSSfeed(feedXML, source);
    fs.writeFileSync(expectedJsonPath, JSON.stringify(feed, { encoding: "utf8" }, 4));
    await generateFeedReference(feed);
}

process.exit(0);