# qiita-to-md

Markdown generator from qiita.com

[![Maintainability](https://api.codeclimate.com/v1/badges/85442a6c02c73e0f380a/maintainability)](https://codeclimate.com/github/MasatoMakino/qiita-to-md/maintainability)

## Getting Started

### Install

```bash
npm install https://github.com/MasatoMakino/qiita-to-md.git --save-dev
```

### Add Token file

create `.qiita_token.json` and write your [api access token](https://qiita.com/api/v2/docs#%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3).

```json
{
  "user_id": "your id",
  "token": "your token <40 Characters>"
}
```

The path of the token file can be changed optionally.

### run node script

```js
const qiitaToMD = require("qiita-to-md");
qiitaToMD.JsonGenerator.generate();
```

### run on CLI

```shell
npx @masatomakino/qiita-to-md
```

## License

[MIT licensed](LICENSE).
