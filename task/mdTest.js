import { JsonGenerator } from "../bin/JsonGenerator.js";

//language=markdown
const result = await JsonGenerator.convertToHTML(`

:::note{.warn}
ノート
:::

:::    note warn
ノート
:::

http://google.com

https://github.com/MasatoMakino/threejs-shader-materials#getting-started

<https://github.com/MasatoMakino/minimal-test-environment-jest-pixijs>

https://www.amazon.co.jp/%E4%BA%BA%E9%96%93%E5%B7%A5%E5%AD%A6%E3%81%AB%E5%9F%BA%E3%81%A5%E3%81%84%E3%81%9F-%E8%B6%B3%E7%BD%AE%E3%81%8D%E5%8F%B0-EVA%E9%9D%A2-%E9%87%91%E5%B1%9E%E8%A3%BD%E3%83%95%E3%83%83%E3%83%88%E3%83%9A%E3%83%80%E3%83%AB-40x25x9-5cm/dp/B0936TMLYY/?_encoding=UTF8&content-id=amzn1.sym.79ec8dbb-a6ed-4b2c-b8a2-e2dc98848cba&ref_=pd_gw_ci_mcx_mr_hp_atf_m

ただのパラグラフに<canvas>を追加

\`\`\`js
<code>
\`\`\`

ただのパラグラフにcodeで括って\`<canvas></canvas>\`を追加

> jsdom includes support for using the canvas package to extend any <canvas> elements with the canvas API. To make this work, you need to include canvas as a dependency in your project, as a peer of jsdom.\n> jsdomには、canvasパッケージを使用して任意の<canvas>要素をcanvas APIで拡張するためのサポートが含まれています。これを動作させるには、jsdom のピアとして、プロジェクトに canvas を依存関係として含める必要があります。\n

`);

console.log(result);
