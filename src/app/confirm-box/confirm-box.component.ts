import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Spieltag } from "../classes/spieltag";

@Component({
  selector: "app-confirm-box",
  templateUrl: "./confirm-box.component.html",
  styleUrls: ["./confirm-box.component.css"],
})
export class ConfirmBoxComponent implements OnInit {
  public spieltag: Spieltag;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Spieltag) {
    this.spieltag = data;
  }

  ngOnInit(): void {}
}
