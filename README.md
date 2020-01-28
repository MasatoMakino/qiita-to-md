# qiita-to-md
Markdown generator from qiita.com

## Getting Started

### Install

```bash
npm install https://github.com/MasatoMakino/qiita-to-md.git --save-dev
```

### Add Token file

create `.qiita_token.json` and write your api token.

```.qiita_token.json
{
  "user_id": "your id",
  "token":"your token <40 Characters>"
}
```

The path of the token file can be changed optionally.

### run node script

```node.js
const qiitaToMD = require("qiita-to-md");
qiitaToMD.JsonGenerator.generate();
```

## License

[MIT licensed](LICENSE).