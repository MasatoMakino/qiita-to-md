import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { AuthenticatedUser, Item } from "./qiita-types";

export class QiitaRequest {
  public static endPoint: string = "qiita.com";
  public static token: string;

  /**
   * データ取得用のリクエストヘッダーを生成する。
   */
  static generateRequestHeader() {
    if (QiitaRequest.token == undefined) {
      throw new Error(
        "リクエストを発行する前に、Qiitaのリクエストトークンを初期化してください。"
      );
    }

    return {
      Authorization: "Bearer " + QiitaRequest.token,
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
    };
  }

  public static async getAuthenticatedUser(): Promise<AuthenticatedUser> {
    return this.getRequest(
      `/api/v2/authenticated_user`,
      QiitaRequest.generateRequestHeader()
    ) as Promise<AuthenticatedUser>;
  }

  public static async listAuthenticatedUserItems(param: {
    page: string;
    per_page: string;
  }): Promise<Item[]> {
    const path = `/api/v2/authenticated_user/items?${new URLSearchParams(
      param
    ).toString()}`;
    return this.getRequest(
      path,
      QiitaRequest.generateRequestHeader()
    ) as Promise<Item[]>;
  }

  /**
   * httpsリクエストを発行する。
   * @param path https://<endPoint>/APIのパス
   * @param headers リクエストヘッダー
   */
  static async getRequest(path: string, headers: {}) {
    const response = await fetch(`https://${QiitaRequest.endPoint}/${path}`, {
      headers,
    });
    return await response.json();
  }
}
