import * as path from 'path';
import * as fs from 'fs';
import { glob, globSync } from "glob";
import assert from "assert";
import { execFileSync } from "child_process";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('FeedAssembler ', function () {
    // collect all reference RSS feeds.
    const tests = globSync("./test-vault/reference/*/assets/feed.xml")
        .map(xmlPath => {
            const assets = path.dirname(xmlPath),
                feedName = path.basename(path.dirname(assets)),
                vaultXmlPath = `reference/${feedName}/assets/feed.xml`;
            return { args: [vaultXmlPath, feedName], expected: false };
        });

    tests.forEach(({ args, expected }) => {
        const [vaultXmlPath, feedName] = args,
            feedDir = `./test-vault/output/${feedName}`,
            feedDashboard = `${feedDir}.md`;

        describe(`RSS Feed ${feedName}`, function () {
            it(`cleaned up old files for ${feedName}`, function () {
                // clear the output for that feed
                if (fs.existsSync(feedDir)) {
                    fs.rmSync(feedDir, { recursive: true, force: true });
                }
                if (fs.existsSync(feedDashboard)) {
                    fs.unlinkSync(feedDashboard);
                }
                assert.equal(fs.existsSync(feedDir) || fs.existsSync(feedDashboard), false);
            });
            it(`created new feed ${feedName}`, async function () {
                // generate new feed markdown
                execFileSync("cmd", ["/C", "start", "/B", `obsidian://newRssFeed?xml=${encodeURIComponent(vaultXmlPath)}^&dir=output`]);
                await sleep(1500);
                assert.equal(fs.existsSync(feedDir) && fs.existsSync(feedDashboard), true);
            });
            const feedFiles = globSync(feedDir+"/*.md").sort(),
                refFiles = globSync(`./test-vault/reference/${feedName}/*.md`).sort();

            it(`${feedName} has the correct number of items`, function () {
                assert.strictEqual(feedFiles.length,refFiles.length);
            });
            describe(`Items of ${feedName} same as reference`, function () {
                const n = Math.min(feedFiles.length,refFiles.length);
                for (let i = 0; i < n; i++) {
                    const actualName = path.basename(feedFiles[i]),
                    expected = path.basename(refFiles[i]);
                    it(`"${actualName}" same as reference`, function () {
                        assert.equal(actualName,expected);
                    })
                }
            });
        });
    });
});