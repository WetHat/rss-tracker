
import * as fs from 'fs';
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
    referencePath = "./test-vault/reference";

async function generateFeedReferenceData(feed, feedName) {
    // cleanup the markdown files
    const
        fsFeedDir = "./test-vault/reference/" + feedName,
        fsFeedAssets = path.join(fsFeedDir, "/assets"),
        feedDashboard = fsFeedDir + ".md";

    if (fs.existsSync(feedDashboard)) {
        fs.unlinkSync(feedDashboard);
    }

    // clear out the markdown files, if any
    globSync(`${fsFeedDir}/*.md`).forEach(md => fs.unlinkSync(md));
    // update the feed. json
    fs.writeFileSync(path.join(fsFeedAssets, "expected.json"), JSON.stringify(feed, { encoding: "utf8" }, 4));

    // regenerate the feed markdown files
    const xmlAsset = encodeURIComponent(`reference/${feedName}/assets/feed.xml`);
    execFileSync("cmd", ["/C", "start", `obsidian://newRssFeed?xml=${xmlAsset}^&dir=reference`]);

    console.log(`Reference data for "${feedName}" updated!`)
    await new Promise(resolve => setTimeout(resolve,2000));
}

if (feedSource.includes("//")) {
    // download feed from the web.
    const
        feedXML = await fetch(feedSource)
            .then(response => response.text()),
        feed = new TrackedRSSfeed(feedXML, feedSource),
        feedName = feed.title,
        fsAssets = path.join(referencePath, feedName, "assets");
    console.log("Downloaded feed " + feedTitle);
    // pretend the feed came from the vault
    feed.source = `reference/${feedName}/assets/feed.xml`;

    fs.mkdirSync(fsAssets, { recursive: true });
    fs.writeFileSync(path.join(fsAssets, "feed.xml"), feedXML, { encoding: "utf8" });

    generateFeedReferenceData(feed, feedName);
    process.exit(0);
}

let feedSources;
if (feedSource === "--all") {
    feedSources = globSync(`${referencePath}/*/assets/feed.xml`);
    console.log(feedSources);
} else {
    feedSources = [path.join(feedSource, "assets/feed.xml")];
}

for (let source of feedSources) {
    const
        fsAssets = path.dirname(source),
        feedName = path.basename(path.dirname(fsAssets)),
        feedXML = fs.readFileSync(source, { encoding: "utf8" }).toString(),
        feed = new TrackedRSSfeed(feedXML, `reference/${feedName}/assets/feed.xml`);
    await generateFeedReferenceData(feed, feedName);
}

process.exit(0);