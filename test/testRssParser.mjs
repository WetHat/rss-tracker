import { diff } from "json-diff";
import * as path from 'path';
import { TrackedRSSfeed } from './scripts/FeedAssembler.mjs'
import * as fs from 'fs';
import { globSync } from "glob";
import assert from "assert";

describe('Parse RSS', function () {
    const tests = globSync("./test-vault/reference/*/assets/feed.xml")
        .map(xmlPath => ({ args: [xmlPath], expected: false }));

    tests.forEach(({ args, expected }) => {
        const [xmlPath] = args,
            assets = path.dirname(xmlPath),
            feedName = path.basename(path.dirname(assets)),
            source = `reference/${feedName}/assets/feed.xml`;
        it(`source ${source}`, function () {
            const expectedPath = path.join(assets, "expected.json"),
                expectedJson = JSON.parse(fs.readFileSync(expectedPath)),
                reportFile = path.join("./test-vault/reports", `${feedName} Assembler.md`);
            // get rid of old report
            if (fs.existsSync(reportFile)) {
                fs.rmSync(reportFile);
            }
            // parse the feed
            const feedXml = fs.readFileSync(xmlPath, { encoding: "utf8" }),
                actual = new TrackedRSSfeed(feedXml, source),
                jsondiff = diff(expectedJson, JSON.parse(JSON.stringify(actual,{ encoding: "utf8" }, 4)));

        let reportData = `
# JSON differences for ${feedName}

~~~json
${JSON.stringify(jsondiff, { encoding: "utf8" }, 4)}
~~~`;

            if (reportData.match(/"+"|"-"|"__old"|"_new"|"__added"|"__deleted"/)) {
                fs.writeFileSync(reportFile, reportData);
            }
            assert.equal(fs.existsSync(reportFile) ? `${reportFile} does not exist`: false, expected);
        });
    });
});
