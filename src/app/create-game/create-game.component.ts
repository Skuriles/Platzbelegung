import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DateTime } from "luxon";
import { Spieltag } from "../classes/spieltag";

@Component({
  selector: "app-create-game",
  templateUrl: "./create-game.component.html",
  styleUrls: ["./create-game.component.css"],
})
export class CreateGameComponent implements OnInit {
  public spieltag: Spieltag;
  constructor() {
    this.spieltag = new Spieltag();
    this.spieltag.date = DateTime.local();
    this.spieltag.datum = this.spieltag.date.toISO();
  }

  ngOnInit(): void {}
}
