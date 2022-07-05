const qd = require("../bin");
const path = require("path");

const tokenPath = path.resolve(".qiita_token.json");
const tokenSetting = require(tokenPath);

qd.QiitaRequest.token = tokenSetting.token;

const test = async () => {
  const user = await qd.QiitaRequest.getAuthenticatedUser();
  console.log(user);

  const items = await qd.QiitaRequest.listAuthenticatedUserItems({
    page: "1",
    per_page: "50",
  });
  console.log(items);
};
test();
