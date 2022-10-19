import { JsonGenerator } from "../bin/JsonGenerator.js";

const result = await JsonGenerator.convertToHTML(`
## テスト 


ただのパラグラフ

:::note
ノート
:::

:::note{.warn}
ノート
:::

:::note warn
ノート
:::

:::    note warn
ノート
:::

`);

console.log(result);
