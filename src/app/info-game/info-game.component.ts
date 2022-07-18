import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Spieltag } from "../classes/spieltag";

@Component({
  templateUrl: "./info-game.component.html",
  styleUrls: ["./info-game.component.css"],
})
export class InfoGameComponent implements OnInit {
  public spieltag: Spieltag;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Spieltag) {
    this.spieltag = data;
  }

  ngOnInit(): void {}
}
