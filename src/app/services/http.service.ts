import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenData } from "../classes/tokenData";
import { Spieltag } from "../classes/spieltag";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public token: TokenData;
//   private baseUrl = "http://localhost:65004/wptest_master/";
  private baseUrl = "https://www.sv-deggenhausertal.de/";
  private apiPrefix = this.baseUrl + "wp-json/";

  public getApiInfo() {
    const nodeUrl = this.apiPrefix;
    return this.getRequest(nodeUrl);
  }

  public test() {
    const nodeUrl = this.apiPrefix + "svd_sportheim/v1/author/1";
    return this.getRequest(nodeUrl);
  }

  public getUserRole(id) {
    const nodeUrl = this.apiPrefix + "svd_sportheim/v1/userInfo/" + id;
    return this.postAuthRequest(nodeUrl, null);
  }

  public login(userName: string, pw: string) {
    const nodeUrl =
      this.baseUrl +
      "?rest_route=/admin/auth&username=" +
      userName +
      "&password=" +
      pw;
    const body = {};
    return this.postRequest(nodeUrl, body);
  }

  public tokenCheck() {
    if (this.token && this.token.data.jwt) {
      const nodeUrl = this.baseUrl + "?rest_route=/admin/auth/validate";
      return this.getAuthRequest(nodeUrl);
    }
    return null;
  }

  public getAllData() {
    const nodeUrl = this.apiPrefix + "svd_sportheim/v1/getAll";
    return this.postRequest(nodeUrl, null);
  }

  public saveGame(element: Spieltag) {
    const nodeUrl = this.apiPrefix + "svd_sportheim/v1/saveGame";
    const body = { element };
    return this.postAuthRequest(nodeUrl, body);
  }

  public addGame(element: Spieltag) {
    const nodeUrl = this.apiPrefix + "svd_sportheim/v1/addGame";
    const body = { element };
    return this.postAuthRequest(nodeUrl, body);
  }

  public deleteGame(id: number) {
    const nodeUrl = this.apiPrefix + "svd_sportheim/v1/deleteGame/" + id;
    return this.postAuthRequest(nodeUrl, null);
  }

  public uploadCsv(files: File[]) {
    const nodeUrl = this.apiPrefix + "svd_sportheim/v1/uploadCsv";
    return this.postAuthUploadRequest(nodeUrl, files);
  }
  // default http requests
  private postRequest(nodeUrl: string, body: any) {
    return this.http.post(nodeUrl, body);
  }

  private getRequest(nodeUrl: string) {
    return this.http.get(nodeUrl);
  }

  private postAuthRequest(nodeUrl: string, body: any) {
    return this.http.post(nodeUrl, body, {
      headers: new HttpHeaders().set("authorization", this.token.data.jwt),
    });
  }

  private postAuthUploadRequest(nodeUrl: string, files: File[]) {
    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file);
    }
    const header = new HttpHeaders().set("authorization", this.token.data.jwt);
    header.set("Content-Type", []);
    return this.http.post(nodeUrl, formData, {
      headers: header,
    });
  }

  private getAuthRequest(nodeUrl: string) {
    return this.http.get(nodeUrl, {
      headers: new HttpHeaders().set("authorization", this.token.data.jwt),
    });
  }
}
