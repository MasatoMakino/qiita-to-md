import * as https from "https";
import { URLSearchParams } from "url";
import { AuthenticatedUser, Item } from "./qiita-types";

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

  public static async getAuthenticatedUser(): Promise<AuthenticatedUser> {
    const option = this.generateGetOption(`/api/v2/authenticated_user`);
    return this.getRequest(option) as Promise<AuthenticatedUser>;
  }

  public static async listAuthenticatedUserItems(param: {
    page: string;
    per_page: string;
  }): Promise<Item[]> {
    const option = this.generateGetOption(
      `/api/v2/authenticated_user/items?${new URLSearchParams(
        param
      ).toString()}`
    );
    return this.getRequest(option) as Promise<Item[]>;
  }

  /**
   * httpsリクエストを発行する。
   * @param option
   */
  static async getRequest(option: https.RequestOptions) {
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
