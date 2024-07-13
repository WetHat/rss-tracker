import { diff } from "json-diff";
import * as path from 'path';
import { TrackedRSSfeed } from './scripts/FeedAssembler.mjs'
import fs from 'fs-extra';
import { globSync } from "glob";
import assert from "assert";

/**
 * A dynamic test to collect all `feed.xml` files found in `test-vault/reference`,
 * parse them, and compare them with reference data in `expected.json`
 */
describe('Test FeedAssembler ', function () {
    // collect all reference RSS feeds.
    const tests = globSync("./test-vault/RSS/reference/*/assets/feed.xml")
        .map(xmlPath => ({ args: [xmlPath], expected: false }));

    // Run the parsing test for each reference RSS feed.
    tests.forEach(({ args, expected }) => {
        // setup some paths and names relevant to the test
        const [xmlPath] = args,
            assets = path.dirname(xmlPath), // location where we find other assets
            feedName = path.basename(path.dirname(assets)), // directory name is the feed name
            reportFile = path.join("./test-vault/reports", `${feedName} Assembler.md`);
        // run the test
        it(`parsing "${feedName}"`, function () {
            // get the reference data
            const
                expectedPath = path.join(assets, "expected.json"),
                expectedJson = JSON.parse(fs.readFileSync(expectedPath));

            // get rid of old report
            if (fs.existsSync(reportFile)) {
                fs.rmSync(reportFile);
            }

            // parse the feed
            const
                feedXml = fs.readFileSync(xmlPath, { encoding: "utf8" }),
                actual = new TrackedRSSfeed(feedXml, expectedJson.source),
                // we have to stringify and reparse the TrackedRSSfeed instance to avoid
                // false positives in diff.
                jsondiff = diff(expectedJson, JSON.parse(JSON.stringify(actual, { encoding: "utf8" }, 4)));
            // generate report if needed.
            let reportData = `
# JSON differences for ${feedName}

~~~json
${JSON.stringify(jsondiff, { encoding: "utf8" }, 4)}
~~~`;
            if (reportData.match(/"+"|"-"|"__old"|"_new"|"__added"|"__deleted"/)) {
                fs.writeFileSync(reportFile, reportData);
            }
            // assert that there is no report.
            assert.equal(fs.existsSync(reportFile) ? `${reportFile} does not exist` : false, expected);
        });
    });
});
