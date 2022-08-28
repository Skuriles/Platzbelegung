import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenData } from "../classes/tokenData";
import { SvdEvent } from "../classes/svdEvent";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient) {
    if (!environment.production) {
      this.baseUrl = "http://localhost:65004/svd/";
    } else {
      this.baseUrl = "https://www.sv-deggenhausertal.de/";
    }
    this.apiPrefix = this.baseUrl + "wp-json/";
  }

  public token: TokenData;
  private baseUrl: string;
  private apiPrefix: string;

  public getApiInfo() {
    const nodeUrl = this.apiPrefix;
    return this.getRequest(nodeUrl);
  }

  public test() {
    const nodeUrl = this.apiPrefix + "svd_platzbelegung/v1/author/1";
    return this.getRequest(nodeUrl);
  }

  public getUserRole(id) {
    const nodeUrl = this.apiPrefix + "svd_platzbelegung/v1/userInfo/" + id;
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
    const nodeUrl = this.apiPrefix + "svd_platzbelegung/v1/getAll";
    return this.postRequest(nodeUrl, null);
  }

  public getAllGames() {
    const nodeUrl = this.apiPrefix + "svd_platzbelegung/v1/getAllGames";
    return this.postRequest(nodeUrl, null);
  }

  public saveEvent(element: SvdEvent) {
    const nodeUrl = this.apiPrefix + "svd_platzbelegung/v1/saveEvent";
    const body = { element };
    return this.postAuthRequest(nodeUrl, body);
  }

  public saveEventAll(element: SvdEvent) {
    const nodeUrl = this.apiPrefix + "svd_platzbelegung/v1/saveEventAll";
    const body = { element };
    return this.postAuthRequest(nodeUrl, body);
  }

  public addEvent(element: SvdEvent) {
    const nodeUrl = this.apiPrefix + "svd_platzbelegung/v1/addEvent";
    const body = { element };
    return this.postAuthRequest(nodeUrl, body);
  }

  public deleteEvent(id: number) {
    const nodeUrl = this.apiPrefix + "svd_platzbelegung/v1/deleteEvent/" + id;
    return this.postAuthRequest(nodeUrl, null);
  }

  public deleteAllEvent(id: number) {
    const nodeUrl =
      this.apiPrefix + "svd_platzbelegung/v1/deleteEventAll/" + id;
    return this.postAuthRequest(nodeUrl, null);
  }

  // public uploadCsv(files: File[]) {
  //   const nodeUrl = this.apiPrefix + "svd_platzbelegung/v1/uploadCsv";
  //   return this.postAuthUploadRequest(nodeUrl, files);
  // }
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
