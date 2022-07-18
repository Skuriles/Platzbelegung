import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Spieltag } from "../classes/spieltag";

@Component({
  selector: "app-edit-match-day",
  templateUrl: "./edit-match-day.component.html",
  styleUrls: ["./edit-match-day.component.css"],
})
export class EditMatchDayComponent implements OnInit {
  public spieltag: Spieltag;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Spieltag) {
    this.spieltag = data;
    this.spieltag.datum = this.spieltag.date.toISO();
  }

  ngOnInit(): void {}
}
