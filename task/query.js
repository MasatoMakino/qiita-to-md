import { QiitaRequest } from "../bin";
import path from "path";
import { createRequire } from "module";

const tokenPath = path.resolve(".qiita_token.json");
const require = createRequire(import.meta.url);
const tokenSetting = require(tokenPath);

QiitaRequest.token = tokenSetting.token;

/**
 * Qiitaの認証が正常に通るかの確認。
 * @returns {Promise<void>}
 */
const test = async () => {
  const user = await QiitaRequest.getAuthenticatedUser();
  console.log(user);

  const items = await QiitaRequest.listAuthenticatedUserItems({
    page: "1",
    per_page: "50",
  });
  console.log(items);
};
test();
