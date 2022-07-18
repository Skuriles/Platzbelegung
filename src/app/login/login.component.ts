import { Component, OnInit } from "@angular/core";
import { Credentials } from "../classes/credentials";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public credentials: Credentials;

  constructor() {}

  ngOnInit(): void {
    this.credentials = new Credentials();
  }

  public checkName(): boolean {
    return !this.credentials.name || !this.credentials.pw;
  }
}
