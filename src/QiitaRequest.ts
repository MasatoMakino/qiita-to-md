import * as https from "https";
import { URLSearchParams } from "url";

export class QiitaRequest {
  public static endPoint: string = "qiita.com";
  public static token: string;

  static generateGetOption(path: string): https.RequestOptions {
    return {
      method: "GET",
      host: QiitaRequest.endPoint,
      path,
      headers: {
        Authorization: "Bearer " + QiitaRequest.token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
  }

  public static async getAuthenticatedUser() {
    const option = this.generateGetOption(`/api/v2/authenticated_user`);
    return this.getRequest(option);
  }

  public static async listAuthenticatedUserItems(param: {
    page: string;
    per_page: string;
  }) {
    const option = this.generateGetOption(
      `/api/v2/authenticated_user/items?${new URLSearchParams(
        param
      ).toString()}`
    );
    return this.getRequest(option);
  }

  /**
   * httpsリクエストを発行する。
   * @param option
   */
  public static async getRequest(option: https.RequestOptions) {
    return new Promise((resolve, reject) => {
      https
        .request(option, (res) => {
          let char = "";
          if (res.statusCode === 200 || res.statusCode === 202) {
            res
              .on("data", (chunk) => {
                char += chunk;
              })
              .on("end", () => {
                resolve(JSON.parse(char));
              });
          } else {
            reject("error");
          }
        })
        .end();
    });
  }
}
