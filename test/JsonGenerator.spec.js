import test from "node:test";
import assert from "node:assert";
import { JsonGenerator } from "../bin/index.js";

test("convertToHTML", async () => {
  await test("#title should be h tag", async () => {
    const result = await JsonGenerator.convertToHTML("## title");
    assert.strictEqual(result, "<h2>title</h2>");
  });

  await test("list should be li tag", async () => {
    const result = await JsonGenerator.convertToHTML("- list");
    assert.strictEqual(result, "<ul>\n<li>list</li>\n</ul>");
  });

  await test("paragraph should be p tag", async () => {
    const result = await JsonGenerator.convertToHTML("just a paragraph");
    assert.strictEqual(result, "<p>just a paragraph</p>");
  });

  await test("note should be div tag with note class", async () => {
    const result = await JsonGenerator.convertToHTML(`:::note\nnote\n:::`);
    assert.strictEqual(result, `<div class="note">note</div>`);
  });

  await test("note and warn should be div tag with note and warn class", async () => {
    const result = await JsonGenerator.convertToHTML(
      `:::note warn\nノート\n:::`,
    );
    assert.strictEqual(result, `<div class="note warn">ノート</div>`);
  });

  // await test("note and list", async () => {
  //   const result = await JsonGenerator.convertToHTML(
  //     `:::note\n- リスト\n:::`,
  //   );
  //   assert.strictEqual(result, `<div class="note"><ul><li>リスト</li></ul></div>`);
  // });
});
