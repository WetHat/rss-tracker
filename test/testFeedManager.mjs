import * as path from 'path';
import * as fs from 'fs';
import { globSync } from "glob";
import assert from "assert";
import { execFileSync } from "child_process";
import exp from 'constants';

describe('FeedAssembler ', function () {
    // collect all reference RSS feeds.
    const tests = globSync("./test-vault/reference/*/assets/feed.xml")
        .map(xmlPath => {
            const assets = path.dirname(xmlPath),
                feedName = path.basename(path.dirname(assets)),
                vaultXmlPath = `reference/${feedName}/assets/feed.xml`;
            return { args: [vaultXmlPath, feedName], expected: false };
        });
    // now run the tests
    for (let testData of tests) {
        const
            [vaultXmlPath, feedName] = testData.args,
            feedDir = `./test-vault/output/${feedName}`,
            feedDashboard = `${feedDir}.md`;
        describe(`RSS Feed ${feedName}`, function () {
            it(`"${feedName}" cleaned up`, async function () {
                // clear the output for that feed
                if (fs.existsSync(feedDir)) {
                    fs.rmSync(feedDir, { recursive: true, force: true });
                }
                if (fs.existsSync(feedDashboard)) {
                    fs.unlinkSync(feedDashboard);
                }
                assert.equal(fs.existsSync(feedDir) || fs.existsSync(feedDashboard), false);
                execFileSync("cmd", ["/C", "start", "/B", `obsidian://newRssFeed?xml=${encodeURIComponent(vaultXmlPath)}^&dir=output`]);
                await new Promise(resolve => setTimeout(resolve, 1500)); // give Obsidian some breathing room
            });

            it('test data available', function () {
                assert.equal(fs.existsSync(feedDir) && fs.existsSync(feedDashboard), true);
            });
            const
                actualFiles = globSync(feedDir + "/*.md").sort(),
                refFiles = globSync(`./test-vault/reference/${feedName}/*.md`).sort();
            it(`feed has  ${refFiles.length} items`, function () {
                assert.strictEqual(actualFiles.length, refFiles.length);
            });

            describe(`Items same as reference`, function () {
                const n = Math.min(actualFiles.length, refFiles.length);
                for (let i = 0; i < n; i++) {
                    const
                        actualFile = actualFiles[i],
                        refFile = refFiles[i],
                        actualName = path.basename(actualFile),
                        expectedName = path.basename(refFile);
                    it(`"${actualName}" same name as reference`, function () {
                        assert.equal(actualName, expectedName);
                    });

                    it(`"${actualName}" same content as reference`, function () {
                        // check contents
                        const
                            actualContent = fs.readFileSync(actualFile, { encoding: "utf8" }).toString(),
                            expectedContent = fs.readFileSync(refFile, { encoding: "utf8" }).toString();
                        assert.equal(actualContent, expectedContent);
                    })
                }
            });
        });
    }
});
