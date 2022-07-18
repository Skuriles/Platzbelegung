import { Injectable, OnInit } from "@angular/core";
import { ERoles } from "../enum/roles";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  public loggedIn = false;
  public userRole: ERoles = ERoles.loggedOff;

  constructor() {}

  public setRoles(info: string[]) {
    for (const role of info) {
      switch (role) {
        case "subscriber":
          if (this.userRole < ERoles.subscriber) {
            this.userRole = ERoles.subscriber;
          }
          break;
        case "contributor":
          if (this.userRole < ERoles.contributor) {
            this.userRole = ERoles.contributor;
          }
          break;

        case "author":
          if (this.userRole < ERoles.author) {
            this.userRole = ERoles.author;
          }
          break;

        case "editor":
          if (this.userRole < ERoles.editor) {
            this.userRole = ERoles.editor;
          }
          break;

        case "administrator":
          if (this.userRole < ERoles.administrator) {
            this.userRole = ERoles.administrator;
          }
          break;
      }
    }
  }
}
